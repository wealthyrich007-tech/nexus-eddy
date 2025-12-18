import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, TrendingUp, CreditCard, AlertTriangle, FileText, 
  PieChart as PieChartIcon, Upload, CheckCircle, XCircle, 
  Search, Download, ShieldCheck, Wallet, Banknote, Scan, ArrowUpRight, ArrowDownRight,
  PenTool, Link, Lock
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, Cell, PieChart, Pie 
} from 'recharts';

type Tab = 'REVENUE' | 'EXPENSES' | 'REPORTING';

const REVENUE_DATA = [
  { date: '1 Feb', actual: 45000, forecast: 44000 },
  { date: '5 Feb', actual: 52000, forecast: 48000 },
  { date: '10 Feb', actual: 49000, forecast: 51000 },
  { date: '15 Feb', actual: 58000, forecast: 55000 },
  { date: '20 Feb', actual: 63000, forecast: 60000 },
  { date: '25 Feb', actual: 61000, forecast: 62000 },
  { date: 'Today', actual: 65000, forecast: 63000 },
];

const EXPENSE_DATA = [
  { category: 'Personnel', amount: 45000, color: '#10B981' },
  { category: 'Logistics', amount: 32000, color: '#3B82F6' },
  { category: 'IT Infra', amount: 18000, color: '#D4AF37' },
  { category: 'Ops', amount: 12000, color: '#F97316' },
];

const TRANSACTIONS = [
  { id: 'TX-9921', type: 'Visa Fee', amount: 1200, status: 'CLEARED', date: '10 mins ago' },
  { id: 'TX-9922', type: 'Border Pass', amount: 50, status: 'CLEARED', date: '15 mins ago' },
  { id: 'TX-9923', type: 'Fine: Overstay', amount: 450, status: 'FLAGGED', date: '22 mins ago' },
  { id: 'TX-9924', type: 'Visa Fee', amount: 1200, status: 'CLEARED', date: '25 mins ago' },
];

const Finance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('REVENUE');

  const RevenueDashboard = () => {
    return (
      <div className="h-full flex flex-col gap-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Banknote size={64} className="text-emerald-400" />
            </div>
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                  <DollarSign size={20} />
               </div>
               <span className="text-white/60 text-sm font-bold uppercase">Daily Collection</span>
            </div>
            <div className="flex items-end gap-2">
               <h3 className="text-3xl font-bold text-white">$65,240</h3>
               <span className="text-emerald-400 text-xs font-bold mb-1 flex items-center">
                  <ArrowUpRight size={12} /> +12%
               </span>
            </div>
            <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
               <div className="h-full bg-emerald-500 w-[85%]" />
            </div>
            <p className="text-[10px] text-white/40 mt-1">85% of daily target reached</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <TrendingUp size={64} className="text-dgm-gold" />
            </div>
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-dgm-gold/10 rounded-lg text-dgm-gold">
                  <TrendingUp size={20} />
               </div>
               <span className="text-white/60 text-sm font-bold uppercase">Projected (Feb)</span>
            </div>
            <div className="flex items-end gap-2">
               <h3 className="text-3xl font-bold text-white">$1.8M</h3>
               <span className="text-white/40 text-xs font-bold mb-1">
                  Confidence: 94%
               </span>
            </div>
            <div className="mt-4 text-xs text-white/60">
               Based on historical flow & seasonality
            </div>
          </div>

          <div className="bg-white/5 border border-red-500/20 rounded-2xl p-6 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <AlertTriangle size={64} className="text-red-500" />
            </div>
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                  <ShieldCheck size={20} />
               </div>
               <span className="text-white/60 text-sm font-bold uppercase">Fraud Alerts</span>
            </div>
            <div className="flex items-end gap-2">
               <h3 className="text-3xl font-bold text-white">3</h3>
               <span className="text-red-400 text-xs font-bold mb-1">Action Req.</span>
            </div>
            <div className="mt-4 flex -space-x-2">
               {[1,2,3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full bg-red-900 border border-black flex items-center justify-center text-[10px] text-red-200 font-bold">!</div>
               ))}
            </div>
          </div>
        </div>

        {/* Main Chart Section */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-white">Revenue Stream Analysis</h3>
                 <div className="flex gap-2 text-xs">
                    <span className="flex items-center gap-1 text-emerald-400"><div className="w-2 h-2 bg-emerald-400 rounded-full"/> Actual</span>
                    <span className="flex items-center gap-1 text-dgm-gold"><div className="w-2 h-2 bg-dgm-gold rounded-full"/> Forecast</span>
                 </div>
              </div>
              <div className="flex-1">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={REVENUE_DATA}>
                       <defs>
                          <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                       <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                       <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickFormatter={(value) => `$${value/1000}k`} />
                       <Tooltip 
                          contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }}
                          formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                       />
                       <Area type="monotone" dataKey="actual" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorActual)" />
                       <Area type="monotone" dataKey="forecast" stroke="#D4AF37" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>

           <div className="bg-black/20 border border-white/10 rounded-2xl p-6 flex flex-col">
              <h3 className="font-bold text-white mb-4">Recent Transactions</h3>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                 {TRANSACTIONS.map((tx) => (
                    <div key={tx.id} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                       <div className="flex justify-between items-start mb-1">
                          <span className="text-white font-bold text-sm group-hover:text-dgm-gold transition-colors">{tx.type}</span>
                          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                             tx.status === 'CLEARED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400 animate-pulse'
                          }`}>{tx.status}</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-white/40 text-xs font-mono">{tx.id}</span>
                          <span className="text-white font-bold">${tx.amount}</span>
                       </div>
                       <div className="mt-1 text-right text-[10px] text-white/30">{tx.date}</div>
                    </div>
                 ))}
              </div>
              <button className="mt-4 w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-white font-bold">
                 View All Ledger
              </button>
           </div>
        </div>
      </div>
    );
  };

  const ExpenseManagement = () => {
     const [scanning, setScanning] = useState(false);

     const handleScan = () => {
        setScanning(true);
        setTimeout(() => setScanning(false), 2000);
     };

     return (
        <div className="h-full flex gap-6">
           <div className="flex-1 flex flex-col gap-6">
              {/* Budget Chart */}
              <div className="h-64 bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between">
                 <div className="w-1/2 h-full">
                    <h3 className="font-bold text-white mb-4">Budget Distribution</h3>
                    <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                          <Pie
                             data={EXPENSE_DATA}
                             cx="50%"
                             cy="50%"
                             innerRadius={60}
                             outerRadius={80}
                             paddingAngle={5}
                             dataKey="amount"
                          >
                             {EXPENSE_DATA.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                             ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
                          <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" />
                       </PieChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="w-1/2 h-full pl-8 border-l border-white/10 flex flex-col justify-center gap-6">
                    <div>
                       <p className="text-white/40 text-sm uppercase tracking-wider mb-1">Total Budget (Q1)</p>
                       <p className="text-3xl font-bold text-white">$450,000</p>
                    </div>
                    <div>
                       <p className="text-white/40 text-sm uppercase tracking-wider mb-1">Remaining</p>
                       <p className="text-3xl font-bold text-emerald-400">$128,400</p>
                    </div>
                 </div>
              </div>

              {/* Approval List */}
              <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
                 <h3 className="font-bold text-white mb-4">Pending Approvals</h3>
                 <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                    {[1, 2, 3].map((i) => (
                       <div key={i} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                <FileText size={20} className="text-white/60" />
                             </div>
                             <div>
                                <h4 className="text-white font-bold text-sm">Equipment Upgrade - Post 4</h4>
                                <p className="text-white/40 text-xs">Req by: Lt. Bemba • $2,400</p>
                             </div>
                          </div>
                          <div className="flex gap-2">
                             <button className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
                                <XCircle size={20} />
                             </button>
                             <button className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors">
                                <PenTool size={20} />
                             </button>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Receipt Scanner */}
           <div className="w-96 bg-black/40 border border-white/10 rounded-2xl p-6 flex flex-col">
              <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                 <Scan className="text-dgm-gold" /> Expense Scanner
              </h3>
              
              <div className="flex-1 bg-white/5 border-2 border-dashed border-white/10 rounded-xl mb-6 relative overflow-hidden flex flex-col items-center justify-center group hover:border-dgm-gold/30 transition-colors">
                 {scanning ? (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10">
                       <div className="w-20 h-20 border-4 border-dgm-gold border-t-transparent rounded-full animate-spin mb-4" />
                       <p className="text-dgm-gold font-mono text-sm animate-pulse">OCR EXTRACTING...</p>
                    </div>
                 ) : (
                    <>
                       <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Upload size={32} className="text-white/50" />
                       </div>
                       <p className="text-white/60 text-sm font-medium">Drop receipt or click to scan</p>
                       <p className="text-white/30 text-xs mt-1">Supports PDF, JPG, PNG</p>
                    </>
                 )}
              </div>

              <div className="space-y-4">
                 <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex justify-between text-xs text-white/40 uppercase mb-2">
                       <span>Merchant</span>
                       <span>Date</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-white mb-4">
                       <span>--</span>
                       <span>--</span>
                    </div>
                    <div className="flex justify-between text-xs text-white/40 uppercase mb-2">
                       <span>Total</span>
                       <span>Tax</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-white">
                       <span>$0.00</span>
                       <span>$0.00</span>
                    </div>
                 </div>
                 
                 <button 
                    onClick={handleScan}
                    className="w-full bg-dgm-gold hover:bg-white text-dgm-blue font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                 >
                    <Scan size={18} /> Process Receipt
                 </button>
              </div>
           </div>
        </div>
     );
  };

  const ReportingSuite = () => {
     return (
        <div className="h-full flex flex-col">
           <div className="grid grid-cols-4 gap-6 mb-8">
              {[
                 { label: 'Generated Reports', val: '24', icon: FileText, color: 'text-blue-400' },
                 { label: 'Pending Audits', val: '2', icon: AlertTriangle, color: 'text-orange-400' },
                 { label: 'Blockchain Height', val: '#892,104', icon: Link, color: 'text-emerald-400' },
                 { label: 'Compliance Score', val: '98.5%', icon: ShieldCheck, color: 'text-dgm-gold' },
              ].map((stat, i) => (
                 <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4">
                    <div className={`p-3 bg-white/5 rounded-lg ${stat.color}`}>
                       <stat.icon size={24} />
                    </div>
                    <div>
                       <p className="text-2xl font-bold text-white">{stat.val}</p>
                       <p className="text-xs text-white/50 uppercase">{stat.label}</p>
                    </div>
                 </div>
              ))}
           </div>

           <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col">
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
                 <h3 className="font-bold text-white">Financial Reports Registry</h3>
                 <div className="flex gap-2">
                    <div className="relative">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
                       <input 
                          type="text" 
                          placeholder="Search reports..." 
                          className="bg-white/5 border border-white/10 rounded-lg py-1.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-dgm-gold/50"
                       />
                    </div>
                    <button className="px-3 py-1.5 bg-dgm-gold text-dgm-blue text-xs font-bold rounded-lg hover:bg-white transition-colors">
                       Generate New
                    </button>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                 <table className="w-full text-left border-collapse">
                    <thead className="text-xs text-white/40 uppercase bg-white/5">
                       <tr>
                          <th className="p-4">Report Name</th>
                          <th className="p-4">Period</th>
                          <th className="p-4">Generated By</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Verification</th>
                          <th className="p-4"></th>
                       </tr>
                    </thead>
                    <tbody className="text-sm">
                       {[1, 2, 3, 4, 5].map((i) => (
                          <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                             <td className="p-4 font-bold text-white">Q1_Revenue_Consolidated_{i}.pdf</td>
                             <td className="p-4 text-white/60">Jan 1 - Mar 31</td>
                             <td className="p-4 text-white/60">System Auto-Gen</td>
                             <td className="p-4">
                                <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-xs font-bold border border-emerald-500/20">FINALIZED</span>
                             </td>
                             <td className="p-4">
                                <div className="flex items-center gap-2 text-xs text-dgm-gold font-mono bg-dgm-gold/10 px-2 py-1 rounded w-fit">
                                   <Lock size={12} /> 0x89a...2b4
                                </div>
                             </td>
                             <td className="p-4 text-right">
                                <button className="p-2 hover:bg-white/10 rounded text-white/60 hover:text-white transition-colors">
                                   <Download size={18} />
                                </button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
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
             <h1 className="text-2xl font-bold text-white">Direction des Finances</h1>
             <p className="text-white/60 text-sm">Revenue Management & Compliance</p>
          </div>
          <div className="bg-black/20 p-1 rounded-xl flex gap-1 border border-white/10">
             <button 
                onClick={() => setActiveTab('REVENUE')}
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'REVENUE' ? 'bg-dgm-gold text-dgm-blue shadow-lg' : 'text-white/60 hover:text-white'}`}
             >
                <TrendingUp size={16} /> Revenue
             </button>
             <button 
                onClick={() => setActiveTab('EXPENSES')}
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'EXPENSES' ? 'bg-dgm-gold text-dgm-blue shadow-lg' : 'text-white/60 hover:text-white'}`}
             >
                <CreditCard size={16} /> Expenses
             </button>
             <button 
                onClick={() => setActiveTab('REPORTING')}
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'REPORTING' ? 'bg-dgm-gold text-dgm-blue shadow-lg' : 'text-white/60 hover:text-white'}`}
             >
                <FileText size={16} /> Reporting
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
                {activeTab === 'REVENUE' && <RevenueDashboard />}
                {activeTab === 'EXPENSES' && <ExpenseManagement />}
                {activeTab === 'REPORTING' && <ReportingSuite />}
             </motion.div>
          </AnimatePresence>
       </div>
    </div>
  );
};

export default Finance;