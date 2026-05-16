import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { Play, Send, Clock, ChevronLeft, AlertCircle, Wifi, WifiOff, Users, Trophy, MessageSquare } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import useWebSocket from '../hooks/useWebSocket';

export default function BattleRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Real-time integration
  const { isConnected, messages, leaderboard, sendChatMessage } = useWebSocket(roomId);
  
  const [room, setRoom] = useState(null);
  const [question, setQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(3600);
  
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('// Write your solution here\n\nfunction solve() {\n  \n}\n');
  const [output, setOutput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [activeTab, setActiveTab] = useState('problem'); // problem, leaderboard
  const [notifications, setNotifications] = useState([]);

  // Handle incoming websocket events for toasts
  useEffect(() => {
    if (messages.length === 0) return;
    const latest = messages[messages.length - 1];
    
    // Create a toast notification
    const id = Date.now();
    setNotifications(prev => [...prev, { id, ...latest }]);
    
    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  }, [messages]);

  useEffect(() => {
    const fetchBattleData = async () => {
      try {
        setIsLoading(true);
        // In a real app, fetch the actual room and assigned question
        setRoom({ id: roomId, name: "Live Battle Arena", maxPlayers: 4 });
        setQuestion({
          title: "Two Sum",
          difficulty: "EASY",
          description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
          examples: [
            "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1]."
          ],
          constraints: [
            "2 <= nums.length <= 10^4",
            "-10^9 <= nums[i] <= 10^9",
            "-10^9 <= target <= 10^9"
          ]
        });
      } catch (err) {
        console.error("Failed to load battle", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBattleData();
  }, [roomId]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setOutput('Submitting solution to server...\n\nResult: Accepted!\nScore: +100');
      // A real app would hit POST /submissions, which then triggers the broadcast
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Sort leaderboard descending
  const sortedLeaderboard = Object.entries(leaderboard).sort((a, b) => b[1] - a[1]);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans relative overflow-hidden">
      
      {/* Toast Notifications */}
      <div className="absolute top-20 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="bg-surface border border-border shadow-lg rounded-xl p-4 flex items-center min-w-[250px] pointer-events-auto"
            >
              {notif.type === 'JOIN' && <Users className="text-blue-500 mr-3" size={20} />}
              {notif.type === 'SCORE_UPDATE' && <Trophy className="text-orange-500 mr-3" size={20} />}
              {notif.type === 'CHAT' && <MessageSquare className="text-gray-500 mr-3" size={20} />}
              <div>
                <p className="text-sm font-bold text-text-main">{notif.senderUsername}</p>
                <p className="text-xs text-text-secondary">{notif.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Top Navbar */}
      <header className="bg-surface border-b border-border h-16 flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/battles')}
            className="text-text-secondary hover:text-primary transition-colors flex items-center"
          >
            <ChevronLeft size={20} />
            <span className="ml-1 font-medium hidden md:inline">Leave</span>
          </button>
          <div className="h-6 w-px bg-border"></div>
          <h1 className="font-bold text-lg text-text-main truncate">{room?.name}</h1>
          <div className="flex items-center ml-2 text-xs font-medium">
            {isConnected ? (
              <span className="flex items-center text-green-600 bg-green-100 px-2 py-1 rounded-full">
                <Wifi size={12} className="mr-1" /> Live
              </span>
            ) : (
              <span className="flex items-center text-red-600 bg-red-100 px-2 py-1 rounded-full">
                <WifiOff size={12} className="mr-1" /> Connecting...
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center text-primary font-mono bg-primary/10 px-4 py-1.5 rounded-lg font-bold">
            <Clock size={16} className="mr-2" />
            {formatTime(timeLeft)}
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => setOutput('Running code locally...\nPassed 2/2 sample cases.')}
              className="btn-secondary py-1.5 px-4 text-sm flex items-center"
            >
              <Play size={16} className="mr-2" /> Run
            </button>
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting || !isConnected}
              className="btn-primary py-1.5 px-4 text-sm flex items-center"
            >
              <Send size={16} className="mr-2" /> {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Panel: Tabs */}
        <div className="w-full lg:w-1/3 bg-surface border-r border-border flex flex-col">
          
          <div className="flex border-b border-border">
            <button 
              onClick={() => setActiveTab('problem')}
              className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'problem' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-main'}`}
            >
              Problem Statement
            </button>
            <button 
              onClick={() => setActiveTab('leaderboard')}
              className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors flex items-center justify-center ${activeTab === 'leaderboard' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-main'}`}
            >
              <Trophy size={16} className="mr-2" /> Live Leaderboard
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'problem' ? (
                <motion.div 
                  key="problem"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">{question?.title}</h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      question?.difficulty === 'EASY' ? 'bg-green-100 text-green-700' :
                      question?.difficulty === 'MEDIUM' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {question?.difficulty}
                    </span>
                  </div>
                  
                  <div className="prose prose-sm max-w-none text-text-secondary mb-8 whitespace-pre-wrap">
                    {question?.description}
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold text-text-main mb-3">Examples</h3>
                      {question?.examples.map((ex, idx) => (
                        <div key={idx} className="bg-background rounded-xl p-4 border border-border mb-3 font-mono text-sm text-text-secondary whitespace-pre-wrap">
                          {ex}
                        </div>
                      ))}
                    </div>

                    <div>
                      <h3 className="font-bold text-text-main mb-3 flex items-center">
                        <AlertCircle size={16} className="mr-2 text-primary" /> Constraints
                      </h3>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-text-secondary">
                        {question?.constraints.map((c, idx) => (
                          <li key={idx} className="font-mono bg-background/50 inline-block px-1 py-0.5 rounded text-xs">{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="leaderboard"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {sortedLeaderboard.length === 0 ? (
                    <div className="text-center py-10 text-text-secondary">
                      <Trophy size={48} className="mx-auto mb-4 opacity-20" />
                      <p>Waiting for first blood...</p>
                      <p className="text-xs mt-2">Scores will appear here automatically.</p>
                    </div>
                  ) : (
                    sortedLeaderboard.map(([username, score], idx) => (
                      <div key={username} className={`p-4 rounded-xl border flex items-center justify-between ${
                        idx === 0 ? 'bg-yellow-50 border-yellow-200' : 
                        idx === 1 ? 'bg-gray-50 border-gray-200' : 
                        idx === 2 ? 'bg-orange-50 border-orange-200' : 'bg-background border-border'
                      }`}>
                        <div className="flex items-center">
                          <span className="font-black text-xl w-8 text-text-secondary">#{idx + 1}</span>
                          <span className="font-bold text-text-main">{username}</span>
                          {username === user?.username && <span className="ml-2 text-[10px] bg-primary text-white px-2 py-0.5 rounded-full uppercase">You</span>}
                        </div>
                        <span className="font-mono font-bold text-primary">{score} pts</span>
                      </div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Panel: Editor & Output */}
        <div className="w-full lg:w-2/3 flex flex-col bg-[#1E1E1E]">
          {/* Editor Header */}
          <div className="h-12 bg-[#2D2D2D] flex items-center justify-between px-4 shrink-0">
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-[#1E1E1E] text-gray-300 text-sm border border-[#404040] rounded px-3 py-1 focus:outline-none focus:border-primary"
            >
              <option value="javascript">JavaScript (Node.js)</option>
              <option value="python">Python 3</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val)}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                lineHeight: 24,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                formatOnPaste: true,
              }}
            />
          </div>

          {/* Output Panel */}
          <div className="h-48 bg-[#1E1E1E] border-t border-[#404040] flex flex-col shrink-0">
            <div className="h-8 bg-[#2D2D2D] flex items-center px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
              Console Output
            </div>
            <div className="flex-1 p-4 overflow-y-auto font-mono text-sm text-gray-300 whitespace-pre-wrap">
              {output || "Run your code to see output here."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
