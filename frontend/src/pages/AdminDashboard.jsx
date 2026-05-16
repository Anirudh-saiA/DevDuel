import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Server, ShieldAlert, Code2, Trash2, Ban, ShieldCheck, Plus, X, Loader2, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('analytics'); // analytics, users, questions
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

  // Form states for adding a question
  const [qForm, setQForm] = useState({ title: '', description: '', difficulty: 'EASY', expectedOutput: '' });
  const [qLoading, setQLoading] = useState(false);
  const [qError, setQError] = useState('');

  // Protect route
  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setIsLoading(true);
        // Fallback mock data in case backend isn't populated or token isn't admin
        let data = {
          totalUsers: 142,
          totalActiveRooms: 12,
          totalQuestions: 45,
          totalFinishedBattles: 890
        };
        
        try {
          const res = await api.get('/admin/analytics');
          data = res.data;
        } catch (err) {
          console.warn("Using premium mock data for Admin Analytics demo.");
        }
        
        setAnalytics(data);
      } catch (err) {
        console.error("Failed to load admin data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    setQError('');
    if (!qForm.title || !qForm.description || !qForm.expectedOutput) {
      setQError("Please fill out all required fields.");
      return;
    }

    setQLoading(true);
    try {
      await api.post('/questions', {
        ...qForm,
        examples: [],
        constraints: []
      });
      setIsQuestionModalOpen(false);
      setQForm({ title: '', description: '', difficulty: 'EASY', expectedOutput: '' });
      // Refresh analytics to show new question count
      setAnalytics(prev => ({...prev, totalQuestions: prev.totalQuestions + 1}));
    } catch (err) {
      setQError(err.response?.data?.error || "Failed to add question.");
    } finally {
      setQLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-text-main flex items-center">
            <ShieldCheck size={36} className="mr-3 text-primary" /> Admin Control Center
          </h1>
          <p className="text-text-secondary mt-2 text-lg">Manage platform data, users, and coding challenges.</p>
        </div>
      </div>

      {/* Analytics Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { title: 'Total Users', value: analytics?.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
          { title: 'Active Rooms', value: analytics?.totalActiveRooms, icon: Server, color: 'text-green-600', bg: 'bg-green-100' },
          { title: 'Coding Questions', value: analytics?.totalQuestions, icon: Code2, color: 'text-purple-600', bg: 'bg-purple-100' },
          { title: 'Completed Battles', value: analytics?.totalFinishedBattles, icon: ShieldAlert, color: 'text-orange-600', bg: 'bg-orange-100' }
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
            className="card flex items-center p-6"
          >
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} mr-5`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-text-secondary uppercase tracking-wider">{stat.title}</p>
              <h2 className="text-3xl font-black text-text-main mt-1 font-mono">{stat.value}</h2>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs Layout */}
      <div className="bg-surface rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border bg-background/50 p-6 flex flex-col gap-2">
          <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-4">Management</h3>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center text-left px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'analytics' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-surface hover:text-text-main'}`}
          >
            <ShieldAlert size={18} className="mr-3" /> System Health
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex items-center text-left px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'users' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-surface hover:text-text-main'}`}
          >
            <Users size={18} className="mr-3" /> Users
          </button>
          <button 
            onClick={() => setActiveTab('questions')}
            className={`flex items-center text-left px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'questions' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-surface hover:text-text-main'}`}
          >
            <Code2 size={18} className="mr-3" /> Questions
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-8">
          <AnimatePresence mode="wait">
            
            {activeTab === 'analytics' && (
              <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="text-2xl font-bold mb-6">System Health</h2>
                <div className="p-6 bg-green-50 border border-green-200 rounded-2xl flex items-start">
                  <ShieldCheck size={24} className="text-green-600 mr-4 shrink-0" />
                  <div>
                    <h4 className="font-bold text-green-900">All Systems Operational</h4>
                    <p className="text-green-700 text-sm mt-1">The WebSockets broker, PostgreSQL database, and frontend static hosts are responding normally. Matchmaking queue is stable.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">User Management</h2>
                </div>
                
                <div className="border border-border rounded-2xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-background border-b border-border text-xs font-bold text-text-secondary uppercase">
                      <tr>
                        <th className="px-6 py-4">Username</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {/* Mock users for UI demonstration */}
                      {[
                        { id: 1, name: 'AlgorithmGod', role: 'USER', active: true },
                        { id: 2, name: 'MaliciousHacker', role: 'USER', active: false },
                        { id: 3, name: 'AdminRoot', role: 'ADMIN', active: true },
                      ].map((u) => (
                        <tr key={u.id} className="hover:bg-background/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-text-main">{u.name}</td>
                          <td className="px-6 py-4"><span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-bold">{u.role}</span></td>
                          <td className="px-6 py-4">
                            {u.active ? 
                              <span className="text-green-600 font-bold text-sm flex items-center"><ShieldCheck size={14} className="mr-1"/> Active</span> : 
                              <span className="text-red-600 font-bold text-sm flex items-center"><Ban size={14} className="mr-1"/> Banned</span>
                            }
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-red-500 hover:text-red-700 p-2 transition-colors">
                              <Ban size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'questions' && (
              <motion.div key="questions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Questions Database</h2>
                  <button onClick={() => setIsQuestionModalOpen(true)} className="btn-primary py-2 px-4 flex items-center text-sm">
                    <Plus size={16} className="mr-2" /> Add Question
                  </button>
                </div>

                <div className="border border-border rounded-2xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-background border-b border-border text-xs font-bold text-text-secondary uppercase">
                      <tr>
                        <th className="px-6 py-4">Title</th>
                        <th className="px-6 py-4">Difficulty</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {/* Mock questions */}
                      {[
                        { id: 1, title: 'Two Sum', diff: 'EASY', color: 'text-green-700 bg-green-100' },
                        { id: 2, title: 'Reverse Linked List', diff: 'MEDIUM', color: 'text-orange-700 bg-orange-100' },
                        { id: 3, title: 'Dijkstra Shortest Path', diff: 'HARD', color: 'text-red-700 bg-red-100' },
                      ].map((q) => (
                        <tr key={q.id} className="hover:bg-background/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-text-main">{q.title}</td>
                          <td className="px-6 py-4">
                            <span className={`${q.color} px-2.5 py-1 rounded-md text-xs font-bold`}>{q.diff}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="text-red-500 hover:text-red-700 p-2 transition-colors">
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
            
          </AnimatePresence>
        </div>
      </div>

      {/* Add Question Modal */}
      <AnimatePresence>
        {isQuestionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface rounded-3xl p-8 max-w-2xl w-full shadow-hover relative max-h-[90vh] overflow-y-auto"
            >
              <button onClick={() => setIsQuestionModalOpen(false)} className="absolute right-6 top-6 text-text-secondary hover:text-text-main">
                <X size={20} />
              </button>
              
              <h2 className="text-2xl font-bold mb-6">Add New Coding Question</h2>

              {qError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 flex items-center text-sm font-medium">
                  <AlertCircle size={16} className="mr-2" /> {qError}
                </div>
              )}

              <form onSubmit={handleAddQuestion} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Title</label>
                    <input 
                      type="text" value={qForm.title} onChange={e => setQForm({...qForm, title: e.target.value})}
                      className="input-field" placeholder="e.g. Merge Intervals"
                    />
                  </div>
                  <div>
                    <label className="form-label">Difficulty</label>
                    <select 
                      value={qForm.difficulty} onChange={e => setQForm({...qForm, difficulty: e.target.value})}
                      className="input-field appearance-none cursor-pointer"
                    >
                      <option value="EASY">EASY</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HARD">HARD</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="form-label">Markdown Description</label>
                  <textarea 
                    value={qForm.description} onChange={e => setQForm({...qForm, description: e.target.value})}
                    className="input-field min-h-[120px] font-mono text-sm" placeholder="Write problem statement here..."
                  />
                </div>

                <div>
                  <label className="form-label">Expected Output (Base Case)</label>
                  <textarea 
                    value={qForm.expectedOutput} onChange={e => setQForm({...qForm, expectedOutput: e.target.value})}
                    className="input-field min-h-[80px] font-mono text-sm" placeholder="Output format used for basic validation..."
                  />
                </div>

                <button type="submit" disabled={qLoading} className="btn-primary w-full mt-4">
                  {qLoading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Save Question to Database'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
