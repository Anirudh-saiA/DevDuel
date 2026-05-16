import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Star, ChevronUp, ChevronDown, Minus } from 'lucide-react';

// Mock data representing global rankings
const initialRankings = [
  { id: '1', username: 'AlgorithmGod', rating: 2845, trend: 'up' },
  { id: '2', username: 'ReactNinja', rating: 2790, trend: 'up' },
  { id: '3', username: 'ByteMe', rating: 2650, trend: 'same' },
  { id: '4', username: 'SyntaxTerror', rating: 2540, trend: 'down' },
  { id: '5', username: 'CodeSlinger', rating: 2480, trend: 'up' },
  { id: '6', username: 'NullPointer', rating: 2410, trend: 'down' },
  { id: '7', username: 'DivCentric', rating: 2355, trend: 'up' },
  { id: '8', username: 'JavaJunkie', rating: 2290, trend: 'same' },
  { id: '9', username: 'PushToMaster', rating: 2210, trend: 'up' },
  { id: '10', username: 'StackOverflowed', rating: 2150, trend: 'down' },
];

export default function Leaderboard() {
  const [rankings, setRankings] = useState(initialRankings);

  // Simulate live ranking changes every 5 seconds for demonstration
  useEffect(() => {
    const interval = setInterval(() => {
      setRankings(prev => {
        // Randomly shuffle a few ratings to demonstrate the layout animations
        let newRankings = [...prev];
        const idx1 = Math.floor(Math.random() * 5) + 3; // Shuffle middle ranks
        const idx2 = Math.floor(Math.random() * 5) + 3;
        
        // Swap ratings slightly to trigger re-order
        if (idx1 !== idx2) {
          const temp = newRankings[idx1].rating;
          newRankings[idx1].rating = newRankings[idx2].rating + Math.floor(Math.random() * 20 - 10);
          newRankings[idx2].rating = temp + Math.floor(Math.random() * 20 - 10);
          
          // Determine new trends
          newRankings[idx1].trend = newRankings[idx1].rating > temp ? 'up' : 'down';
          newRankings[idx2].trend = newRankings[idx2].rating > temp ? 'up' : 'down';
        }
        
        return newRankings.sort((a, b) => b.rating - a.rating);
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const topThree = rankings.slice(0, 3);
  const theRest = rankings.slice(3);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 font-sans">
      
      {/* Header */}
      <div className="text-center mb-16 space-y-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-full mb-2"
        >
          <Trophy size={32} />
        </motion.div>
        <h1 className="text-5xl font-black tracking-tight text-text-main">Global Rankings</h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          The best developers in the DevDuel arena. Compete in battles to increase your rating and secure your spot on the podium.
        </p>
      </div>

      {/* Top 3 Podium */}
      <div className="flex flex-col md:flex-row justify-center items-end gap-6 mb-16 h-80 px-4">
        
        {/* Rank 2 - Silver */}
        <motion.div 
          layoutId={topThree[1].id}
          className="w-full md:w-1/3 flex flex-col items-center relative order-2 md:order-1"
        >
          <div className="bg-surface border-2 border-gray-300 w-full rounded-t-3xl shadow-lg flex flex-col items-center pt-6 pb-8 relative z-10 h-56">
            <div className="absolute -top-8 bg-gray-100 p-2 rounded-full border-4 border-surface shadow-sm">
              <Medal size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold mt-4">{topThree[1].username}</h3>
            <p className="font-mono text-2xl font-black text-gray-500 mt-2">{topThree[1].rating}</p>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-4 bg-gray-200 rounded-b-3xl -z-10 transform translate-y-2"></div>
        </motion.div>

        {/* Rank 1 - Gold (Primary Orange) */}
        <motion.div 
          layoutId={topThree[0].id}
          className="w-full md:w-1/3 flex flex-col items-center relative order-1 md:order-2"
        >
          <div className="bg-surface border-2 border-primary w-full rounded-t-3xl shadow-xl flex flex-col items-center pt-8 pb-10 relative z-10 h-64">
            <div className="absolute -top-10 bg-primary/10 p-3 rounded-full border-4 border-surface shadow-md">
              <Trophy size={40} className="text-primary" />
            </div>
            <div className="absolute -top-16 text-primary animate-bounce">
              <Star size={24} fill="currentColor" />
            </div>
            <h3 className="text-2xl font-black mt-6 text-text-main">{topThree[0].username}</h3>
            <p className="font-mono text-3xl font-black text-primary mt-2">{topThree[0].rating}</p>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-4 bg-primary/20 rounded-b-3xl -z-10 transform translate-y-2"></div>
        </motion.div>

        {/* Rank 3 - Bronze */}
        <motion.div 
          layoutId={topThree[2].id}
          className="w-full md:w-1/3 flex flex-col items-center relative order-3 md:order-3"
        >
          <div className="bg-surface border-2 border-amber-600/40 w-full rounded-t-3xl shadow-lg flex flex-col items-center pt-6 pb-6 relative z-10 h-48">
            <div className="absolute -top-8 bg-amber-50 p-2 rounded-full border-4 border-surface shadow-sm">
              <Medal size={28} className="text-amber-600" />
            </div>
            <h3 className="text-lg font-bold mt-4">{topThree[2].username}</h3>
            <p className="font-mono text-xl font-black text-amber-600 mt-2">{topThree[2].rating}</p>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-4 bg-amber-600/10 rounded-b-3xl -z-10 transform translate-y-2"></div>
        </motion.div>

      </div>

      {/* The Rest of the Leaderboard */}
      <div className="bg-surface rounded-3xl border border-border shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-background/50 text-xs font-bold text-text-secondary uppercase tracking-wider">
          <div className="col-span-2 md:col-span-1 text-center">Rank</div>
          <div className="col-span-6 md:col-span-7">User</div>
          <div className="col-span-3 md:col-span-3 text-right">Rating</div>
          <div className="col-span-1 md:col-span-1 text-center">Trend</div>
        </div>

        <div className="relative">
          <AnimatePresence>
            {theRest.map((user, index) => (
              <motion.div 
                key={user.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="grid grid-cols-12 gap-4 p-4 items-center border-b border-border hover:bg-background/50 transition-colors"
              >
                <div className="col-span-2 md:col-span-1 text-center font-bold text-text-secondary">
                  #{index + 4}
                </div>
                <div className="col-span-6 md:col-span-7 font-semibold text-text-main">
                  {user.username}
                </div>
                <div className="col-span-3 md:col-span-3 text-right font-mono font-bold text-primary">
                  {user.rating}
                </div>
                <div className="col-span-1 md:col-span-1 flex justify-center">
                  {user.trend === 'up' && <ChevronUp size={18} className="text-green-500" />}
                  {user.trend === 'down' && <ChevronDown size={18} className="text-red-500" />}
                  {user.trend === 'same' && <Minus size={18} className="text-gray-400" />}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}
