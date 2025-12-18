import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Video, Phone, Users, Radio, Lock, Volume2, Globe, AlertOctagon, Send } from 'lucide-react';

const CHANNELS = [
  { id: 1, name: 'HQ General Command', status: 'LIVE', users: 124, region: 'Kinshasa' },
  { id: 2, name: 'North-Kivu Ops', status: 'ACTIVE', users: 45, region: 'Goma' },
  { id: 3, name: 'Airport Security', status: 'QUIET', users: 28, region: 'National' },
  { id: 4, name: 'Intel Alpha Team', status: 'LOCKED', users: 6, region: 'Classified' },
];

const Communication: React.FC = () => {
  const [activeChannel, setActiveChannel] = useState(CHANNELS[0]);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [inputText, setInputText] = useState('');
  const [audioBars, setAudioBars] = useState<number[]>(new Array(20).fill(10));

  // Simulate audio visualizer
  useEffect(() => {
    const interval = setInterval(() => {
      setAudioBars(prev => prev.map(() => Math.random() * 40 + 10));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex gap-6 overflow-hidden">
      
      {/* Sidebar: Channels */}
      <div className="w-80 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-black/20">
           <h2 className="text-lg font-bold text-white flex items-center gap-2">
             <Radio className="text-dgm-gold" size={20} /> Secure Channels
           </h2>
           <p className="text-xs text-white/40 mt-1">Encrypted AES-256 Link</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {CHANNELS.map(channel => (
            <button
              key={channel.id}
              onClick={() => setActiveChannel(channel)}
              className={`w-full p-3 rounded-xl flex items-center justify-between transition-all ${
                activeChannel.id === channel.id 
                  ? 'bg-dgm-blue border border-dgm-gold/30' 
                  : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activeChannel.id === channel.id ? 'bg-dgm-gold text-dgm-blue' : 'bg-white/10 text-white/60'
                 }`}>
                    {channel.status === 'LOCKED' ? <Lock size={16} /> : <Globe size={16} />}
                 </div>
                 <div className="text-left">
                    <p className={`text-sm font-bold ${activeChannel.id === channel.id ? 'text-white' : 'text-white/80'}`}>{channel.name}</p>
                    <p className="text-[10px] text-white/40 uppercase">{channel.region}</p>
                 </div>
              </div>
              {channel.status === 'LIVE' && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-white/10 bg-red-500/10">
           <button className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 transition-colors">
              <AlertOctagon size={18} /> EMERGENCY BROADCAST
           </button>
        </div>
      </div>

      {/* Main Stage */}
      <div className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col overflow-hidden relative">
        {/* Active Channel Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
           <div>
              <div className="flex items-center gap-3">
                 <h2 className="text-2xl font-bold text-white">{activeChannel.name}</h2>
                 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-dgm-gold/20 text-dgm-gold border border-dgm-gold/30">
                    SECURE LINE
                 </span>
              </div>
              <p className="text-sm text-white/50 flex items-center gap-2 mt-1">
                 <Users size={14} /> {activeChannel.users} Officers Online
              </p>
           </div>
           <div className="flex gap-2">
              <button className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors">
                 <Phone size={20} />
              </button>
              <button className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors">
                 <Video size={20} />
              </button>
           </div>
        </div>

        {/* Visualizer Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-black/20 relative">
           <div className="w-full max-w-2xl h-48 flex items-center justify-center gap-1">
              {audioBars.map((height, i) => (
                 <motion.div
                    key={i}
                    animate={{ height: `${height}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-2 bg-dgm-gold/50 rounded-full"
                 />
              ))}
           </div>
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-32 h-32 rounded-full border-4 border-white/10 flex items-center justify-center animate-pulse">
                 <div className="w-24 h-24 rounded-full bg-dgm-gold/10 flex items-center justify-center backdrop-blur-sm">
                    <Volume2 size={32} className="text-dgm-gold" />
                 </div>
              </div>
           </div>
           <p className="mt-8 text-white/40 font-mono text-sm">LISTENING TO ENCRYPTED STREAM...</p>
        </div>

        {/* Controls */}
        <div className="p-6 border-t border-white/10 bg-black/20">
           <div className="flex gap-4 items-center">
              <button 
                 onMouseDown={() => setIsTransmitting(true)}
                 onMouseUp={() => setIsTransmitting(false)}
                 className={`w-16 h-16 rounded-full flex items-center justify-center transition-all transform active:scale-95 shadow-lg ${
                    isTransmitting 
                       ? 'bg-red-500 shadow-red-500/30 scale-105' 
                       : 'bg-white/10 hover:bg-white/20'
                 }`}
              >
                 <Mic size={24} className={isTransmitting ? 'text-white' : 'text-white/70'} />
              </button>
              
              <div className="flex-1 relative">
                 <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a secure message to channel..." 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-6 pr-12 text-white focus:outline-none focus:border-dgm-gold/50 transition-colors"
                 />
                 <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-dgm-gold hover:text-white transition-colors">
                    <Send size={20} />
                 </button>
              </div>
           </div>
           <p className="text-center text-[10px] text-white/20 mt-4 uppercase tracking-widest">
              Push and hold mic to speak • All communications are logged
           </p>
        </div>
      </div>
    </div>
  );
};

export default Communication;