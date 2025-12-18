import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PieChart, FileText, Beaker, Globe, Sliders, Scan, Search, 
  GitBranch, Download, Share2, Maximize2, Move, Layers, 
  BarChart2, FileCheck, Eye, RefreshCw 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, ScatterChart, Scatter, ZAxis, Legend 
} from 'recharts';

type Tab = 'FLOW' | 'DOCS' | 'RESEARCH';

const MOCK_FLOW_DATA = [
  { month: 'Jan', predicted: 4000, actual: 3800 },
  { month: 'Feb', predicted: 4200, actual: 4100 },
  { month: 'Mar', predicted: 4500, actual: 4600 },
  { month: 'Apr', predicted: 4800, actual: 4700 },
  { month: 'May', predicted: 5100, actual: 5300 },
  { month: 'Jun', predicted: 5500, actual: 5400 },
];

const MOCK_CORRELATION_DATA = [
  { x: 10, y: 30, z: 200 },
  { x: 20, y: 50, z: 260 },
  { x: 30, y: 45, z: 400 },
  { x: 40, y: 70, z: 280 },
  { x: 50, y: 55, z: 500 },
  { x: 60, y: 85, z: 600 },
  { x: 70, y: 65, z: 700 },
];

const AnalyticsHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('FLOW');

  // --- SUB-COMPONENTS ---

  const FlowAnalysis = () => {
    const [economicPressure, setEconomicPressure] = useState(50);
    const [borderTightness, setBorderTightness] = useState(70);
    const [seasonality, setSeasonality] = useState(30);

    return (
      <div className="h-full flex gap-6">
        {/* Main Visualization Area */}
        <div className="flex-1 flex flex-col gap-6">
           {/* 3D Map Visualization (Simulated) */}
           <div className="flex-1 bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-white/10 relative overflow-hidden group perspective-1000">
              <div className="absolute top-4 left-6 z-10">
                 <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Globe className="text-dgm-gold" /> Migration Flow Dynamics
                 </h3>
                 <p className="text-white/40 text-sm">3D Geospatial Projection • Real-time</p>
              </div>

              <div className="absolute top-4 right-6 z-10 flex gap-2">
                 <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white">
                    <Layers size={18} />
                 </button>
                 <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white">
                    <Maximize2 size={18} />
                 </button>
              </div>

              {/* The "3D" Map Container */}
              <div 
                className="absolute inset-0 flex items-center justify-center transform-style-3d rotate-x-60 scale-75 transition-transform duration-700 hover:scale-90 hover:rotate-x-45"
                style={{ transform: 'perspective(1000px) rotateX(25deg) scale(0.9)' }}
              >
                 {/* Map Base Plane */}
                 <div className="w-[600px] h-[400px] bg-dgm-blue/20 border border-dgm-gold/10 rounded-xl relative shadow-[0_0_50px_rgba(212,175,55,0.1)] grid grid-cols-6 grid-rows-4 gap-4 p-8">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
                    
                    {/* Nodes */}
                    {[
                       { x: '20%', y: '30%', name: 'KIN' }, { x: '80%', y: '20%', name: 'GOM' }, 
                       { x: '50%', y: '70%', name: 'LUB' }, { x: '10%', y: '80%', name: 'MAT' }
                    ].map((node, i) => (
                       <div key={i} className="absolute w-4 h-4 rounded-full bg-dgm-gold shadow-[0_0_20px_rgba(212,175,55,0.8)] z-20 flex items-center justify-center" style={{ left: node.x, top: node.y }}>
                          <div className="absolute -top-8 text-xs font-bold text-white bg-black/50 px-2 rounded backdrop-blur-sm">{node.name}</div>
                          <div className="w-full h-full rounded-full bg-dgm-gold animate-ping opacity-50" />
                       </div>
                    ))}

                    {/* Arcs (Flow Lines) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                       <defs>
                          <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                             <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
                             <stop offset="50%" stopColor="#D4AF37" stopOpacity="1" />
                             <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                          </linearGradient>
                       </defs>
                       {/* Curving paths representing migration flow */}
                       <path d="M 120 120 Q 300 50 480 80" fill="none" stroke="url(#flowGrad)" strokeWidth="3" strokeDasharray="10 10" className="animate-[dash_3s_linear_infinite]" />
                       <path d="M 480 80 Q 400 200 300 280" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="5 5" className="animate-[dash_5s_linear_infinite_reverse]" />
                       <path d="M 60 320 Q 150 250 300 280" fill="none" stroke="rgba(16,185,129,0.4)" strokeWidth="2" />
                    </svg>

                    {/* Floating Indicators (3D Effect) */}
                    <div className="absolute top-[20%] right-[20%] bg-red-500/20 border border-red-500/50 p-2 rounded text-xs text-red-400 font-bold transform translate-z-10 animate-bounce">
                       High Pressure
                    </div>
                 </div>
              </div>
           </div>

           {/* Predictive Chart */}
           <div className="h-64 bg-white/5 border border-white/10 rounded-2xl p-6">
              <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                 <BarChart2 size={16} className="text-emerald-400" /> 6-Month Predictive Model
              </h4>
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={MOCK_FLOW_DATA}>
                    <defs>
                       <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" />
                    <YAxis stroke="rgba(255,255,255,0.3)" />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
                    <Area type="monotone" dataKey="predicted" stroke="#D4AF37" fillOpacity={1} fill="url(#colorPred)" name="AI Forecast" />
                    <Area type="monotone" dataKey="actual" stroke="#ffffff" strokeDasharray="5 5" fill="transparent" name="Historical" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Sidebar: Predictive Sandbox */}
        <div className="w-80 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
           <div className="mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                 <Beaker className="text-dgm-gold" size={20} /> Simulation Sandbox
              </h3>
              <p className="text-xs text-white/50 mt-1">Adjust variables to forecast migration trends.</p>
           </div>

           <div className="space-y-8 flex-1">
              {[
                 { label: 'Economic Pressure', value: economicPressure, set: setEconomicPressure, color: 'accent-red-500' },
                 { label: 'Border Tightness', value: borderTightness, set: setBorderTightness, color: 'accent-emerald-500' },
                 { label: 'Seasonal Labor Demand', value: seasonality, set: setSeasonality, color: 'accent-blue-500' }
              ].map((control, i) => (
                 <div key={i} className="space-y-3">
                    <div className="flex justify-between text-sm">
                       <span className="text-white font-medium">{control.label}</span>
                       <span className="text-dgm-gold font-mono">{control.value}%</span>
                    </div>
                    <input 
                       type="range" 
                       min="0" max="100" 
                       value={control.value}
                       onChange={(e) => control.set(Number(e.target.value))}
                       className={`w-full h-2 bg-black/40 rounded-lg appearance-none cursor-pointer ${control.color}`}
                    />
                    <div className="flex justify-between text-[10px] text-white/30">
                       <span>Low</span>
                       <span>High</span>
                    </div>
                 </div>
              ))}

              <div className="p-4 bg-dgm-gold/10 border border-dgm-gold/20 rounded-xl mt-8">
                 <h4 className="text-dgm-gold font-bold text-sm mb-2">AI Insight</h4>
                 <p className="text-xs text-white/70 leading-relaxed">
                    Increasing economic pressure by <span className="text-white font-bold">10%</span> correlates with a <span className="text-red-400 font-bold">15% surge</span> in irregular crossings at the Eastern border.
                 </p>
              </div>
           </div>

           <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
              <RefreshCw size={18} /> Reset Simulation
           </button>
        </div>
      </div>
    );
  };

  const DocumentManagement = () => {
     const [scanning, setScanning] = useState(false);
     
     const startScan = () => {
        setScanning(true);
        setTimeout(() => setScanning(false), 2000);
     };

     return (
        <div className="h-full flex flex-col gap-6">
           {/* Top Bar */}
           <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="flex gap-4 items-center flex-1">
                 <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                    <input 
                       type="text" 
                       placeholder="Semantic search (e.g., 'Visas issued in Goma last week')..." 
                       className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:border-dgm-gold/50 outline-none"
                    />
                 </div>
                 <div className="flex gap-2">
                    <button className="px-3 py-2 bg-white/5 rounded-lg text-xs text-white border border-white/10 hover:bg-white/10">Filter</button>
                    <button className="px-3 py-2 bg-white/5 rounded-lg text-xs text-white border border-white/10 hover:bg-white/10">Sort</button>
                 </div>
              </div>
              <button 
                 onClick={startScan}
                 className="bg-dgm-gold hover:bg-white text-dgm-blue font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                 <Scan size={18} /> Digitize New Document
              </button>
           </div>

           {/* Content Area */}
           <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
              {/* Document List */}
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col">
                 <div className="p-4 border-b border-white/10 bg-black/20 font-bold text-white text-sm">Recent Archives</div>
                 <div className="flex-1 overflow-y-auto">
                    {[1,2,3,4,5].map((i) => (
                       <div key={i} className="p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer flex items-center justify-between group transition-colors">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-dgm-blue rounded-lg flex items-center justify-center border border-white/10">
                                <FileText className="text-white/60" size={20} />
                             </div>
                             <div>
                                <h4 className="text-white font-medium text-sm">Border_Report_Kivu_2024_{i}.pdf</h4>
                                <p className="text-xs text-white/40">Updated 2h ago • by Cmdr. Bakali</p>
                             </div>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                             <button className="p-2 hover:bg-white/10 rounded text-white/60"><Eye size={16} /></button>
                             <button className="p-2 hover:bg-white/10 rounded text-white/60"><GitBranch size={16} /></button>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Preview / OCR */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-6 relative flex flex-col items-center justify-center">
                 {scanning ? (
                    <div className="text-center space-y-4">
                       <div className="w-20 h-20 border-4 border-dgm-gold border-t-transparent rounded-full animate-spin mx-auto" />
                       <p className="text-dgm-gold font-mono text-sm animate-pulse">OCR PROCESSING...</p>
                    </div>
                 ) : (
                    <>
                       <div className="w-full h-full bg-white rounded-lg opacity-5 relative overflow-hidden">
                          <div className="absolute inset-0 p-8 font-serif text-black text-xs leading-relaxed">
                             <p>REPUBLIQUE DEMOCRATIQUE DU CONGO</p>
                             <p>DIRECTION GENERALE DE MIGRATION</p>
                             <br/>
                             <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                          </div>
                       </div>
                       <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20 text-center">
                             <FileCheck className="mx-auto text-emerald-400 mb-2" size={24} />
                             <p className="text-white font-bold text-sm">Select a document to preview</p>
                             <p className="text-white/40 text-xs">or scan a physical file</p>
                          </div>
                       </div>
                    </>
                 )}
              </div>
           </div>
        </div>
     );
  };

  const ResearchTools = () => {
    return (
       <div className="h-full flex flex-col gap-6">
          <div className="grid grid-cols-3 gap-6 h-full">
             {/* Correlation Engine */}
             <div className="col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                   <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                         <Sliders className="text-dgm-gold" size={20} /> Data Correlation Engine
                      </h3>
                      <p className="text-xs text-white/40">Cross-reference multiple datasets to find anomalies.</p>
                   </div>
                   <div className="flex gap-2">
                      <select className="bg-black/20 border border-white/10 rounded-lg text-xs text-white px-3 py-2">
                         <option>Dataset A: Visa Issuance</option>
                      </select>
                      <span className="text-white/40 self-center">vs</span>
                      <select className="bg-black/20 border border-white/10 rounded-lg text-xs text-white px-3 py-2">
                         <option>Dataset B: Border Crossings</option>
                      </select>
                   </div>
                </div>

                <div className="flex-1 relative">
                   <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                         <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                         <XAxis type="number" dataKey="x" name="Visas" stroke="rgba(255,255,255,0.3)" />
                         <YAxis type="number" dataKey="y" name="Crossings" stroke="rgba(255,255,255,0.3)" />
                         <ZAxis type="number" dataKey="z" range={[60, 400]} name="Volume" />
                         <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
                         <Scatter name="Correlation" data={MOCK_CORRELATION_DATA} fill="#D4AF37" />
                      </ScatterChart>
                   </ResponsiveContainer>
                </div>
             </div>

             {/* Export & Annotation */}
             <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
                <h3 className="text-lg font-bold text-white mb-6">Tools & Export</h3>
                
                <div className="space-y-4 flex-1">
                   <div className="p-4 bg-white/5 rounded-xl border border-white/10 group hover:border-dgm-gold/50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                         <Download className="text-emerald-400" size={20} />
                         <span className="font-bold text-white">Export Report</span>
                      </div>
                      <p className="text-xs text-white/40">Generate PDF/CSV summary of current view.</p>
                   </div>

                   <div className="p-4 bg-white/5 rounded-xl border border-white/10 group hover:border-dgm-gold/50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                         <Share2 className="text-blue-400" size={20} />
                         <span className="font-bold text-white">Share Workspace</span>
                      </div>
                      <p className="text-xs text-white/40">Collaborate with other departments.</p>
                   </div>

                   <div className="p-4 bg-white/5 rounded-xl border border-white/10 group hover:border-dgm-gold/50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                         <GitBranch className="text-purple-400" size={20} />
                         <span className="font-bold text-white">Create Snapshot</span>
                      </div>
                      <p className="text-xs text-white/40">Save current state for version control.</p>
                   </div>
                </div>

                <div className="mt-auto pt-6 border-t border-white/10">
                   <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2">System Status</p>
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs text-white font-mono">DEDI SERVER: ONLINE</span>
                   </div>
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
             <h1 className="text-2xl font-bold text-white">Analytics Hub</h1>
             <p className="text-white/60 text-sm">Direction des Études, Documentation et Informatique</p>
          </div>
          <div className="bg-black/20 p-1 rounded-xl flex gap-1 border border-white/10">
             <button 
                onClick={() => setActiveTab('FLOW')}
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'FLOW' ? 'bg-dgm-gold text-dgm-blue shadow-lg' : 'text-white/60 hover:text-white'}`}
             >
                <Globe size={16} /> Flows
             </button>
             <button 
                onClick={() => setActiveTab('DOCS')}
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'DOCS' ? 'bg-dgm-gold text-dgm-blue shadow-lg' : 'text-white/60 hover:text-white'}`}
             >
                <FileText size={16} /> Docs
             </button>
             <button 
                onClick={() => setActiveTab('RESEARCH')}
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'RESEARCH' ? 'bg-dgm-gold text-dgm-blue shadow-lg' : 'text-white/60 hover:text-white'}`}
             >
                <Beaker size={16} /> Research
             </button>
          </div>
       </div>

       {/* Main Content */}
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
                {activeTab === 'FLOW' && <FlowAnalysis />}
                {activeTab === 'DOCS' && <DocumentManagement />}
                {activeTab === 'RESEARCH' && <ResearchTools />}
             </motion.div>
          </AnimatePresence>
       </div>
    </div>
  );
};

export default AnalyticsHub;