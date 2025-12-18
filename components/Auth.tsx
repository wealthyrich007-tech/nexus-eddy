import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, ScanFace, Smartphone, AlertTriangle, Fingerprint, ChevronRight, UserCheck, Eye, UserPlus, Database, Check, RefreshCw, ArrowLeft } from 'lucide-react';
import { User, UserRole } from '../types';
import { APP_NAME } from '../constants';

interface AuthProps {
  onLogin: (user: User) => void;
}

const MOCK_USERS: Record<string, User> = {
  'DGM-DG': { id: 'DGM-DG', name: 'Gen. K. Mutombo', role: UserRole.DIRECTOR_GENERAL, clearanceLevel: 5, location: 'HQ - Kinshasa' },
  'DGM-ZC': { id: 'DGM-ZC', name: 'Cmdr. A. Bakali', role: UserRole.ZONE_COMMANDER, clearanceLevel: 4, location: 'Zone East - Goma' },
  'DGM-SI': { id: 'DGM-SI', name: 'Insp. M. Kasongo', role: UserRole.SENIOR_INSPECTOR, clearanceLevel: 3, location: 'N\'Djili Airport' },
  'DGM-BA': { id: 'DGM-BA', name: 'Officer J. Mobutu', role: UserRole.BORDER_AGENT, clearanceLevel: 2, location: 'Poste Ruzizi II' },
  'DGM-IO': { id: 'DGM-IO', name: 'Lt. S. Bemba', role: UserRole.INTELLIGENCE_OFFICER, clearanceLevel: 4, location: 'Intel Unit A' },
  'DGM-SA': { id: 'DGM-SA', name: 'SysAdmin Root', role: UserRole.SYSTEM_ADMIN, clearanceLevel: 5, location: 'Server Room' },
};

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [step, setStep] = useState<'IDENTITY' | 'BIOMETRIC' | 'MFA' | 'EMERGENCY'>('IDENTITY');
  
  // Login Inputs
  const [badgeId, setBadgeId] = useState('');

  // Registration Inputs
  const [regName, setRegName] = useState('');
  const [regBadge, setRegBadge] = useState('');
  const [regRole, setRegRole] = useState<UserRole>(UserRole.BORDER_AGENT);
  const [regLocation, setRegLocation] = useState('');

  // Shared State
  const [mfaCode, setMfaCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [tempUser, setTempUser] = useState<User | null>(null);
  const [deviceHash, setDeviceHash] = useState('');
  const [hasBiometrics, setHasBiometrics] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Generate Device Fingerprint
  useEffect(() => {
    const ua = navigator.userAgent;
    const screen = `${window.screen.width}x${window.screen.height}`;
    const hash = btoa(`${ua}-${screen}`).substring(0, 16);
    setDeviceHash(hash);
  }, []);

  // Check for Platform Authenticator (FaceID/TouchID)
  useEffect(() => {
    if (window.PublicKeyCredential) {
      window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        .then(setHasBiometrics)
        .catch(err => console.error("WebAuthn check failed", err));
    }
  }, []);

  // Initialize camera for biometric step (visual effect)
  useEffect(() => {
    if (step === 'BIOMETRIC') {
      startCamera();
    } else {
      stopCamera();
    }
  }, [step]);

  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (e) {
      console.warn("Auth camera visualizer failed", e);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(t => t.stop());
    }
  };

  const getAllUsers = () => {
      const stored = localStorage.getItem('dgm_nexus_registry');
      const registered = stored ? JSON.parse(stored) : {};
      return { ...MOCK_USERS, ...registered };
  };

  const handleIdentitySubmit = () => {
    setError('');
    setIsLoading(true);
    
    // Simulate lookup delay
    setTimeout(() => {
      const users = getAllUsers();
      const user = users[badgeId.toUpperCase()];
      if (user) {
        setTempUser(user);
        setStep('BIOMETRIC');
      } else {
        setError('Invalid Badge ID. Access Denied.');
      }
      setIsLoading(false);
    }, 800);
  };

  const handleRegisterSubmit = () => {
      setError('');
      if (!regName || !regBadge || !regLocation) {
          setError('All fields are required for enrollment.');
          return;
      }
      
      const users = getAllUsers();
      if (users[regBadge.toUpperCase()]) {
          setError('Badge ID already registered in system.');
          return;
      }

      setIsLoading(true);
      
      // Simulate account creation delay
      setTimeout(() => {
          const newUser: User = {
              id: regBadge.toUpperCase(),
              name: regName,
              role: regRole,
              location: regLocation,
              clearanceLevel: 1 
          };
          
          setTempUser(newUser);
          setIsLoading(false);
          setStep('BIOMETRIC'); // Proceed to enrollment
      }, 1000);
  };

  const finalizeRegistration = () => {
      if (tempUser) {
          const stored = localStorage.getItem('dgm_nexus_registry');
          const registered = stored ? JSON.parse(stored) : {};
          registered[tempUser.id] = tempUser;
          localStorage.setItem('dgm_nexus_registry', JSON.stringify(registered));
          onLogin(tempUser);
      }
  };

  const handleBiometricScan = async () => {
    setIsLoading(true);
    setError('');

    // REGISTRATION FLOW: Simulate Enrollment
    if (authMode === 'REGISTER') {
        setTimeout(() => {
            setIsLoading(false);
            finalizeRegistration();
        }, 2000);
        return;
    }

    // LOGIN FLOW: Try Platform Authenticator
    if (hasBiometrics && window.PublicKeyCredential) {
      try {
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);

        const credential = await navigator.credentials.get({
          publicKey: {
            challenge,
            rpId: window.location.hostname === 'localhost' ? 'localhost' : undefined,
            userVerification: 'required', 
            timeout: 60000,
          }
        });

        if (credential) {
          setIsLoading(false);
          setStep('MFA');
          return;
        }
      } catch (e: any) {
        console.warn("Biometric auth failed or cancelled:", e);
        if (e.name === 'NotAllowedError') {
          setError("Biometric authentication was cancelled.");
          setIsLoading(false);
          return;
        }
      }
    }

    // 2. Fallback Simulation (Visual Scanning Effect)
    setTimeout(() => {
      setIsLoading(false);
      setStep('MFA');
    }, 2000);
  };

  const handleMfaSubmit = () => {
    if (mfaCode.length < 4) {
      setError('Invalid Token Code');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      if (tempUser) {
        onLogin(tempUser);
      }
    }, 1000);
  };

  const handleEmergencyAccess = () => {
    const emergencyUser: User = {
      id: 'EMERGENCY-001',
      name: 'EMERGENCY OVERRIDE',
      role: UserRole.DIRECTOR_GENERAL,
      clearanceLevel: 5,
      location: 'UNKNOWN',
      isEmergencyMode: true
    };
    onLogin(emergencyUser);
  };

  const switchMode = (mode: 'LOGIN' | 'REGISTER') => {
      setAuthMode(mode);
      setStep('IDENTITY');
      setError('');
      setTempUser(null);
  };

  return (
    <div className="min-h-screen w-full bg-nexus-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Tech Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full animate-[spin_60s_linear_infinite]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-dgm-gold/5 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,#0f172a_100%)]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-8 border-b border-white/10 text-center shrink-0">
          <div className="w-16 h-16 bg-dgm-gold/10 rounded-2xl mx-auto flex items-center justify-center mb-4 border border-dgm-gold/30">
            <Shield size={32} className="text-dgm-gold" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">{APP_NAME}</h1>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40 mt-1">
              {authMode === 'LOGIN' ? 'Secure Access Gateway' : 'Officer Enrollment Protocol'}
          </p>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: IDENTITY (LOGIN OR REGISTER) */}
            {step === 'IDENTITY' && (
              <motion.div 
                key={authMode}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {authMode === 'LOGIN' ? (
                    // LOGIN FORM
                    <>
                        <div className="space-y-2">
                        <label className="text-xs font-bold text-dgm-gold uppercase tracking-wider">Badge Identification</label>
                        <div className="relative">
                            <UserCheck className="absolute left-4 top-3.5 text-white/30" size={20} />
                            <input 
                            type="text" 
                            value={badgeId}
                            onChange={(e) => setBadgeId(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleIdentitySubmit()}
                            placeholder="Enter DGM-ID (e.g., DGM-BA)"
                            className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-dgm-gold/50 transition-colors font-mono"
                            autoFocus
                            />
                        </div>
                        </div>

                        {error && <p className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">{error}</p>}

                        <button 
                        onClick={handleIdentitySubmit}
                        disabled={!badgeId || isLoading}
                        className="w-full bg-dgm-blue hover:bg-white/10 border border-dgm-gold/30 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group"
                        >
                        {isLoading ? 'Verifying Identity...' : 'Proceed to Biometrics'}
                        {!isLoading && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                        
                        <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                             <button 
                                onClick={() => switchMode('REGISTER')}
                                className="text-xs text-dgm-gold hover:text-white transition-colors flex items-center gap-1"
                             >
                                <UserPlus size={12} /> New Officer Enrollment
                             </button>
                             <button 
                                onClick={() => setStep('EMERGENCY')}
                                className="text-xs text-red-500/60 hover:text-red-400 flex items-center gap-1 transition-colors"
                             >
                                <AlertTriangle size={12} /> Emergency
                             </button>
                        </div>
                        
                        <div className="mt-4 text-[10px] text-center text-white/20 font-mono">
                            DEVICE FINGERPRINT: {deviceHash}
                        </div>
                    </>
                ) : (
                    // REGISTER FORM
                    <>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Full Name</label>
                                <input 
                                    type="text" 
                                    value={regName}
                                    onChange={(e) => setRegName(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-white text-sm focus:border-dgm-gold/50 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Badge ID (Unique)</label>
                                <input 
                                    type="text" 
                                    value={regBadge}
                                    onChange={(e) => setRegBadge(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-white text-sm focus:border-dgm-gold/50 outline-none font-mono uppercase"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Assigned Role</label>
                                <select 
                                    value={regRole}
                                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-white text-sm focus:border-dgm-gold/50 outline-none"
                                >
                                    {Object.values(UserRole).map(role => (
                                        <option key={role} value={role} className="bg-gray-900 text-white">{role.replace(/_/g, ' ')}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Station / Location</label>
                                <input 
                                    type="text" 
                                    value={regLocation}
                                    onChange={(e) => setRegLocation(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-white text-sm focus:border-dgm-gold/50 outline-none"
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">{error}</p>}

                        <button 
                            onClick={handleRegisterSubmit}
                            disabled={isLoading}
                            className="w-full bg-dgm-gold hover:bg-white text-dgm-blue font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            {isLoading ? 'Creating Profile...' : 'Initiate Enrollment'}
                        </button>
                        
                        <div className="pt-4 border-t border-white/5 text-center">
                             <button 
                                onClick={() => switchMode('LOGIN')}
                                className="text-xs text-white/40 hover:text-white transition-colors flex items-center justify-center gap-1 mx-auto"
                             >
                                <ArrowLeft size={12} /> Return to Login
                             </button>
                        </div>
                    </>
                )}
              </motion.div>
            )}

            {/* STEP 2: BIOMETRICS (SHARED UI) */}
            {step === 'BIOMETRIC' && (
              <motion.div 
                key="biometric"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 text-center"
              >
                 <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-dgm-gold/20">
                    <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ScanFace size={64} className={`text-dgm-gold ${isLoading ? 'animate-pulse' : ''}`} />
                    </div>
                    {isLoading && (
                      <div className="absolute inset-0 bg-dgm-gold/10 animate-[pulse_1s_infinite]" />
                    )}
                 </div>

                 <div>
                   <h3 className="text-white font-bold text-lg mb-1">{tempUser?.name}</h3>
                   <p className="text-white/50 text-sm">{tempUser?.role}</p>
                 </div>

                 <div className="text-xs font-mono text-emerald-400">
                    {isLoading 
                        ? (authMode === 'REGISTER' ? 'ENROLLING BIOMETRIC PROFILE...' : 'ANALYZING BIOMETRIC DATA...')
                        : (authMode === 'REGISTER' ? 'READY FOR CAPTURE' : (hasBiometrics ? 'HARDWARE AUTH DETECTED' : 'FACIAL ANALYSIS READY'))}
                 </div>
                 
                 {error && <p className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg">{error}</p>}

                 {!isLoading && (
                   <button 
                     onClick={handleBiometricScan}
                     className="w-full bg-dgm-gold text-dgm-blue font-bold py-3 rounded-xl shadow-lg shadow-dgm-gold/20 hover:bg-white transition-colors flex items-center justify-center gap-2"
                   >
                     {authMode === 'REGISTER' ? <Database size={20} /> : (hasBiometrics ? <Fingerprint size={20} /> : <ScanFace size={20} />)}
                     {authMode === 'REGISTER' ? 'Complete Enrollment' : (hasBiometrics ? 'Use Face ID / Touch ID' : 'Authenticate')}
                   </button>
                 )}
              </motion.div>
            )}

            {/* STEP 3: MFA (LOGIN ONLY) */}
            {step === 'MFA' && (
              <motion.div 
                key="mfa"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl mx-auto flex items-center justify-center mb-4 text-dgm-gold">
                    <Smartphone size={32} />
                  </div>
                  <h3 className="text-white font-bold">Hardware Token Required</h3>
                  <p className="text-white/40 text-sm mt-2">Please enter the 6-digit code from your RSA SecurID token.</p>
                </div>

                <input 
                  type="text" 
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/\D/g,'').slice(0,6))}
                  placeholder="000 000"
                  className="w-full bg-black/40 border border-white/20 rounded-xl py-4 text-center text-2xl tracking-[0.5em] text-white font-mono focus:outline-none focus:border-dgm-gold transition-colors"
                />

                {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                <button 
                  onClick={handleMfaSubmit}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
                >
                  {isLoading ? 'Verifying Token...' : 'Complete Login'}
                </button>
              </motion.div>
            )}

            {/* EMERGENCY MODE */}
            {step === 'EMERGENCY' && (
              <motion.div 
                key="emergency"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-start gap-4">
                  <AlertTriangle className="text-red-500 shrink-0" size={24} />
                  <div>
                    <h3 className="text-red-400 font-bold text-sm uppercase">Protocol Override</h3>
                    <p className="text-white/60 text-xs mt-1">
                      This action will bypass standard authentication. All actions will be logged with HIGH PRIORITY and sent to the Internal Audit Committee immediately.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-red-400 uppercase">Reason for Bypass</label>
                  <textarea 
                    className="w-full bg-black/40 border border-red-500/30 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-red-500 transition-colors h-24 resize-none"
                    placeholder="Describe the emergency..."
                  ></textarea>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setStep('IDENTITY')}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleEmergencyAccess}
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-red-600/20"
                  >
                    Grant Access
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;