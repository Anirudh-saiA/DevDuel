import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Key, Search, X, Lock, Unlock, Loader2, AlertCircle, Zap } from 'lucide-react';
import api from '../services/api';

export default function Battles() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  // Form states
  const [joinCode, setJoinCode] = useState('');
  const [createData, setCreateData] = useState({ name: '', isPrivate: false, maxPlayers: 2 });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/rooms/public');
      setRooms(res.data);
    } catch (err) {
      console.error("Failed to fetch rooms", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
    // Poll for new rooms every 10 seconds
    const interval = setInterval(fetchRooms, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setError('');
    if (!createData.name) {
      setError('Room name is required');
      return;
    }

    setFormLoading(true);
    try {
      const res = await api.post('/rooms', createData);
      navigate(`/battle/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create room');
      setFormLoading(false);
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    setError('');
    if (!joinCode || joinCode.length !== 6) {
      setError('Please enter a valid 6-character room code');
      return;
    }

    setFormLoading(true);
    try {
      const res = await api.post('/rooms/join', { roomCode: joinCode.toUpperCase() });
      navigate(`/battle/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to join room. Check code and capacity.');
      setFormLoading(false);
    }
  };

  const handleQuickJoin = async (room) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await api.post('/rooms/join', { roomCode: room.roomCode });
      navigate(`/battle/${res.data.id}`);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to join room');
    }
  };

  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    room.host.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <div className="flex items-center space-x-2 text-primary mb-2">
            <Zap size={16} fill="currentColor" />
            <span className="text-[10px] font-black uppercase tracking-widest">Live Network</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight text-text-main">Battle Lobby</h1>
          <p className="text-text-secondary mt-2 text-lg">Join a live arena or create your own custom challenge.</p>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={() => { setError(''); setIsJoinModalOpen(true); }}
            className="btn-secondary flex items-center px-6"
          >
            <Key size={18} className="mr-2" /> Join Code
          </button>
          <button 
            onClick={() => {
              if (!user) {
                navigate('/login');
                return;
              }
              setError('');
              setIsCreateModalOpen(true);
            }}
            className="btn-primary flex items-center px-8 shadow-xl shadow-primary/20"
          >
            <Plus size={18} className="mr-2" /> Create Arena
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="relative mb-10 max-w-xl group">
        <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl group-hover:bg-primary/10 transition-all -z-10"></div>
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="Search rooms, hosts, or technology..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field pl-14 py-4 text-base bg-surface border-border/50 focus:border-primary shadow-sm"
        />
      </div>

      {/* Room Grid */}
      {isLoading && rooms.length === 0 ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-3xl border border-border">
          <h3 className="text-xl font-bold text-text-main">No rooms found</h3>
          <p className="text-text-secondary mt-2">There are currently no public rooms available. Create one to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room, idx) => (
            <motion.div 
              key={room.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-surface rounded-[2rem] border border-border p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                   <h3 className="text-xl font-black text-text-main group-hover:text-primary transition-colors truncate pr-2">{room.name}</h3>
                   <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mt-1">Host: {room.host.username}</p>
                </div>
                <span className={`flex items-center px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
                  room.participants.length >= room.maxPlayers 
                    ? 'bg-red-50 text-red-600' 
                    : 'bg-primary/5 text-primary'
                }`}>
                  <Users size={12} className="mr-1.5" />
                  {room.participants.length} / {room.maxPlayers}
                </span>
              </div>
              
              <div className="flex-1 grid grid-cols-2 gap-4 mb-8">
                <div className="bg-background rounded-2xl p-3 border border-border/50">
                  <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1">Rating</p>
                  <p className="font-mono text-primary font-black">{room.host.rating}</p>
                </div>
                <div className="bg-background rounded-2xl p-3 border border-border/50">
                  <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1">Status</p>
                  <div className="flex items-center">
                    {room.isPrivate ? <Lock size={12} className="mr-1 text-orange-500" /> : <Unlock size={12} className="mr-1 text-green-500" />}
                    <span className="text-xs font-bold">{room.isPrivate ? 'Private' : 'Public'}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleQuickJoin(room)}
                disabled={room.participants.length >= room.maxPlayers}
                className="btn-secondary w-full"
              >
                {room.participants.length >= room.maxPlayers ? 'Room Full' : 'Quick Join'}
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Room Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface rounded-3xl p-8 max-w-md w-full shadow-hover relative"
            >
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="absolute right-6 top-6 text-text-secondary hover:text-text-main"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-2xl font-bold mb-6">Create Battle Room</h2>
              
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 flex items-center text-sm">
                  <AlertCircle size={16} className="mr-2" /> {error}
                </div>
              )}

              <form onSubmit={handleCreateRoom} className="space-y-5">
                <div>
                  <label className="form-label">Room Name</label>
                  <input 
                    type="text" 
                    value={createData.name}
                    onChange={e => setCreateData({...createData, name: e.target.value})}
                    className="input-field" 
                    placeholder="e.g. React Speedrun"
                    maxLength={30}
                    autoFocus
                  />
                </div>
                
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="form-label">Max Players</label>
                    <select 
                      value={createData.maxPlayers}
                      onChange={e => setCreateData({...createData, maxPlayers: parseInt(e.target.value)})}
                      className="input-field appearance-none cursor-pointer"
                    >
                      {[2, 3, 4, 5, 10].map(num => (
                        <option key={num} value={num}>{num} Players</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex-1">
                    <label className="form-label">Visibility</label>
                    <div 
                      onClick={() => setCreateData({...createData, isPrivate: !createData.isPrivate})}
                      className="flex items-center h-[46px] px-4 rounded-xl border border-border cursor-pointer transition-colors hover:border-primary/50"
                    >
                      <input 
                        type="checkbox" 
                        checked={createData.isPrivate}
                        readOnly
                        className="w-4 h-4 text-primary rounded border-border focus:ring-primary"
                      />
                      <span className="ml-2 text-sm font-medium">{createData.isPrivate ? 'Private' : 'Public'}</span>
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={formLoading} className="btn-primary w-full mt-4">
                  {formLoading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Create Room'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Join Room Modal */}
      <AnimatePresence>
        {isJoinModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface rounded-3xl p-8 max-w-sm w-full shadow-hover relative"
            >
              <button 
                onClick={() => setIsJoinModalOpen(false)}
                className="absolute right-6 top-6 text-text-secondary hover:text-text-main"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-2xl font-bold mb-6">Join with Code</h2>
              
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 flex items-center text-sm">
                  <AlertCircle size={16} className="mr-2" /> {error}
                </div>
              )}

              <form onSubmit={handleJoinRoom} className="space-y-5">
                <div>
                  <input 
                    type="text" 
                    value={joinCode}
                    onChange={e => setJoinCode(e.target.value.toUpperCase())}
                    className="input-field text-center text-2xl tracking-widest font-mono uppercase" 
                    placeholder="XXXXXX"
                    maxLength={6}
                    autoFocus
                  />
                </div>
                
                <button type="submit" disabled={formLoading} className="btn-primary w-full">
                  {formLoading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Join Room'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
