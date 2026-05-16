import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swords, Zap, Trophy, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center min-h-[85vh] text-center px-4 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center space-x-2 bg-surface border border-border px-4 py-2 rounded-full mb-8 shadow-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-xs font-black tracking-widest uppercase text-text-secondary">Season 1 Now Live</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-7xl md:text-8xl font-black tracking-tighter mb-6"
        >
          Duel. <span className="text-primary">Code.</span> Dominate.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-xl text-text-secondary max-w-2xl mb-12 leading-relaxed"
        >
          The world's most immersive real-time coding battle platform. 
          Compete in high-stakes duels, climb the global leaderboard, and master your craft.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6"
        >
          <Link to="/register" className="btn-primary py-4 px-10 text-lg shadow-xl shadow-primary/20">
            Start Battling Now
          </Link>
          <Link to="/battles" className="btn-secondary py-4 px-10 text-lg">
            View Live Lobby
          </Link>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 max-w-5xl w-full"
        >
          <div className="flex flex-col items-center p-6 rounded-3xl bg-surface/50 backdrop-blur-sm border border-border/50">
            <Zap className="text-primary mb-3" size={28} />
            <span className="text-sm font-bold uppercase tracking-wider">Real-time</span>
          </div>
          <div className="flex flex-col items-center p-6 rounded-3xl bg-surface/50 backdrop-blur-sm border border-border/50">
            <Swords className="text-primary mb-3" size={28} />
            <span className="text-sm font-bold uppercase tracking-wider">1v1 Duels</span>
          </div>
          <div className="flex flex-col items-center p-6 rounded-3xl bg-surface/50 backdrop-blur-sm border border-border/50">
            <Trophy className="text-primary mb-3" size={28} />
            <span className="text-sm font-bold uppercase tracking-wider">Ranked</span>
          </div>
          <div className="flex flex-col items-center p-6 rounded-3xl bg-surface/50 backdrop-blur-sm border border-border/50">
            <Shield className="text-primary mb-3" size={28} />
            <span className="text-sm font-bold uppercase tracking-wider">Secure</span>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
