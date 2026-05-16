import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code2, Trophy, GitCommit, Search, ExternalLink, Zap, Star, Loader2 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function GitLobby() {
  const { user } = useAuth();
  const [gitUsers, setGitUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchGitLeaderboard = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/profile/leaderboard/commits'); // We'll need this endpoint
        setGitUsers(res.data);
      } catch (err) {
        console.error("Failed to load git leaderboard", err);
        // Mock data for demo
        setGitUsers([
          { username: "CodeMaster", githubUsername: "gaearon", commitCount: 12540, rating: 2400 },
          { username: "ReactQueen", githubUsername: "sophiebits", commitCount: 8420, rating: 2250 },
          { username: "DevDueler", githubUsername: "Anirudh-saiA", commitCount: 450, rating: 1850 },
          { username: "ByteNinja", githubUsername: "yyx990803", commitCount: 15200, rating: 2100 },
        ].sort((a, b) => b.commitCount - a.commitCount));
      } finally {
        setIsLoading(false);
      }
    };
    fetchGitLeaderboard();
  }, []);

  const filteredUsers = gitUsers.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.githubUsername?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center space-x-2 text-[#24292F] mb-2">
            <Code2 size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Open Source Arena</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-text-main">Git Battles</h1>
          <p className="text-text-secondary mt-2 text-lg">Compete based on your real-world coding activity on GitHub.</p>
        </div>
        
        <div className="bg-surface border border-border p-4 rounded-3xl flex items-center shadow-sm">
          <div className="mr-4 bg-[#F6F8FA] p-3 rounded-2xl">
            <GitCommit className="text-[#24292F]" size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Global Commits</p>
            <p className="text-xl font-black text-text-main">1.2M+</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-10 max-w-xl group">
        <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl group-hover:bg-primary/10 transition-all -z-10"></div>
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="Search developers or GitHub handles..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field pl-14 py-4 text-base bg-surface border-border/50 focus:border-primary shadow-sm"
        />
      </div>

      {/* Leaderboard Table */}
      <div className="bg-surface rounded-[2.5rem] border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/50 border-b border-border">
                <th className="px-8 py-5 text-[10px] font-black text-text-secondary uppercase tracking-widest">Rank</th>
                <th className="px-8 py-5 text-[10px] font-black text-text-secondary uppercase tracking-widest">Developer</th>
                <th className="px-8 py-5 text-[10px] font-black text-text-secondary uppercase tracking-widest text-center">Commits</th>
                <th className="px-8 py-5 text-[10px] font-black text-text-secondary uppercase tracking-widest text-center">Skill Rating</th>
                <th className="px-8 py-5 text-[10px] font-black text-text-secondary uppercase tracking-widest text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-primary" size={32} />
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-text-secondary">
                    No developers found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, idx) => (
                  <motion.tr 
                    key={u.username}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-primary/[0.02] transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center">
                         {idx === 0 ? <Trophy className="text-yellow-500 mr-2" size={18} /> : 
                          idx === 1 ? <Trophy className="text-gray-400 mr-2" size={18} /> :
                          idx === 2 ? <Trophy className="text-orange-400 mr-2" size={18} /> : 
                          <span className="w-6 font-mono text-text-secondary font-bold mr-2">#{idx + 1}</span>}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} 
                          className="w-10 h-10 rounded-full border border-border bg-white"
                          alt=""
                        />
                        <div>
                          <p className="font-black text-text-main group-hover:text-primary transition-colors">{u.username}</p>
                          <p className="text-[10px] font-black text-text-secondary uppercase tracking-tighter flex items-center mt-0.5">
                            <Code2 size={10} className="mr-1" /> {u.githubUsername}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="inline-flex items-center px-4 py-1.5 bg-[#F6F8FA] rounded-xl border border-[#D0D7DE] group-hover:border-primary/30 transition-all">
                        <GitCommit size={14} className="mr-2 text-[#24292F]" />
                        <span className="font-mono font-black text-[#24292F]">{u.commitCount.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="font-mono font-black text-primary text-lg">{u.rating}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <a 
                        href={`https://github.com/${u.githubUsername}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-background border border-border text-text-secondary hover:text-primary hover:border-primary/50 transition-all inline-flex"
                      >
                        <ExternalLink size={18} />
                      </a>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Card */}
      <div className="mt-12 bg-surface border border-border p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="bg-primary/10 p-6 rounded-[2rem] shrink-0">
          <Zap className="text-primary" size={40} fill="currentColor" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-text-main mb-2">How it works</h3>
          <p className="text-text-secondary leading-relaxed">
            Link your GitHub account in your profile. Our system periodically syncs your public commit activity across all repositories. 
            Higher activity earns you **Git Points** which contribute to your global standing and unlock exclusive badges.
          </p>
        </div>
      </div>
    </div>
  );
}
