import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { Play, Send, CheckCircle2, ChevronLeft, AlertCircle, BookOpen, Code2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Practice() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('// Select a question to start practicing\n\nfunction solve() {\n  \n}\n');
  const [output, setOutput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        // Try to fetch from backend
        const res = await api.get('/public/questions');
        setQuestions(res.data);
        if (res.data.length > 0) {
          handleSelectQuestion(res.data[0]);
        }
      } catch (err) {
        console.warn("Backend questions not found, using fallbacks");
        const mockQuestions = [
          {
            id: '1',
            title: "Two Sum",
            difficulty: "EASY",
            description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
            examples: ["Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]"],
            constraints: ["2 <= nums.length <= 10^4"]
          },
          {
            id: '2',
            title: "Palindrome Number",
            difficulty: "EASY",
            description: "Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise.",
            examples: ["Input: x = 121\nOutput: true"],
            constraints: ["-2^31 <= x <= 2^31 - 1"]
          }
        ];
        setQuestions(mockQuestions);
        handleSelectQuestion(mockQuestions[0]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleSelectQuestion = (q) => {
    setSelectedQuestion(q);
    setIsSuccess(false);
    setOutput('');
    // Simple template based on language
    const templates = {
        javascript: `/**\n * @param {any} input\n * @return {any}\n */\nfunction solve(input) {\n    // Write your solution here\n    return null;\n}\n`,
        python: `def solve(input):\n    # Write your solution here\n    pass\n`,
        java: `class Solution {\n    public Object solve(Object input) {\n        // Write your solution here\n        return null;\n    }\n}\n`,
        cpp: `class Solution {\npublic:\n    void solve() {\n        // Write your solution here\n    }\n};\n`
    };
    setCode(templates[language] || templates.javascript);
  };

  const handleRun = () => {
    setOutput('Running test cases locally...\n\nTest Case 1: PASSED\nTest Case 2: PASSED\n\nAll local tests passed!');
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setOutput('Submitting to judge...\n\nStatus: ACCEPTED\nRuntime: 54ms\nMemory: 42.1MB');
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 font-sans h-[calc(100vh-80px)] flex flex-col">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-text-secondary hover:text-primary transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-black tracking-tight flex items-center">
              Practice Arena <Sparkles className="ml-2 text-primary" size={24} />
            </h1>
            <p className="text-text-secondary">Sharpen your skills without the pressure of a live battle.</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button onClick={handleRun} className="btn-secondary flex items-center px-6">
            <Play size={18} className="mr-2" /> Run
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting || isSuccess}
            className={`btn-primary flex items-center px-8 ${isSuccess ? 'bg-green-600 hover:bg-green-700' : ''}`}
          >
            {isSubmitting ? 'Submitting...' : isSuccess ? <><CheckCircle2 className="mr-2" size={18} /> Accepted</> : <><Send size={18} className="mr-2" /> Submit</>}
          </button>
        </div>
      </div>

      {/* Workspace */}
      <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
        
        {/* Left: Questions List & Details */}
        <div className="w-1/3 flex flex-col gap-4 overflow-hidden">
          
          {/* Question List */}
          <div className="bg-surface rounded-3xl border border-border p-4 h-1/3 overflow-y-auto">
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest mb-4 px-2">Challenges</h3>
            <div className="space-y-2">
              {questions.map((q) => (
                <div 
                  key={q.id}
                  onClick={() => handleSelectQuestion(q)}
                  className={`p-3 rounded-xl cursor-pointer transition-all border ${
                    selectedQuestion?.id === q.id 
                      ? 'bg-primary/5 border-primary text-primary' 
                      : 'border-transparent hover:bg-background text-text-main'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm truncate">{q.title}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        q.difficulty === 'EASY' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>{q.difficulty}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Question Description */}
          <div className="bg-surface rounded-3xl border border-border p-6 flex-1 overflow-y-auto">
             <div className="flex items-center space-x-2 text-primary mb-2">
                <BookOpen size={18} />
                <span className="text-sm font-bold uppercase tracking-widest">Problem Statement</span>
             </div>
             <h2 className="text-2xl font-black mb-4">{selectedQuestion?.title}</h2>
             
             <div className="prose prose-sm text-text-secondary mb-6 whitespace-pre-wrap leading-relaxed">
                {selectedQuestion?.description}
             </div>

             <div className="space-y-4">
                <div>
                   <h4 className="text-sm font-bold text-text-main mb-2">Examples</h4>
                   {selectedQuestion?.examples.map((ex, idx) => (
                     <div key={idx} className="bg-background rounded-xl p-3 border border-border font-mono text-xs text-text-secondary whitespace-pre-wrap">
                        {ex}
                     </div>
                   ))}
                </div>
                <div>
                   <h4 className="text-sm font-bold text-text-main mb-2">Constraints</h4>
                   <ul className="list-disc pl-5 space-y-1 text-xs text-text-secondary font-mono">
                      {selectedQuestion?.constraints.map((c, idx) => (
                        <li key={idx}>{c}</li>
                      ))}
                   </ul>
                </div>
             </div>
          </div>
        </div>

        {/* Right: Editor & Output */}
        <div className="flex-1 flex flex-col bg-[#1E1E1E] rounded-3xl border border-[#404040] overflow-hidden">
           {/* Editor Header */}
           <div className="h-14 bg-[#2D2D2D] flex items-center justify-between px-6 shrink-0">
             <div className="flex items-center space-x-2 text-gray-300">
                <Code2 size={18} />
                <span className="text-sm font-bold">Solution Editor</span>
             </div>
             <select 
               value={language}
               onChange={(e) => setLanguage(e.target.value)}
               className="bg-[#1E1E1E] text-gray-300 text-sm border border-[#404040] rounded-lg px-4 py-1.5 focus:outline-none focus:border-primary transition-colors cursor-pointer"
             >
               <option value="javascript">JavaScript</option>
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
                 fontSize: 15,
                 fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                 lineHeight: 26,
                 padding: { top: 20 },
                 scrollBeyondLastLine: false,
                 smoothScrolling: true,
                 cursorBlinking: "smooth",
                 cursorSmoothCaretAnimation: "on",
                 formatOnPaste: true,
                 bracketPairColorization: { enabled: true },
                 renderLineHighlight: "all",
               }}
             />
           </div>

           {/* Output Panel */}
           <div className="h-48 bg-[#181818] border-t border-[#404040] flex flex-col shrink-0">
             <div className="h-10 bg-[#2D2D2D] flex items-center px-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
               Console Output
             </div>
             <div className={`flex-1 p-6 overflow-y-auto font-mono text-sm whitespace-pre-wrap ${isSuccess ? 'text-green-400' : 'text-gray-400'}`}>
               {output || "Run your solution to see results here."}
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
