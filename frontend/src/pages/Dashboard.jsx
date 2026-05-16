import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, TrendingUp, Target, Swords, ArrowUpRight, ArrowDownRight, Activity, Calendar, Award, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

// Mock chart data for premium visual effect
const generateMockHistory = (currentRating) => {
  const data = [];
  let rating = currentRating - 200;
  for (let i = 10; i >= 0; i--) {
    data.push({
      name: `Day ${10 - i}`,
      rating: i === 0 ? currentRating : rating
    });
    rating += Math.floor(Math.random() * 50) - 10;
  }
  return data;
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        let data = {
          totalBattles: 42,
          wins: 28,
          losses: 14,
          winRate: 66.7,
          globalRank: 892,
          currentRating: user?.rating || 1450,
          recentBattles: [
            { roomId: '1', roomName: 'Algorithm Sprint', result: 'WIN', ratingChange: 25, date: new Date().toISOString() },
            { roomId: '2', roomName: 'React Challenge', result: 'LOSS', ratingChange: -15, date: new Date(Date.now() - 86400000).toISOString() },
            { roomId: '3', roomName: 'Java Deathmatch', result: 'WIN', ratingChange: 18, date: new Date(Date.now() - 172800000).toISOString() },
          ]
        };

        try {
          const res = await api.get('/dashboard/stats');
          data = res.data;
        } catch (err) {
          console.warn("Backend API not reachable or empty, using premium mock data for UI demo.");
        }

        setStats(data);
        setChartData(generateMockHistory(data.currentRating));
      } catch (err) {
        console.error("Failed to load dashboard", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
          <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" size={24} />
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 font-sans">
      
      {/* Header Row */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
      >
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">Pro Member</span>
            <span className="text-text-secondary text-sm flex items-center"><Calendar size={14} className="mr-1" /> Joined Jan 2024</span>
          </div>
          <h1 className="text-5xl font-black text-text-main tracking-tight">Welcome, {user?.username}</h1>
          <p className="text-text-secondary mt-2 text-lg">Your elite performance dashboard is ready.</p>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={() => navigate('/practice')}
            className="btn-secondary flex items-center px-6"
          >
            Practice Solo
          </button>
          <button 
            onClick={() => navigate('/battles')}
            className="btn-primary flex items-center px-8 shadow-xl shadow-primary/20"
          >
            <Swords size={20} className="mr-2" /> Start Battle
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        {[
          { title: 'Current Rating', value: stats?.currentRating, icon: Activity, detail: '+124 this week', color: 'text-green-600', trend: ArrowUpRight },
          { title: 'Global Rank', value: `#${stats?.globalRank}`, icon: Trophy, detail: 'Top 5% overall', color: 'text-primary', trend: Award },
          { title: 'Win Rate', value: `${stats?.winRate}%`, icon: Target, detail: `${stats?.wins}W - ${stats?.losses}L`, color: 'text-text-secondary' },
          { title: 'Total XP', value: '12.4k', icon: Zap, detail: 'Next level: 15k', color: 'text-orange-500' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="card group hover:border-primary/30 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-background rounded-lg group-hover:bg-primary/5 transition-colors">
                <stat.icon size={20} className="text-primary" />
              </div>
              {stat.trend && <stat.trend size={16} className={stat.color} />}
            </div>
            <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-1">
              {stat.title}
            </p>
            <h2 className="text-4xl font-black text-text-main font-mono mb-2">{stat.value}</h2>
            <p className={`text-xs font-bold ${stat.color} flex items-center`}>
              {stat.detail}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Chart Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-surface rounded-[2rem] border border-border p-8 shadow-sm relative overflow-hidden group"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black flex items-center tracking-tight">
              <TrendingUp size={24} className="mr-3 text-primary" /> Performance Analytics
            </h3>
            <div className="flex bg-background p-1 rounded-xl">
              {['1W', '1M', '3M', 'ALL'].map(t => (
                <button key={t} className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors ${t === '1M' ? 'bg-surface text-primary shadow-sm' : 'text-text-secondary hover:text-text-main'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#FF6B00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }} />
                <YAxis domain={['dataMin - 50', 'dataMax + 50']} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }} />
                <Tooltip 
                  cursor={{ stroke: '#FF6B00', strokeWidth: 2, strokeDasharray: '5 5' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', backgroundColor: '#FFFFFF' }}
                  itemStyle={{ color: '#FF6B00', fontWeight: 900 }}
                />
                <Area type="monotone" dataKey="rating" stroke="#FF6B00" strokeWidth={4} fillOpacity={1} fill="url(#colorRating)" animationDuration={2000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Battles Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-surface rounded-[2rem] border border-border p-8 shadow-sm flex flex-col"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black flex items-center tracking-tight">
              <Swords size={24} className="mr-3 text-primary" /> Activity
            </h3>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">Last 7 days</span>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {stats?.recentBattles?.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-text-secondary text-center">
                <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4 opacity-40">
                  <Swords size={32} />
                </div>
                <p className="font-bold">No battles yet</p>
                <p className="text-xs mt-1">Join a room to test your skills.</p>
                <button onClick={() => navigate('/battles')} className="btn-primary mt-6 py-2 px-6 text-xs">Explore Lobby</button>
              </div>
            ) : (
              stats?.recentBattles?.map((battle, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + (idx * 0.1) }}
                  className="flex items-center justify-between p-4 rounded-2xl border border-border bg-background/50 hover:bg-background transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${
                      battle.result === 'WIN' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {battle.result[0]}
                    </div>
                    <div>
                      <h4 className="font-black text-text-main text-sm truncate max-w-[120px]">{battle.roomName}</h4>
                      <p className="text-[10px] font-bold text-text-secondary">
                        {new Date(battle.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-black flex justify-end items-center ${
                      battle.ratingChange > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {battle.ratingChange > 0 ? <ArrowUpRight size={14} className="mr-0.5" /> : <ArrowDownRight size={14} className="mr-0.5" />}
                      {Math.abs(battle.ratingChange)}
                    </div>
                    <p className="text-[10px] font-bold text-text-secondary mt-1">Rating</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
