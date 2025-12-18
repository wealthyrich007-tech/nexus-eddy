import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Search, Plus, MapPin, Calendar, Clock, AlertTriangle, 
  FileText, Fingerprint, Mic, Camera, ShieldCheck, ChevronRight, 
  MoreHorizontal, Plane, Phone, CreditCard
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

// Mock Data Types
interface ForeignerProfile {
  id: string;
  name: string;
  nationality: string;
  passport: string;
  visaType: string;
  entryDate: string;
  visaExpiry: string;
  status: 'VALID' | 'WARNING' | 'OVERSTAY' | 'HIGH_RISK';
  riskScore: number;
  lastLocation: string;
  photo: string;
}

const MOCK_PROFILES: ForeignerProfile[] = [
  {
    id: 'F-2024-001',
    name: 'Sarah Jenkins',
    nationality: 'United Kingdom',
    passport: 'GB-9928374',
    visaType: 'Business (Ordinary)',
    entryDate: '2024-01-15',
    visaExpiry: '2024-04-15',
    status: 'VALID',
    riskScore: 12,
    lastLocation: 'Pullman Hotel, Kinshasa',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'F-2024-089',
    name: 'Wei Chen',
    nationality: 'China',
    passport: 'CN-8837221',
    visaType: 'Mining Permit (Work)',
    entryDate: '2023-11-20',
    visaExpiry: '2024-02-20',
    status: 'WARNING',
    riskScore: 45,
    lastLocation: 'Kolwezi Mining District',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'F-2024-112',
    name: 'Jean Dubois',
    nationality: 'France',
    passport: 'FR-1122334',
    visaType: 'Tourist',
    entryDate: '2023-10-01',
    visaExpiry: '2024-01-01',
    status: 'OVERSTAY',
    riskScore: 88,
    lastLocation: 'Goma Border Post (Attempted Exit)',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
  }
];

const ForeignerManagement: React.FC = () => {
  const [viewMode, setViewMode] = useState<'LIST' | 'PROFILE' | 'REGISTER'>('LIST');
  const [selectedProfile, setSelectedProfile] = useState<ForeignerProfile | null>(null);
  const [registerStep, setRegisterStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProfiles = MOCK_PROFILES.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.passport.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProfileSelect = (profile: ForeignerProfile) => {
    setSelectedProfile(profile);
    setViewMode('PROFILE');
  };

  const RegistrationWizard = () => {
    const [audioLevel, setAudioLevel] = useState<number[]>(new Array(10).fill(10));
    
    // Simulate audio visuals
    useEffect(() => {
        const interval = setInterval(() => {
            setAudioLevel(prev => prev.map(() => Math.random() * 40 + 10));
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => setViewMode('LIST')} className="text-white/60 hover:text-white flex items-center gap-2">
            <ChevronRight className="rotate-180" size={20} /> Back to Registry
          </button>
          <div className="flex gap-2">
            {[1, 2, 3].map(step => (
              <div 
                key={step} 
                className={`w-3 h-3 rounded-full transition-colors ${registerStep >= step ? 'bg-dgm-gold' : 'bg-white/10'}`} 
              />
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
          <AnimatePresence mode="wait">
            
            {/* Step 1: Document Scan */}
            {registerStep === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full text-center space-y-6"
              >
                <div className="w-24 h-24 bg-dgm-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-dgm-gold/30">
                  <Camera size={40} className="text-dgm-gold" />
                </div>
                <h2 className="text-2xl font-bold text-white">Smart Document Capture</h2>
                <p className="text-white/50">Place passport and visa on the scanner. Optical Character Recognition (OCR) active.</p>
                
                <div className="bg-black/30 border-2 border-dashed border-white/20 rounded-2xl h-64 flex flex-col items-center justify-center relative overflow-hidden group hover:border-dgm-gold/50 transition-colors cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-b from-dgm-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <FileText size={48} className="text-white/20 mb-4" />
                  <span className="text-white/40 text-sm">Drop scan file or click to activate camera</span>
                </div>

                <button 
                  onClick={() => setRegisterStep(2)}
                  className="w-full bg-dgm-blue border border-dgm-gold/30 hover:bg-white/10 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  Confirm Document Data <ChevronRight size={20} />
                </button>
              </motion.div>
            )}

            {/* Step 2: Biometrics */}
            {registerStep === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full text-center space-y-6"
              >
                <div className="w-24 h-24 bg-dgm-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-dgm-gold/30">
                  <Fingerprint size={40} className="text-dgm-gold" />
                </div>
                <h2 className="text-2xl font-bold text-white">Biometric Enrollment</h2>
                <p className="text-white/50">Capture fingerprints and facial mapping for the digital identity dossier.</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/30 border border-white/10 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-white/5 transition-colors cursor-pointer">
                     <Fingerprint size={48} className="text-emerald-500 mb-4" />
                     <span className="text-white font-bold">10-Print Scan</span>
                     <span className="text-emerald-500 text-xs mt-1">COMPLETED</span>
                  </div>
                  <div className="bg-black/30 border border-white/10 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-white/5 transition-colors cursor-pointer relative overflow-hidden">
                     <div className="absolute inset-0 border-2 border-dgm-gold/30 rounded-xl animate-pulse" />
                     <div className="w-16 h-16 rounded-full border-2 border-white/20 mb-4 relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-dgm-gold animate-[spin_2s_linear_infinite]" />
                     </div>
                     <span className="text-white font-bold">Facial Map</span>
                     <span className="text-dgm-gold text-xs mt-1">SCANNING...</span>
                  </div>
                </div>

                <button 
                  onClick={() => setRegisterStep(3)}
                  className="w-full bg-dgm-blue border border-dgm-gold/30 hover:bg-white/10 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  Save Biometrics <ChevronRight size={20} />
                </button>
              </motion.div>
            )}

            {/* Step 3: Voice Signature */}
            {registerStep === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full text-center space-y-6"
              >
                <div className="w-24 h-24 bg-dgm-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-dgm-gold/30">
                  <Mic size={40} className="text-dgm-gold" />
                </div>
                <h2 className="text-2xl font-bold text-white">Voice Signature</h2>
                <p className="text-white/50">Ask subject to state their full name and date of birth for voiceprinting.</p>
                
                <div className="bg-black/30 border border-white/10 rounded-xl p-8 h-48 flex items-center justify-center gap-1">
                   {audioLevel.map((h, i) => (
                      <motion.div 
                        key={i}
                        animate={{ height: `${h}%` }}
                        className="w-3 bg-dgm-gold rounded-full"
                      />
                   ))}
                </div>

                <button 
                  onClick={() => {
                      setRegisterStep(1);
                      setViewMode('LIST');
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  Complete Registration <ShieldCheck size={20} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  const DigitalDossier = () => {
    if (!selectedProfile) return null;

    return (
      <div className="flex flex-col h-full animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
           <div className="flex items-center gap-6">
              <button onClick={() => setViewMode('LIST')} className="p-2 hover:bg-white/10 rounded-lg text-white/50 transition-colors">
                 <ChevronRight className="rotate-180" size={24} />
              </button>
              <div className="relative">
                 <img src={selectedProfile.photo} alt={selectedProfile.name} className="w-24 h-24 rounded-2xl object-cover border-2 border-white/10" />
                 <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-dgm-dark flex items-center justify-center ${
                    selectedProfile.status === 'VALID' ? 'bg-emerald-500' : 
                    selectedProfile.status === 'WARNING' ? 'bg-orange-500' : 'bg-red-500'
                 }`}>
                    {selectedProfile.status === 'VALID' ? <ShieldCheck size={14} /> : <AlertTriangle size={14} />}
                 </div>
              </div>
              <div>
                 <h1 className="text-3xl font-bold text-white mb-1">{selectedProfile.name}</h1>
                 <div className="flex items-center gap-4 text-white/60 text-sm">
                    <span className="flex items-center gap-1"><CreditCard size={14} /> {selectedProfile.passport}</span>
                    <span className="w-1 h-1 bg-white/30 rounded-full" />
                    <span className="flex items-center gap-1"><Plane size={14} /> {selectedProfile.nationality}</span>
                 </div>
                 <div className="mt-2 flex gap-2">
                    <span className="px-2 py-1 bg-white/5 rounded text-xs font-mono text-dgm-gold border border-white/10">ID: {selectedProfile.id}</span>
                    <span className="px-2 py-1 bg-white/5 rounded text-xs font-mono text-white/60 border border-white/10">VISA: {selectedProfile.visaType}</span>
                 </div>
              </div>
           </div>
           
           <div className="flex gap-3">
              <button className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-bold border border-white/10 flex items-center gap-2">
                 <Phone size={16} /> Contact
              </button>
              <button className="bg-dgm-gold hover:bg-white text-dgm-blue px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-dgm-gold/10">
                 Edit Dossier
              </button>
           </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-y-auto pr-2">
           
           {/* Left Col: Stay Management & Timeline */}
           <div className="lg:col-span-2 space-y-6">
              {/* Stay Visualizer */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                 <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Clock className="text-dgm-gold" size={20} /> Stay Management
                 </h3>
                 
                 <div className="relative pt-8 pb-12 px-4">
                    {/* Progress Bar */}
                    <div className="h-2 bg-white/10 rounded-full relative overflow-hidden">
                       <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: selectedProfile.status === 'OVERSTAY' ? '100%' : '65%' }}
                          className={`h-full rounded-full ${
                             selectedProfile.status === 'OVERSTAY' ? 'bg-red-500' : 
                             selectedProfile.status === 'WARNING' ? 'bg-orange-500' : 'bg-emerald-500'
                          }`}
                       />
                    </div>
                    
                    {/* Markers */}
                    <div className="absolute top-0 left-0 -translate-x-1/2 flex flex-col items-center">
                       <span className="text-xs text-white/40 mb-2">Entry</span>
                       <div className="w-4 h-4 rounded-full bg-dgm-blue border-2 border-white z-10" />
                       <span className="text-xs font-mono text-white mt-2">{selectedProfile.entryDate}</span>
                    </div>

                    <div className="absolute top-0 right-0 translate-x-1/2 flex flex-col items-center">
                       <span className="text-xs text-white/40 mb-2">Expiry</span>
                       <div className={`w-4 h-4 rounded-full border-2 border-white z-10 ${selectedProfile.status === 'OVERSTAY' ? 'bg-red-500 animate-pulse' : 'bg-dgm-blue'}`} />
                       <span className={`text-xs font-mono mt-2 ${selectedProfile.status === 'OVERSTAY' ? 'text-red-400 font-bold' : 'text-white'}`}>{selectedProfile.visaExpiry}</span>
                    </div>

                    {/* Current Position */}
                    <div className="absolute top-2 left-[65%] -translate-x-1/2 flex flex-col items-center">
                       <div className="bg-white text-dgm-blue text-[10px] font-bold px-2 py-1 rounded mb-1">TODAY</div>
                       <div className="w-0.5 h-6 bg-white/50" />
                    </div>
                 </div>

                 {selectedProfile.status === 'OVERSTAY' && (
                    <div className="mt-2 bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex items-center gap-3">
                       <AlertTriangle className="text-red-500" />
                       <div>
                          <p className="text-red-400 font-bold text-sm">VISA EXPIRED</p>
                          <p className="text-white/60 text-xs">Subject is currently overstaying by 14 days. Immediate action required.</p>
                       </div>
                    </div>
                 )}
              </div>

              {/* Movement History */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                 <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <MapPin className="text-dgm-gold" size={20} /> Movement Log
                 </h3>
                 <div className="space-y-4">
                    {[1, 2, 3].map((_, i) => (
                       <div key={i} className="flex gap-4 items-start relative">
                          {i !== 2 && <div className="absolute left-[19px] top-8 bottom-[-16px] w-0.5 bg-white/10" />}
                          <div className="w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center shrink-0">
                             <MapPin size={16} className="text-white/40" />
                          </div>
                          <div className="flex-1 bg-white/5 rounded-xl p-3 border border-white/5">
                             <div className="flex justify-between items-start">
                                <span className="text-sm font-bold text-white">{i === 0 ? selectedProfile.lastLocation : i === 1 ? 'Hotel Memling, Kinshasa' : 'N\'Djili Airport (Entry)'}</span>
                                <span className="text-xs text-white/40 font-mono">{i === 0 ? '2 hrs ago' : i === 1 ? '2 days ago' : selectedProfile.entryDate}</span>
                             </div>
                             <p className="text-xs text-white/40 mt-1">{i === 0 ? 'Geofence Check-in (Automatic)' : i === 1 ? 'Hotel Registration' : 'Immigration Clearance'}</p>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Right Col: Risk & Bio */}
           <div className="space-y-6">
              {/* ML Risk Score */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-5">
                    <BrainCircuit size={100} />
                 </div>
                 <h3 className="text-lg font-bold text-white mb-2">AI Risk Assessment</h3>
                 <div className="flex items-end gap-2 mb-2">
                    <span className={`text-5xl font-black ${
                       selectedProfile.riskScore > 70 ? 'text-red-500' : 
                       selectedProfile.riskScore > 30 ? 'text-orange-400' : 'text-emerald-400'
                    }`}>{selectedProfile.riskScore}</span>
                    <span className="text-white/40 text-sm mb-2">/ 100</span>
                 </div>
                 <p className="text-xs text-white/60 leading-relaxed">
                    Based on travel patterns, visa compliance history, and financial data.
                    {selectedProfile.riskScore > 70 && <span className="block mt-2 text-red-400 font-bold">⚠️ HIGH FLIGHT RISK DETECTED</span>}
                 </p>
              </div>

              {/* Biometric Status */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                 <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 opacity-60">Biometric Data</h3>
                 <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                       <div className="flex items-center gap-3">
                          <Fingerprint className="text-dgm-gold" size={18} />
                          <span className="text-sm text-white">Fingerprints</span>
                       </div>
                       <CheckCircle size={16} className="text-emerald-500" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                       <div className="flex items-center gap-3">
                          <ScanFace className="text-dgm-gold" size={18} />
                          <span className="text-sm text-white">Face Map</span>
                       </div>
                       <CheckCircle size={16} className="text-emerald-500" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                       <div className="flex items-center gap-3">
                          <Mic className="text-dgm-gold" size={18} />
                          <span className="text-sm text-white">Voice ID</span>
                       </div>
                       <CheckCircle size={16} className="text-emerald-500" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 overflow-hidden flex flex-col">
      {/* List View */}
      {viewMode === 'LIST' && (
        <div className="flex flex-col h-full animate-in fade-in duration-300">
           <div className="flex justify-between items-center mb-6">
              <div>
                 <h1 className="text-2xl font-bold text-white">Direction Police Étrangers</h1>
                 <p className="text-white/60 text-sm">Foreign National Registry & Tracking</p>
              </div>
              <button 
                 onClick={() => {
                   setRegisterStep(1);
                   setViewMode('REGISTER');
                 }}
                 className="bg-dgm-gold hover:bg-white text-dgm-blue font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-dgm-gold/10"
              >
                 <Plus size={18} /> New Registration
              </button>
           </div>

           <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
                 <input 
                    type="text" 
                    placeholder="Search by name, passport, or visa number..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-dgm-gold/50 transition-colors"
                 />
              </div>
              <div className="flex gap-2">
                 <select className="bg-black/20 border border-white/10 rounded-xl px-4 text-white focus:outline-none">
                    <option>All Statuses</option>
                    <option>Valid</option>
                    <option>Overstay</option>
                    <option>Warning</option>
                 </select>
              </div>
           </div>

           <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="text-white/40 text-xs uppercase tracking-wider border-b border-white/10">
                       <th className="pb-4 pl-4">Identity</th>
                       <th className="pb-4">Nationality</th>
                       <th className="pb-4">Visa Status</th>
                       <th className="pb-4">Risk Level</th>
                       <th className="pb-4">Last Location</th>
                       <th className="pb-4"></th>
                    </tr>
                 </thead>
                 <tbody className="text-sm">
                    {filteredProfiles.map((profile) => (
                       <tr 
                          key={profile.id} 
                          onClick={() => handleProfileSelect(profile)}
                          className="group hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5 last:border-0"
                       >
                          <td className="py-4 pl-4">
                             <div className="flex items-center gap-3">
                                <img src={profile.photo} className="w-10 h-10 rounded-full object-cover border border-white/10" alt="" />
                                <div>
                                   <div className="font-bold text-white">{profile.name}</div>
                                   <div className="text-white/40 text-xs font-mono">{profile.passport}</div>
                                </div>
                             </div>
                          </td>
                          <td className="py-4 text-white/80">{profile.nationality}</td>
                          <td className="py-4">
                             <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
                                profile.status === 'VALID' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                profile.status === 'WARNING' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                                'bg-red-500/10 text-red-400 border border-red-500/20'
                             }`}>
                                {profile.status === 'VALID' ? <ShieldCheck size={12} /> : <AlertTriangle size={12} />}
                                {profile.status}
                             </div>
                             <div className="text-[10px] text-white/30 mt-1 font-mono">Exp: {profile.visaExpiry}</div>
                          </td>
                          <td className="py-4">
                             <div className="w-24 h-1.5 bg-black/40 rounded-full overflow-hidden">
                                <div 
                                   className={`h-full rounded-full ${
                                      profile.riskScore > 70 ? 'bg-red-500' : 
                                      profile.riskScore > 30 ? 'bg-orange-400' : 'bg-emerald-500'
                                   }`} 
                                   style={{ width: `${profile.riskScore}%` }} 
                                />
                             </div>
                             <div className="text-[10px] text-white/40 mt-1 text-right w-24">{profile.riskScore}/100</div>
                          </td>
                          <td className="py-4 text-white/60 flex items-center gap-2">
                             <MapPin size={14} className="text-dgm-gold" />
                             {profile.lastLocation}
                          </td>
                          <td className="py-4 text-right pr-4">
                             <button className="p-2 text-white/30 hover:text-white transition-colors">
                                <MoreHorizontal size={18} />
                             </button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {/* Profile Detail View */}
      {viewMode === 'PROFILE' && <DigitalDossier />}

      {/* Registration View */}
      {viewMode === 'REGISTER' && <RegistrationWizard />}
    </div>
  );
};

// Missing Imports fix
import { ScanFace, CheckCircle, BrainCircuit } from 'lucide-react';

export default ForeignerManagement;