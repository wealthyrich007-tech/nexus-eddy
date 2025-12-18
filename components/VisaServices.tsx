import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stamp, Calendar, CreditCard, CheckCircle, Upload, FileText, User, 
  ChevronRight, Clock, Users, QrCode, ShieldCheck, Loader2, Link, 
  ArrowRight, FileCheck, RefreshCw, CalendarCheck
} from 'lucide-react';

type Tab = 'APPLICATION' | 'APPOINTMENTS' | 'ISSUANCE';

const VisaServices: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('APPLICATION');

  // --- SUB-COMPONENTS ---

  const VisaApplicationWizard = () => {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      passportNumber: '',
      nationality: '',
    });

    const simulateAutofill = () => {
      setIsLoading(true);
      setTimeout(() => {
        setFormData({
          firstName: 'MICHAEL',
          lastName: 'KABEYA',
          passportNumber: 'COD-998273-X',
          nationality: 'CONGOLESE',
        });
        setIsLoading(false);
      }, 1500);
    };

    return (
      <div className="h-full flex flex-col">
        {/* Progress Stepper */}
        <div className="flex justify-between items-center mb-8 px-12">
           {[1, 2, 3, 4].map((s) => (
             <div key={s} className="flex flex-col items-center relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors duration-300 ${
                   step >= s ? 'bg-dgm-gold text-dgm-blue' : 'bg-white/10 text-white/40'
                }`}>
                   {step > s ? <CheckCircle size={20} /> : s}
                </div>
                <span className={`text-xs mt-2 font-medium ${step >= s ? 'text-dgm-gold' : 'text-white/30'}`}>
                   {s === 1 ? 'Details' : s === 2 ? 'Documents' : s === 3 ? 'Verification' : 'Payment'}
                </span>
                {s !== 4 && (
                   <div className="absolute top-5 left-1/2 w-[calc(100vw/5)] h-0.5 -z-10 bg-white/10">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: step > s ? '100%' : '0%' }}
                        className="h-full bg-dgm-gold"
                      />
                   </div>
                )}
             </div>
           ))}
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto px-4">
           <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="max-w-2xl mx-auto space-y-6"
                >
                  <div className="bg-dgm-blue/50 border border-dgm-gold/20 p-6 rounded-2xl flex justify-between items-center">
                     <div>
                        <h3 className="font-bold text-white flex items-center gap-2">
                           <Stamp size={18} className="text-dgm-gold" /> Application Type
                        </h3>
                        <p className="text-sm text-white/50">Standard Tourist Visa (30 Days)</p>
                     </div>
                     <button className="text-dgm-gold text-sm font-bold hover:underline">Change</button>
                  </div>

                  <div className="space-y-4">
                     <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white">Personal Information</h3>
                        <button 
                           onClick={simulateAutofill}
                           disabled={isLoading}
                           className="flex items-center gap-2 text-xs bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors"
                        >
                           {isLoading ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                           Auto-fill from Passport Scan
                        </button>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-xs text-white/40 uppercase">First Name</label>
                           <input type="text" value={formData.firstName} readOnly className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs text-white/40 uppercase">Last Name</label>
                           <input type="text" value={formData.lastName} readOnly className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs text-white/40 uppercase">Passport No.</label>
                           <input type="text" value={formData.passportNumber} readOnly className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white font-mono" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs text-white/40 uppercase">Nationality</label>
                           <input type="text" value={formData.nationality} readOnly className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white" />
                        </div>
                     </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                 <motion.div 
                   key="step2"
                   initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                   className="max-w-2xl mx-auto space-y-6"
                 >
                    <h3 className="text-lg font-bold text-white mb-4">Document Checklist</h3>
                    <div className="space-y-3">
                       {['Valid Passport Scan', 'Proof of Accommodation', 'Return Flight Ticket', 'Yellow Fever Card'].map((doc, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl group hover:border-dgm-gold/30 transition-colors cursor-pointer">
                             <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${i < 2 ? 'bg-emerald-500/20 text-emerald-500' : 'bg-white/10 text-white/40'}`}>
                                   {i < 2 ? <CheckCircle size={16} /> : <FileText size={16} />}
                                </div>
                                <span className={i < 2 ? 'text-white' : 'text-white/60'}>{doc}</span>
                             </div>
                             <button className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg text-white border border-white/10 flex items-center gap-2">
                                <Upload size={12} /> {i < 2 ? 'Re-upload' : 'Upload'}
                             </button>
                          </div>
                       ))}
                    </div>
                    
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3 mt-4">
                       <ShieldCheck className="text-emerald-500 shrink-0" size={20} />
                       <div className="space-y-1">
                          <p className="text-sm font-bold text-emerald-400">AI Validation Active</p>
                          <p className="text-xs text-white/60">Documents are automatically scanned for authenticity markers and consistency.</p>
                       </div>
                    </div>
                 </motion.div>
              )}
           </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-6 border-t border-white/10 flex justify-between">
           <button 
             onClick={() => step > 1 && setStep(s => s - 1)}
             disabled={step === 1}
             className="px-6 py-3 rounded-xl text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
           >
              Back
           </button>
           <button 
             onClick={() => step < 4 ? setStep(s => s + 1) : setStep(1)}
             className="px-8 py-3 bg-dgm-gold hover:bg-white text-dgm-blue font-bold rounded-xl shadow-lg shadow-dgm-gold/10 flex items-center gap-2 transition-colors"
           >
              {step === 4 ? 'Submit Application' : 'Continue'} <ChevronRight size={18} />
           </button>
        </div>
      </div>
    );
  };

  const AppointmentSystem = () => {
     return (
        <div className="h-full flex gap-6">
           {/* Calendar Area */}
           <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-white flex items-center gap-2">
                    <Calendar className="text-dgm-gold" /> Appointment Schedule
                 </h3>
                 <div className="flex gap-2">
                    <button className="px-3 py-1 bg-white/10 rounded-lg text-xs text-white hover:bg-white/20">Day</button>
                    <button className="px-3 py-1 bg-dgm-blue border border-dgm-gold text-xs text-dgm-gold rounded-lg">Week</button>
                    <button className="px-3 py-1 bg-white/10 rounded-lg text-xs text-white hover:bg-white/20">Month</button>
                 </div>
              </div>

              {/* Mock Calendar Grid */}
              <div className="flex-1 grid grid-cols-5 gap-px bg-white/10 border border-white/10 rounded-xl overflow-hidden">
                 {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                    <div key={day} className="bg-dgm-dark/80 p-2 text-center text-xs text-white/40 uppercase tracking-wider">{day}</div>
                 ))}
                 {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="bg-dgm-dark/40 min-h-[80px] p-2 relative group hover:bg-white/5 transition-colors cursor-pointer">
                       <span className="text-xs text-white/20 absolute top-2 right-2">{i + 1}</span>
                       {i === 2 && (
                          <div className="mt-4 bg-emerald-500/20 text-emerald-400 text-[10px] p-1 rounded border-l-2 border-emerald-500 truncate">
                             09:00 - Interview
                          </div>
                       )}
                       {i === 8 && (
                          <div className="mt-2 bg-dgm-gold/20 text-dgm-gold text-[10px] p-1 rounded border-l-2 border-dgm-gold truncate">
                             14:30 - Biometrics
                          </div>
                       )}
                    </div>
                 ))}
              </div>
           </div>

           {/* Live Queue Sidebar */}
           <div className="w-80 bg-black/20 border border-white/10 rounded-2xl p-6 flex flex-col">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                 <Users className="text-dgm-gold" size={18} /> Live Queue
              </h3>
              
              <div className="bg-dgm-gold/10 border border-dgm-gold/20 rounded-xl p-4 mb-4 text-center">
                 <p className="text-xs text-dgm-gold uppercase tracking-wider mb-1">Estimated Wait</p>
                 <p className="text-3xl font-black text-white">12 <span className="text-sm font-normal text-white/50">min</span></p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                 {[
                    { name: 'K. Mwanba', status: 'IN_PROGRESS', time: '09:45' },
                    { name: 'S. Johnson', status: 'WAITING', time: '10:00' },
                    { name: 'L. Chen', status: 'WAITING', time: '10:15' },
                    { name: 'P. Dubois', status: 'WAITING', time: '10:30' },
                 ].map((person, i) => (
                    <div key={i} className={`p-3 rounded-xl border flex justify-between items-center ${
                       person.status === 'IN_PROGRESS' 
                          ? 'bg-dgm-gold/5 border-dgm-gold/30' 
                          : 'bg-white/5 border-white/5'
                    }`}>
                       <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${person.status === 'IN_PROGRESS' ? 'bg-dgm-gold animate-pulse' : 'bg-white/20'}`} />
                          <div>
                             <p className={`text-sm font-bold ${person.status === 'IN_PROGRESS' ? 'text-white' : 'text-white/60'}`}>{person.name}</p>
                             <p className="text-[10px] text-white/30">Visa Collection</p>
                          </div>
                       </div>
                       <span className="text-xs font-mono text-white/40">{person.time}</span>
                    </div>
                 ))}
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                 <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg border border-white/10">
                    Manage Queue
                 </button>
              </div>
           </div>
        </div>
     );
  };

  const DigitalVisaIssuance = () => {
     return (
        <div className="h-full flex flex-col items-center justify-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)] pointer-events-none" />
           
           <motion.div 
             initial={{ rotateY: 90, opacity: 0 }}
             animate={{ rotateY: 0, opacity: 1 }}
             transition={{ type: 'spring', stiffness: 100, damping: 20 }}
             className="w-full max-w-md bg-gradient-to-br from-white/10 to-black border border-white/20 rounded-3xl p-8 backdrop-blur-xl relative shadow-2xl"
           >
              {/* Holographic Effect Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_40%,rgba(255,255,255,0.1)_45%,rgba(255,255,255,0.05)_50%,transparent_60%)] rounded-3xl pointer-events-none" />

              <div className="flex justify-between items-start mb-6">
                 <div>
                    <h2 className="text-sm font-bold text-white/60 uppercase tracking-widest">Digital E-Visa</h2>
                    <p className="text-xs text-dgm-gold font-bold">REPUBLIC OF CONGO</p>
                 </div>
                 <ShieldCheck className="text-emerald-400" size={32} />
              </div>

              <div className="flex gap-6 mb-8">
                 <div className="w-24 h-24 bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover grayscale opacity-80" alt="Profile" />
                 </div>
                 <div className="space-y-1">
                    <p className="text-xs text-white/40 uppercase">Visa Number</p>
                    <p className="text-lg font-mono text-white tracking-widest">COD-2024-8821</p>
                    <div className="h-2" />
                    <p className="text-xs text-white/40 uppercase">Valid Until</p>
                    <p className="text-sm font-bold text-white">12 OCT 2024</p>
                 </div>
              </div>

              <div className="bg-white p-4 rounded-xl mb-6 flex items-center justify-between">
                 <QrCode className="text-black" size={80} />
                 <div className="text-right">
                    <p className="text-[10px] text-black/60 uppercase font-bold mb-1">Cryptographic Signature</p>
                    <p className="text-[8px] text-black/40 font-mono break-all max-w-[120px]">
                       8f92a3b4c5d6e7f8901234567890abcdef123456
                    </p>
                 </div>
              </div>

              <div className="flex items-center gap-2 justify-center text-xs text-emerald-400 bg-emerald-500/10 py-2 rounded-lg border border-emerald-500/20">
                 <Link size={12} /> Blockchain Verified (DGM-Chain)
              </div>
           </motion.div>

           <div className="mt-8 flex gap-4">
              <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl text-white font-bold flex items-center gap-2">
                 <ArrowRight size={18} /> Send to Applicant Email
              </button>
              <button className="px-6 py-3 bg-dgm-gold hover:bg-white text-dgm-blue font-bold rounded-xl shadow-lg flex items-center gap-2">
                 <RefreshCw size={18} /> Issue New Visa
              </button>
           </div>
        </div>
     );
  };

  return (
    <div className="h-full bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 overflow-hidden flex flex-col">
       {/* Header Tabs */}
       <div className="flex justify-between items-center mb-6">
          <div>
             <h1 className="text-2xl font-bold text-white">Chancellerie & Visas</h1>
             <p className="text-white/60 text-sm">Issuance, Appointments & Digital Services</p>
          </div>
          <div className="bg-black/20 p-1 rounded-xl flex gap-1 border border-white/10">
             <button 
                onClick={() => setActiveTab('APPLICATION')}
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'APPLICATION' ? 'bg-dgm-gold text-dgm-blue shadow-lg' : 'text-white/60 hover:text-white'}`}
             >
                <FileCheck size={16} /> Applications
             </button>
             <button 
                onClick={() => setActiveTab('APPOINTMENTS')}
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'APPOINTMENTS' ? 'bg-dgm-gold text-dgm-blue shadow-lg' : 'text-white/60 hover:text-white'}`}
             >
                <CalendarCheck size={16} /> Appointments
             </button>
             <button 
                onClick={() => setActiveTab('ISSUANCE')}
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'ISSUANCE' ? 'bg-dgm-gold text-dgm-blue shadow-lg' : 'text-white/60 hover:text-white'}`}
             >
                <CreditCard size={16} /> Issuance
             </button>
          </div>
       </div>

       {/* Main Content Area */}
       <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
             <motion.div 
               key={activeTab}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.2 }}
               className="h-full"
             >
                {activeTab === 'APPLICATION' && <VisaApplicationWizard />}
                {activeTab === 'APPOINTMENTS' && <AppointmentSystem />}
                {activeTab === 'ISSUANCE' && <DigitalVisaIssuance />}
             </motion.div>
          </AnimatePresence>
       </div>
    </div>
  );
};

export default VisaServices;