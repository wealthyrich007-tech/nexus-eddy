import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, CheckCircle, XCircle, ScanLine, ShieldCheck, Lock, AlertCircle, MonitorPlay, Keyboard, FileText, ArrowRight, QrCode, CreditCard, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MRZData {
  type: string;
  country: string;
  surname: string;
  names: string;
  passportNumber: string;
  nationality: string;
  dob: string;
  sex: string;
  expiration: string;
  personalNumber: string;
  rawLine1: string;
  rawLine2: string;
}

const Verification: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');
  const [permissionStatus, setPermissionStatus] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [errorType, setErrorType] = useState<'permission' | 'device' | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);
  const [scanMode, setScanMode] = useState<'PASSPORT' | 'QR'>('PASSPORT');
  const [manualId, setManualId] = useState('');
  const [detectedData, setDetectedData] = useState<string | null>(null);
  const [mrzData, setMrzData] = useState<MRZData | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    setIsDemoMode(false);
    setErrorType(null);
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.warn("Media Devices API not supported");
      setPermissionStatus('denied');
      setErrorType('device');
      return;
    }

    try {
      setPermissionStatus('pending');
      
      let stream: MediaStream;
      
      // Attempt 1: Try specific environment (rear) camera
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
      } catch (err) {
        console.warn("Environment camera not found, attempting fallback to any video device...", err);
        // Attempt 2: Fallback to any available video device
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: true 
        });
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setPermissionStatus('granted');
    } catch (e: any) {
      console.warn("Camera access failed completely:", e.name);
      setPermissionStatus('denied');
      if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
        setErrorType('permission');
      } else {
        setErrorType('device');
      }
    }
  };

  useEffect(() => {
    if (!isManualMode) {
      startCamera();
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isManualMode]);

  // Barcode Detection Loop
  useEffect(() => {
    let intervalId: any;

    const detectCodes = async () => {
      // @ts-ignore - BarcodeDetector is part of the Shape Detection API in Chrome/Android
      if ('BarcodeDetector' in window && videoRef.current && videoRef.current.readyState === 4 && scanMode === 'QR' && !isScanning && scanResult === 'idle' && !isManualMode) {
        try {
          // @ts-ignore
          const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
          const codes = await detector.detect(videoRef.current);
          
          if (codes.length > 0) {
            const rawValue = codes[0].rawValue;
            handleScan(rawValue);
          }
        } catch (e) {
          console.error("Barcode detection failed", e);
        }
      }
    };

    if (scanMode === 'QR' && !isManualMode) {
      intervalId = setInterval(detectCodes, 500);
    }

    return () => clearInterval(intervalId);
  }, [scanMode, isScanning, scanResult, isManualMode]);


  const handleScan = (data?: string) => {
    if (permissionStatus !== 'granted' && !isDemoMode) return;
    
    setIsScanning(true);
    setScanResult('scanning');
    setMrzData(null);
    
    // Simulate OCR/API delay
    setTimeout(() => {
      setIsScanning(false);
      setScanResult('success');
      
      if (scanMode === 'QR') {
        setDetectedData(data || 'DGM-PASS-TEMP-2024-X99');
      } else {
        // Simulate extracted MRZ data
        setDetectedData('PASSPORT DETECTED');
        setMrzData({
          type: 'P',
          country: 'COD',
          surname: 'MUKENDI',
          names: 'JEAN-LUC',
          passportNumber: 'OP1234567',
          nationality: 'CONGOLESE',
          dob: '1985-10-12',
          sex: 'M',
          expiration: '2030-01-15',
          personalNumber: '851012-001',
          rawLine1: 'P<CODMUKENDI<<JEAN<LUC<<<<<<<<<<<<<<<<<<<<<<',
          rawLine2: 'OP1234567<8COD8510125M3001158<<<<<<<<<<<<<<04'
        });
      }
    }, 2000);
  };

  const handleManualVerify = () => {
    if (!manualId.trim()) return;
    setScanResult('scanning');
    setIsManualMode(true);
    setMrzData(null);
    setTimeout(() => {
      setScanResult('success');
      setDetectedData(manualId);
    }, 1500);
  };

  const activateDemoMode = () => {
    setIsDemoMode(true);
    setPermissionStatus('granted');
  };

  const reset = () => {
    setScanResult('idle');
    setManualId('');
    setDetectedData(null);
    setMrzData(null);
  }

  const toggleManualMode = () => {
    setIsManualMode(!isManualMode);
    setScanResult('idle');
    setManualId('');
    setMrzData(null);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Border Control</h1>
          <p className="text-white/60">Biometric Verification & Document Validation</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Panel: Camera Feed OR Manual Input */}
        <div className="relative rounded-3xl overflow-hidden bg-black border-2 border-white/10 shadow-2xl group flex flex-col">
          
          <AnimatePresence mode="wait">
            {!isManualMode ? (
              <motion.div 
                key="camera"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col"
              >
                {(permissionStatus === 'granted' || isDemoMode) ? (
                  <>
                    {isDemoMode ? (
                      <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-90" alt="Demo Feed" />
                    ) : (
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted 
                        className="w-full h-full object-cover opacity-90"
                      />
                    )}
                    
                    {/* Focus Blur Overlay */}
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{
                          backdropFilter: 'blur(12px)', 
                          WebkitBackdropFilter: 'blur(12px)',
                          background: 'rgba(0,0,0,0.25)',
                          maskImage: 'radial-gradient(ellipse at center, transparent 30%, black 80%)',
                          WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 30%, black 80%)'
                      }}
                    />
                    
                    {/* HUD Overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Top Status Bar */}
                      <div className="absolute top-8 left-8 right-8 flex justify-between items-start pointer-events-auto">
                        <div className="p-2 bg-black/50 backdrop-blur-sm rounded-lg border border-white/10 flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full animate-pulse ${isDemoMode ? 'bg-amber-500' : 'bg-red-500'}`} />
                          <span className="text-xs font-mono text-white/80">
                            {isDemoMode ? 'SIMULATION' : 'LIVE CAM-01'}
                          </span>
                        </div>

                        {/* Mode Toggle */}
                        <div className="flex bg-black/50 backdrop-blur-sm rounded-lg border border-white/10 p-1">
                          <button 
                            onClick={() => setScanMode('PASSPORT')}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-colors ${scanMode === 'PASSPORT' ? 'bg-dgm-gold text-dgm-blue' : 'text-white/60 hover:text-white'}`}
                          >
                            <CreditCard size={14} /> PASSPORT
                          </button>
                          <button 
                            onClick={() => setScanMode('QR')}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-colors ${scanMode === 'QR' ? 'bg-dgm-gold text-dgm-blue' : 'text-white/60 hover:text-white'}`}
                          >
                            <QrCode size={14} /> QR CODE
                          </button>
                        </div>
                      </div>
                      
                      {/* Scanning Frame */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div 
                          layout
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          className={`border-2 border-white/20 rounded-2xl relative overflow-hidden ${
                            scanMode === 'QR' ? 'w-64 h-64' : 'w-80 h-56'
                          }`}
                        >
                          {/* Corner Markers */}
                          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-dgm-gold -mt-1 -ml-1 z-20" />
                          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-dgm-gold -mt-1 -mr-1 z-20" />
                          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-dgm-gold -mb-1 -ml-1 z-20" />
                          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-dgm-gold -mb-1 -mr-1 z-20" />
                          
                          {/* MRZ Specific Guide Line */}
                          {scanMode === 'PASSPORT' && (
                             <div className="absolute bottom-4 left-4 right-4 h-12 border-2 border-dashed border-white/30 rounded bg-white/5 flex items-center justify-center">
                                <span className="text-[10px] text-white/50 font-mono tracking-widest">ALIGN MRZ CODE</span>
                             </div>
                          )}

                          <AnimatePresence>
                            {(isScanning || scanMode === 'QR') && (
                              <>
                                {/* Scanning Grid Background */}
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.1)_1px,transparent_1px)] bg-[size:20px_20px] z-0"
                                />
                                
                                {/* Active Scan Line */}
                                <motion.div 
                                  initial={{ top: 0 }}
                                  animate={{ top: "100%" }}
                                  transition={{ 
                                    repeat: Infinity, 
                                    repeatType: "reverse", 
                                    duration: 1.5, 
                                    ease: "linear" 
                                  }}
                                  className="absolute w-full h-0.5 bg-dgm-gold shadow-[0_0_20px_rgba(212,175,55,0.8)] z-10"
                                >
                                  <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-dgm-gold/20 to-transparent" />
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </div>

                      <div className="absolute bottom-32 w-full text-center">
                          <p className="text-white/60 text-xs uppercase tracking-widest animate-pulse">
                            {scanMode === 'QR' ? 'Scanning for QR Codes...' : 'Align Passport Data Page'}
                          </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
                    {/* Background pattern for error */}
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(220,38,38,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-[gradient_15s_ease_infinite]" />
                    
                    {/* Error Content */}
                    <div className="relative z-10 max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                        <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6 border-4 ${errorType === 'permission' ? 'bg-gray-800 border-gray-700' : 'bg-red-500/10 border-red-500/30'}`}>
                          {errorType === 'permission' ? <Lock className="text-gray-400" size={32} /> : <AlertCircle className="text-red-500" size={32} />}
                        </div>
                        
                        <h3 className="text-2xl font-bold text-white mb-3">
                          {errorType === 'permission' ? 'Access Restricted' : 'Device Error'}
                        </h3>
                        
                        <div className={`p-4 rounded-xl mb-6 text-left ${errorType === 'permission' ? 'bg-gray-800/50 border border-gray-700' : 'bg-red-500/10 border border-red-500/20'}`}>
                            <p className="text-sm font-mono leading-relaxed opacity-90">
                              {errorType === 'permission' 
                                  ? 'SYSTEM_ALERT: Camera permission was denied by the user agent. Biometric scanning capabilities are disabled.'
                                  : 'HARDWARE_FAULT: Video input device not found or inaccessible. System failed to acquire video stream.'}
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                          <button 
                              onClick={startCamera}
                              className="w-full bg-white text-black hover:bg-gray-200 font-bold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                          >
                              <RefreshCw size={18} /> 
                              {errorType === 'permission' ? 'Request Access Again' : 'Retry Connection'}
                          </button>
                          
                          {errorType === 'device' && (
                              <button 
                                onClick={activateDemoMode}
                                className="w-full bg-dgm-gold/10 hover:bg-dgm-gold/20 text-dgm-gold border border-dgm-gold/30 font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                              >
                                <MonitorPlay size={18} />
                                Activate Simulation Mode
                              </button>
                          )}
                        </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="manual"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="absolute inset-0 flex flex-col bg-gradient-to-br from-gray-900 to-black p-12 items-center justify-center relative overflow-hidden"
              >
                {/* Tech Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
                
                <div className="w-full max-w-md relative z-10">
                  <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl mx-auto flex items-center justify-center mb-4 border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                      <Keyboard size={32} className="text-dgm-gold" />
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Manual Verification</h2>
                    <p className="text-white/40 text-sm mt-2">Enter travel document number for database lookup</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-dgm-gold uppercase tracking-widest pl-1">Passport / ID Number</label>
                      <div className="relative group">
                         <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FileText className="text-white/30 group-focus-within:text-dgm-gold transition-colors" size={20} />
                         </div>
                         <input 
                           type="text" 
                           value={manualId}
                           onChange={(e) => setManualId(e.target.value.toUpperCase())}
                           placeholder="COD-0000000"
                           className="w-full bg-white/5 border border-white/20 rounded-xl py-4 pl-12 pr-4 text-xl font-mono text-white placeholder-white/20 focus:outline-none focus:border-dgm-gold focus:bg-white/10 transition-all shadow-inner"
                           autoFocus
                         />
                         {manualId && (
                           <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                              <span className="text-xs text-emerald-500 font-mono flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> VALID FORMAT
                              </span>
                           </div>
                         )}
                      </div>
                    </div>

                    <button 
                      onClick={handleManualVerify}
                      disabled={!manualId}
                      className="w-full bg-dgm-gold hover:bg-white text-dgm-blue font-bold py-4 rounded-xl shadow-lg shadow-dgm-gold/10 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                    >
                      Verify Document <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Control Bar */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 pointer-events-auto z-20">
             {scanResult === 'idle' && (
                <>
                  {!isManualMode ? (
                    <>
                      <button 
                        onClick={() => handleScan()}
                        className="bg-dgm-gold hover:bg-white text-dgm-blue font-bold py-3 px-8 rounded-full shadow-lg shadow-dgm-gold/20 flex items-center gap-2 transition-all transform hover:scale-105"
                      >
                        <ScanLine size={20} /> Initiate Scan
                      </button>
                      <button 
                        onClick={toggleManualMode}
                        className="bg-black/60 backdrop-blur-md hover:bg-black/80 text-white border border-white/20 font-bold py-3 px-6 rounded-full transition-all flex items-center gap-2"
                      >
                        <Keyboard size={20} /> Manual Entry
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={toggleManualMode}
                      className="bg-black/60 backdrop-blur-md hover:bg-black/80 text-white border border-white/20 font-bold py-3 px-6 rounded-full transition-all flex items-center gap-2"
                    >
                      <Camera size={20} /> Switch to Camera
                    </button>
                  )}
                </>
             )}
          </div>
        </div>

        {/* Results Panel */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {scanResult === 'idle' && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <ShieldCheck size={40} className="text-white/30" />
                </div>
                <h3 className="text-xl font-bold text-white">Ready for Verification</h3>
                <p className="text-white/50 max-w-xs">
                  {isManualMode ? "Enter document ID manually to check against DGM databases." : "Align passport data page within the frame. Ensure MRZ zone is clear."}
                </p>
              </motion.div>
            )}

            {scanResult === 'scanning' && (
               <motion.div 
               key="scanning"
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="h-full flex flex-col items-center justify-center text-center space-y-6"
             >
               <div className="relative">
                 <div className="w-24 h-24 border-4 border-dgm-gold/30 border-t-dgm-gold rounded-full animate-spin" />
                 <div className="absolute inset-0 flex items-center justify-center text-dgm-gold font-bold text-xs">PROCESSING</div>
               </div>
               <div className="space-y-2">
                 <p className="text-sm font-mono text-emerald-400">>> {isManualMode ? 'Querying Central Database...' : (scanMode === 'QR' ? 'Decoding QR Data...' : 'OCR Extraction Active...')}</p>
                 <p className="text-sm font-mono text-emerald-400 opacity-70">>> Parsing MRZ lines...</p>
                 <p className="text-sm font-mono text-emerald-400 opacity-40">>> Verifying checksums...</p>
               </div>
             </motion.div>
            )}

            {scanResult === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="h-full flex flex-col overflow-y-auto pr-2 custom-scrollbar"
              >
                <div className="flex items-center gap-3 mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl shrink-0">
                  <CheckCircle className="text-emerald-500" />
                  <span className="font-bold text-emerald-400">CLEARANCE GRANTED</span>
                </div>

                <div className="flex gap-6 mb-6 shrink-0">
                  <div className="w-24 h-32 rounded-xl border-2 border-white/20 bg-white/5 flex items-center justify-center overflow-hidden">
                     {scanMode === 'QR' && !isManualMode ? (
                        <QrCode size={40} className="text-white/50" />
                     ) : (
                        <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" alt="Subject" className="w-full h-full object-cover" />
                     )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white uppercase">
                        {mrzData ? `${mrzData.surname}, ${mrzData.names.split('<')[0]}` : (detectedData === 'DGM-PASS-TEMP-2024-X99' ? 'TEMPORARY PASS' : 'SUBJECT ID')}
                    </h2>
                    <p className="text-dgm-gold font-mono">{mrzData?.passportNumber || detectedData}</p>
                    <p className="text-white/60 text-sm mt-2">{mrzData?.nationality || 'Democratic Republic of Congo'}</p>
                    {mrzData && (
                       <div className="mt-2 flex gap-2">
                          <span className="px-2 py-0.5 rounded bg-white/10 text-xs text-white/70 border border-white/10">{mrzData.sex}</span>
                          <span className="px-2 py-0.5 rounded bg-white/10 text-xs text-white/70 border border-white/10">{mrzData.dob}</span>
                       </div>
                    )}
                  </div>
                </div>

                {mrzData ? (
                   <div className="space-y-4 mb-4">
                      <div className="bg-black/30 rounded-xl p-4 border border-white/10 font-mono text-xs text-white/60 tracking-wider break-all leading-relaxed">
                         <p>{mrzData.rawLine1}</p>
                         <p>{mrzData.rawLine2}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-[10px] text-white/40 uppercase">Expiration</p>
                            <p className="text-white font-bold">{mrzData.expiration}</p>
                         </div>
                         <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-[10px] text-white/40 uppercase">Doc Type</p>
                            <p className="text-white font-bold">{mrzData.type === 'P' ? 'PASSPORT' : mrzData.type}</p>
                         </div>
                         <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-[10px] text-white/40 uppercase">Issuing State</p>
                            <p className="text-white font-bold">{mrzData.country}</p>
                         </div>
                         <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-[10px] text-white/40 uppercase">Personal No</p>
                            <p className="text-white font-bold">{mrzData.personalNumber}</p>
                         </div>
                      </div>
                   </div>
                ) : (
                  <div className="space-y-4">
                     <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-white/40">Visa Status</span>
                        <span className="text-white font-medium">{scanMode === 'QR' && !isManualMode ? 'Transit Visa (7 Days)' : 'Citizen'}</span>
                     </div>
                     <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-white/40">Last Entry</span>
                        <span className="text-white font-medium">12 Jan 2024 (Goma)</span>
                     </div>
                  </div>
                )}
                
                <div className="mt-auto pt-4 border-t border-white/10">
                   <div className="flex justify-between py-2 mb-4">
                      <span className="text-white/40">Risk Score</span>
                      <span className="text-emerald-400 font-medium">Low (0.02)</span>
                   </div>
                   <button onClick={reset} className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-xl text-white font-bold transition-colors flex items-center justify-center gap-2">
                     <RefreshCw size={18} /> Process Next Subject
                   </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Verification;