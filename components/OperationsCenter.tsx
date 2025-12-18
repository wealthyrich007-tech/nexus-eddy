import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Server, Wifi, Truck, Box, Activity, AlertOctagon, Map, 
  Cpu, Zap, Battery, Signal, Database, Wrench, Shield, Radio,
  LocateFixed, Users, Crosshair
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';

type Tab = 'ASSETS' | 'NETWORK' | 'INCIDENTS';

// Mock Data
const MAINTENANCE_DATA = [
  { day: 'Mon', health: 98, load: 45 },
  { day: 'Tue', health: 97, load: 52 },
  { day: 'Wed', health: 95, load: 58 },
  { day: 'Thu', health: 92, load: 65 },
  { day: 'Fri', health: 96, load: 48 },
  { day: 'Sat', health: 98, load: 40 },
  { day: 'Sun', health: 99, load: 35 },
];

const NETWORK_DATA = [
  { time: '00:00', latency: 20, bandwidth: 40 },
  { time: '04:00', latency: 18, bandwidth: 30 },
  { time: '08:00', latency: 45, bandwidth: 85 },
  { time: '12:00', latency: 60, bandwidth: 95 },
  { time: '16:00', latency: 55, bandwidth: 90 },
  { time: '20:00', latency: 30, bandwidth: 60 },
];

const ASSETS = [
  { id: 'SVR-01', name: 'Main Database Unit', type: 'Server', status: 'ONLINE', health: 98, loc: 'Kinshasa HQ' },
  { id: 'VHC-04', name: 'Patrol Unit Alpha', type: 'Vehicle', status: 'ONLINE', health: 85, loc: 'Goma Sector' },
  { id: 'SCN-12', name: 'Bio-Scanner X1', type: 'Scanner', status: 'MAINTENANCE', health: 65, loc: 'Lubumbashi' },
  { id: 'DRN-02', name: 'Surveillance Drone', type: 'Drone', status: 'OFFLINE', health: 0, loc: 'Bunia' },
];

const OperationsCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('ASSETS');

  const AssetManagement = () => {
    return (
      <div className="h-full flex gap-6">
        {/* Asset List */}
        <div className="flex-1 flex flex-col gap-6">
           <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-white flex items-center gap-2">
                    <Box className="text-dgm-gold" /> Critical Infrastructure
                 </h3>
                 <div className="flex gap-2">
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-lg border border-emerald-500/20 flex items-center gap-1">
                       <Activity size={12} /> 94% Operational
                    </span>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 overflow-y-auto pr-2">
                 {ASSETS.map((asset) => (
                    <div key={asset.id} className="bg-black/20 border border-white/5 rounded-xl p-4 hover:border-dgm-gold/30 transition-colors group cursor-pointer relative overflow-hidden">
                       <div className="flex justify-between items-start mb-2">
                          <div className="p-2 bg-white/5 rounded-lg text-white group-hover:bg-dgm-gold group-hover:text-dgm-blue transition-colors">
                             {asset.type === 'Server' && <Database size={18} />}
                             {asset.type === 'Vehicle' && <Truck size={18} />}
                             {asset.type === 'Scanner' && <Scan size={18} />}
                             {asset.type === 'Drone' && <Plane size={18} />}
                          </div>
                          <div className={`text-[10px] font-bold px-2 py-1 rounded border ${
                             asset.status === 'ONLINE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                             asset.status === 'MAINTENANCE' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                             'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                             {asset.status}
                          </div>
                       </div>
                       <h4 className="font-bold text-white text-sm">{asset.name}</h4>
                       <p className="text-xs text-white/50 mb-3">{asset.id} • {asset.loc}</p>
                       
                       <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div 
                             className={`h-full rounded-full ${
                                asset.health > 80 ? 'bg-emerald-500' :
                                asset.health > 50 ? 'bg-orange-500' : 'bg-red-500'
                             }`}
                             style={{ width: `${asset.health}%` }}
                          />
                       </div>
                       <div className="flex justify-between mt-1">
                          <span className="text-[10px] text-white/30">Health</span>
                          <span className="text-[10px] text-white/60 font-mono">{asset.health}%</span>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Sidebar: Details & AR Preview */}
        <div className="w-96 flex flex-col gap-6">
           {/* AR Preview Simulation */}
           <div className="h-64 bg-black/40 border border-white/10 rounded-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-40 mix-blend-luminosity" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
              
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                 <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded text-xs text-emerald-400 font-mono border border-emerald-500/30">
                    AR_VIEW: SVR-01
                 </div>
                 <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              </div>

              {/* AR Markers */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-emerald-500/50 rounded-lg flex items-center justify-center">
                 <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-emerald-500" />
                 <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-emerald-500" />
                 <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-emerald-500" />
                 <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-emerald-500" />
                 <span className="text-emerald-500 text-xs font-mono bg-black/80 px-2 py-1">TEMP: 42°C</span>
              </div>
           </div>

           {/* Maintenance Chart */}
           <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                 <Wrench className="text-dgm-gold" size={18} /> Predictive Maintenance
              </h3>
              <div className="h-48">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={MAINTENANCE_DATA}>
                       <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                       <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={10} />
                       <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
                       <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
                       <Line type="monotone" dataKey="health" stroke="#10B981" strokeWidth={2} dot={false} />
                       <Line type="monotone" dataKey="load" stroke="#D4AF37" strokeWidth={2} dot={false} />
                    </LineChart>
                 </ResponsiveContainer>
              </div>
              <p className="text-xs text-white/50 mt-4 leading-relaxed">
                 <span className="text-dgm-gold font-bold">Analysis:</span> Server SVR-01 showing increased thermal load. Schedule maintenance within 48 hours to prevent potential outage.
              </p>
           </div>
        </div>
      </div>
    );
  };

  const NetworkStatus = () => {
     return (
        <div className="h-full flex flex-col gap-6">
           <div className="grid grid-cols-3 gap-6 h-full">
              {/* Network Topology */}
              <div className="col-span-2 bg-black/40 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                 <div className="absolute top-6 left-6 z-10">
                    <h3 className="font-bold text-white flex items-center gap-2">
                       <Wifi className="text-dgm-gold" /> Secure Mesh Network
                    </h3>
                    <p className="text-xs text-white/40">Topology View • Encryption Level: AES-256</p>
                 </div>
                 
                 {/* Visual Nodes */}
                 <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-full h-full opacity-50">
                       <defs>
                          <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                             <path d="M0,0 L10,5 L0,10" fill="rgba(212,175,55,0.5)" />
                          </marker>
                       </defs>
                       {/* Central Hub */}
                       <circle cx="50%" cy="50%" r="30" fill="rgba(26, 54, 93, 0.8)" stroke="#D4AF37" strokeWidth="2" className="animate-pulse" />
                       {/* Satellites */}
                       <circle cx="20%" cy="30%" r="15" fill="#0f172a" stroke="#10B981" strokeWidth="2" />
                       <line x1="22%" y1="32%" x2="48%" y2="48%" stroke="#10B981" strokeWidth="1" strokeDasharray="4" />
                       
                       <circle cx="80%" cy="40%" r="15" fill="#0f172a" stroke="#10B981" strokeWidth="2" />
                       <line x1="78%" y1="42%" x2="52%" y2="48%" stroke="#10B981" strokeWidth="1" strokeDasharray="4" />

                       <circle cx="40%" cy="80%" r="15" fill="#0f172a" stroke="#F97316" strokeWidth="2" />
                       <line x1="42%" y1="78%" x2="50%" y2="54%" stroke="#F97316" strokeWidth="1" strokeDasharray="4" />

                       <circle cx="60%" cy="20%" r="10" fill="#0f172a" stroke="#D4AF37" strokeWidth="1" />
                       <line x1="60%" y1="22%" x2="80%" y2="38%" stroke="#D4AF37" strokeWidth="0.5" />
                    </svg>
                    
                    {/* Floating Labels */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                       <Server size={24} className="text-dgm-gold mx-auto" />
                       <span className="text-[10px] text-white font-bold bg-black/50 px-2 rounded">HQ HUB</span>
                    </div>
                 </div>

                 {/* Signal Strength Overlay */}
                 <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur border border-white/10 rounded-xl p-4 w-64">
                    <h4 className="text-xs text-white/60 mb-3 uppercase tracking-wider">Active Nodes</h4>
                    <div className="space-y-3">
                       <div className="flex items-center justify-between">
                          <span className="text-xs text-white">Goma Sector</span>
                          <div className="flex gap-0.5">
                             {[1,2,3,4].map(i => <div key={i} className={`w-1 h-3 rounded-sm ${i <= 4 ? 'bg-emerald-500' : 'bg-white/10'}`} />)}
                          </div>
                       </div>
                       <div className="flex items-center justify-between">
                          <span className="text-xs text-white">Matadi Port</span>
                          <div className="flex gap-0.5">
                             {[1,2,3,4].map(i => <div key={i} className={`w-1 h-3 rounded-sm ${i <= 3 ? 'bg-emerald-500' : 'bg-white/10'}`} />)}
                          </div>
                       </div>
                       <div className="flex items-center justify-between">
                          <span className="text-xs text-white">Bunia Outpost</span>
                          <div className="flex gap-0.5">
                             {[1,2,3,4].map(i => <div key={i} className={`w-1 h-3 rounded-sm ${i <= 2 ? 'bg-orange-500' : 'bg-white/10'}`} />)}
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Bandwidth Usage */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
                 <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                    <Activity className="text-dgm-gold" /> Bandwidth
                 </h3>
                 <div className="flex-1 min-h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={NETWORK_DATA}>
                          <defs>
                             <linearGradient id="colorBw" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#1A365D" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#1A365D" stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" fontSize={10} />
                          <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
                          <Area type="monotone" dataKey="bandwidth" stroke="#3b82f6" fillOpacity={1} fill="url(#colorBw)" />
                          <Area type="monotone" dataKey="latency" stroke="#F97316" fillOpacity={0} strokeDasharray="4 4" />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                       <p className="text-[10px] text-white/40 uppercase">Latency</p>
                       <p className="text-xl font-bold text-white">45<span className="text-xs text-white/50 ml-1">ms</span></p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                       <p className="text-[10px] text-white/40 uppercase">Throughput</p>
                       <p className="text-xl font-bold text-white">1.2<span className="text-xs text-white/50 ml-1">GB/s</span></p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
     );
  };

  const IncidentResponse = () => {
     return (
        <div className="h-full flex gap-6">
           {/* Incident Map / Heatmap */}
           <div className="flex-1 bg-black/40 border border-white/10 rounded-2xl relative overflow-hidden group">
              <div className="absolute inset-0 opacity-40">
                 {/* Stylized Map Background */}
                 <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-dgm-blue/40 via-black to-black" />
              </div>
              
              <div className="absolute top-6 left-6 z-10">
                 <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <AlertOctagon className="text-red-500" /> Situation Room
                 </h3>
                 <p className="text-xs text-white/40">Live Incident Tracking & Resource Allocation</p>
              </div>

              {/* Heatmap/Resource Overlay */}
              <div className="absolute inset-0">
                 {/* Incident Markers */}
                 <div className="absolute top-[30%] left-[60%]">
                    <div className="relative">
                       <div className="w-4 h-4 bg-red-500 rounded-full animate-ping absolute opacity-75" />
                       <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white relative z-10 flex items-center justify-center cursor-pointer hover:scale-125 transition-transform">
                          <AlertOctagon size={10} className="text-white" />
                       </div>
                       <div className="absolute left-6 top-0 bg-black/80 backdrop-blur px-3 py-2 rounded border border-red-500/30 w-40">
                          <p className="text-xs text-red-400 font-bold">INCIDENT #992</p>
                          <p className="text-[10px] text-white/70">Unauthorized Crossing</p>
                          <p className="text-[10px] text-white/40 mt-1">2 Units Dispatching...</p>
                       </div>
                    </div>
                 </div>

                 {/* Resource Markers */}
                 <div className="absolute top-[35%] left-[55%] flex flex-col items-center">
                    <div className="w-8 h-8 bg-dgm-blue border border-dgm-gold rounded-full flex items-center justify-center text-dgm-gold shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                       <Truck size={14} />
                    </div>
                    <div className="h-8 w-0.5 bg-dgm-gold/30 border-l border-dashed border-dgm-gold" />
                 </div>
              </div>
           </div>

           {/* Operations Log */}
           <div className="w-96 bg-white/5 border border-white/10 rounded-2xl flex flex-col">
              <div className="p-4 border-b border-white/10 bg-black/20 flex justify-between items-center">
                 <h3 className="font-bold text-white text-sm">Action Log</h3>
                 <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-1 rounded font-mono animate-pulse">LIVE</span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                 {[
                    { time: '10:42:15', user: 'CMD. Bakali', action: 'Deployed Unit Alpha to Sector 4', type: 'ACTION' },
                    { time: '10:40:30', user: 'SYS_AI', action: 'Detected movement anomaly in Zone B', type: 'ALERT' },
                    { time: '10:38:12', user: 'LT. Bemba', action: 'Requesting drone surveillance', type: 'COMM' },
                    { time: '10:35:00', user: 'SYS_NET', action: 'Signal lost at Outpost 3', type: 'WARN' },
                 ].map((log, i) => (
                    <div key={i} className="flex gap-3 text-sm">
                       <div className="w-12 text-[10px] text-white/30 font-mono pt-1">{log.time}</div>
                       <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                             <span className="font-bold text-white text-xs">{log.user}</span>
                             <span className={`text-[8px] px-1.5 rounded ${
                                log.type === 'ALERT' ? 'bg-red-500/20 text-red-400' :
                                log.type === 'WARN' ? 'bg-orange-500/20 text-orange-400' :
                                'bg-blue-500/20 text-blue-400'
                             }`}>{log.type}</span>
                          </div>
                          <p className="text-white/70 text-xs">{log.action}</p>
                       </div>
                    </div>
                 ))}
              </div>

              <div className="p-4 border-t border-white/10 bg-black/20">
                 <div className="relative">
                    <input 
                       type="text" 
                       placeholder="Enter command or log entry..."
                       className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-3 pr-10 text-xs text-white focus:outline-none focus:border-dgm-gold/50"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                       <Radio size={14} />
                    </button>
                 </div>
              </div>
           </div>
        </div>
     );
  };

  return (
    <div className="h-full bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 overflow-hidden flex flex-col">
       {/* Header Tabs */}
       <div className="flex justify-between items-center mb-6">
          <div>
             <h1 className="text-2xl font-bold text-white">Operations Center</h1>
             <p className="text-white/60 text-sm">Direction Technique, Logistique et Transmission</p>
          </div>
          <div className="bg-black/20 p-1 rounded-xl flex gap-1 border border-white/10">
             <button 
                onClick={() => setActiveTab('ASSETS')}
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'ASSETS' ? 'bg-dgm-gold text-dgm-blue shadow-lg' : 'text-white/60 hover:text-white'}`}
             >
                <Box size={16} /> Assets
             </button>
             <button 
                onClick={() => setActiveTab('NETWORK')}
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'NETWORK' ? 'bg-dgm-gold text-dgm-blue shadow-lg' : 'text-white/60 hover:text-white'}`}
             >
                <Wifi size={16} /> Network
             </button>
             <button 
                onClick={() => setActiveTab('INCIDENTS')}
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'INCIDENTS' ? 'bg-dgm-gold text-dgm-blue shadow-lg' : 'text-white/60 hover:text-white'}`}
             >
                <AlertOctagon size={16} /> Incidents
             </button>
          </div>
       </div>

       {/* Main Content Area */}
       <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
             <motion.div 
               key={activeTab}
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 1.02 }}
               transition={{ duration: 0.2 }}
               className="h-full"
             >
                {activeTab === 'ASSETS' && <AssetManagement />}
                {activeTab === 'NETWORK' && <NetworkStatus />}
                {activeTab === 'INCIDENTS' && <IncidentResponse />}
             </motion.div>
          </AnimatePresence>
       </div>
    </div>
  );
};

// Missing Imports fix
import { Scan, Plane } from 'lucide-react';

export default OperationsCenter;