import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_STATS, ACTIVITY_DATA } from '../constants';
import { StatCardProps } from '../types';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, MoreHorizontal, MapPin, Activity, ShieldAlert, Wind, Zap } from 'lucide-react';

// Simplified DRC Polygon for Stylized Map
const DRC_PATH = "M 15 65 L 10 70 L 12 75 L 30 72 L 40 90 L 80 90 L 90 60 L 95 30 L 60 10 L 40 15 L 25 30 L 25 55 Z";

const BORDER_NODES = [
  { id: 'kin', name: 'Kinshasa HQ', x: 20, y: 60, status: 'NORMAL', traffic: 'HIGH' },
  { id: 'mat', name: 'Matadi Port', x: 12, y: 70, status: 'NORMAL', traffic: 'MED' },
  { id: 'gom', name: 'Goma (East)', x: 90, y: 45, status: 'ALERT', traffic: 'HIGH' },
  { id: 'lub', name: 'Lubumbashi', x: 75, y: 85, status: 'NORMAL', traffic: 'MED' },
  { id: 'kis', name: 'Kisangani', x: 55, y: 35, status: 'NORMAL', traffic: 'LOW' },
  { id: 'bun', name: 'Bunia', x: 92, y: 25, status: 'WARNING', traffic: 'MED' },
];

const StatCard: React.FC<StatCardProps & { index: number }> = ({ title, value, change, isPositive, icon: Icon, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:bg-white/10 transition-colors"
  >
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
      <Icon size={64} className="text-white" />
    </div>
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-dgm-blue/50 rounded-xl border border-white/10 text-dgm-gold">
        <Icon size={24} />
      </div>
      <div className={`flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {change}
      </div>
    </div>
    <h3 className="text-white/60 text-sm font-medium mb-1">{title}</h3>
    <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
  </motion.div>
);

const Dashboard: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  return (
    <div className="h-full overflow-y-auto space-y-6 pr-2 custom-scrollbar">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Border Police Dashboard</h1>
          <p className="text-white/60">National Command Center & Live Operations</p>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-2 text-dgm-gold font-mono text-xl">
             <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
             {new Date().toLocaleTimeString('fr-CD')}
          </div>
          <p className="text-white/40 text-sm">{new Date().toLocaleDateString('fr-CD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_STATS.map((stat, i) => (
          <StatCard key={i} {...stat} index={i} />
        ))}
      </div>

      {/* Map & Live Feed Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Live Map Visualization */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-gradient-to-br from-dgm-dark to-black border border-white/10 rounded-2xl p-6 min-h-[500px] relative overflow-hidden shadow-2xl"
        >
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)]" />
           
           <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <MapPin className="text-dgm-gold" size={20} /> Live Border Map
                </h3>
                <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Real-time Visualization • 26 Provinces</p>
              </div>
              <div className="flex gap-2">
                 <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                    <Wind size={14} className="text-emerald-400" />
                    <span className="text-xs text-white/70">Weather: CLEAR</span>
                 </div>
                 <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                    <Activity size={14} className="text-dgm-gold" />
                    <span className="text-xs text-white/70">Net Status: ONLINE</span>
                 </div>
              </div>
           </div>

           {/* The Map */}
           <div className="relative w-full h-[400px] mt-8 select-none">
              {/* Abstract DRC Shape */}
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                <path 
                  d={DRC_PATH} 
                  fill="rgba(255,255,255,0.03)" 
                  stroke="rgba(212,175,55,0.3)" 
                  strokeWidth="0.5"
                  className="hover:fill-white/5 transition-colors duration-500"
                />
                {/* Connecting Lines (Simulated Network) */}
                <path d="M 20 60 L 90 45" stroke="rgba(212,175,55,0.1)" strokeWidth="0.2" strokeDasharray="1 1" />
                <path d="M 20 60 L 75 85" stroke="rgba(212,175,55,0.1)" strokeWidth="0.2" strokeDasharray="1 1" />
                <path d="M 20 60 L 55 35" stroke="rgba(212,175,55,0.1)" strokeWidth="0.2" strokeDasharray="1 1" />
              </svg>

              {/* Interactive Nodes */}
              {BORDER_NODES.map((node) => (
                <div 
                  key={node.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  onMouseEnter={() => setSelectedNode(node.name)}
                  onMouseLeave={() => setSelectedNode(null)}
                >
                   {/* Ripple Effect for Alerts */}
                   {node.status === 'ALERT' && (
                     <div className="absolute inset-0 w-full h-full bg-red-500 rounded-full animate-ping opacity-75" />
                   )}
                   
                   {/* Node Point */}
                   <div className={`w-3 h-3 rounded-full border border-black shadow-[0_0_10px_black] transition-all duration-300 ${
                     node.status === 'ALERT' ? 'bg-red-500 w-4 h-4' : 
                     node.status === 'WARNING' ? 'bg-orange-500' : 'bg-dgm-gold'
                   }`} />

                   {/* Label */}
                   <div className={`absolute left-4 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md border border-white/20 px-3 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none`}>
                      <span className="font-bold text-white block">{node.name}</span>
                      <span className={`text-[10px] font-mono ${
                        node.status === 'ALERT' ? 'text-red-400' : 'text-emerald-400'
                      }`}>
                        STATUS: {node.status}
                      </span>
                   </div>
                </div>
              ))}
           </div>
        </motion.div>

        {/* Live Feed & Alerts */}
        <div className="space-y-6">
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.4 }}
             className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 h-[240px] overflow-hidden flex flex-col"
           >
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert size={16} className="text-red-500" /> Active Threats
                </h3>
                <span className="bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded font-mono">3 CRITICAL</span>
             </div>
             <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                {[
                  { title: "Passport Mismatch", loc: "Goma", time: "2m ago", level: "HIGH" },
                  { title: "Unauthorized Vehicle", loc: "Bunia", time: "12m ago", level: "MED" },
                  { title: "Watchlist Match", loc: "Kinshasa", time: "45m ago", level: "CRITICAL" },
                ].map((alert, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                     <div className="mt-1">
                        <div className={`w-2 h-2 rounded-full ${alert.level === 'CRITICAL' ? 'bg-red-500 animate-pulse' : 'bg-orange-500'}`} />
                     </div>
                     <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-dgm-gold transition-colors">{alert.title}</h4>
                        <div className="flex justify-between w-full gap-4">
                          <p className="text-xs text-white/50">{alert.loc}</p>
                          <p className="text-xs text-white/30 font-mono">{alert.time}</p>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.5 }}
             className="bg-dgm-blue/30 backdrop-blur-md border border-dgm-gold/20 rounded-2xl p-6 h-[236px] flex flex-col justify-center items-center text-center relative overflow-hidden"
           >
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(212,175,55,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-[gradient_8s_ease_infinite]" />
              
              <Zap size={32} className="text-dgm-gold mb-3" />
              <h3 className="text-white font-bold text-lg">Predictive Flow</h3>
              <p className="text-white/60 text-xs px-4 mt-2 mb-4">
                 AI analysis predicts a <span className="text-emerald-400 font-bold">+15% surge</span> in border crossings at <span className="text-white font-bold">Goma</span> within the next 4 hours due to regional market activity.
              </p>
              <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors">
                 View Analytics
              </button>
           </motion.div>
        </div>
      </div>

      {/* Traffic Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 h-[300px]"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white">Traffic Analysis (Last 12 Hours)</h3>
          <button className="p-2 hover:bg-white/10 rounded-lg text-white/60">
            <MoreHorizontal size={20} />
          </button>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={ACTIVITY_DATA}>
            <defs>
              <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1A365D" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#1A365D" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" />
            <YAxis stroke="rgba(255,255,255,0.3)" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f2441', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Area type="monotone" dataKey="in" stroke="#D4AF37" fillOpacity={1} fill="url(#colorIn)" />
            <Area type="monotone" dataKey="out" stroke="#10B981" fillOpacity={1} fill="url(#colorOut)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default Dashboard;