import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_ITEMS, APP_NAME } from './constants';
import { AppView, User, UserRole } from './types';
import Dashboard from './components/Dashboard';
import Verification from './components/Verification';
import Intelligence from './components/Intelligence';
import Communication from './components/Communication';
import ForeignerManagement from './components/ForeignerManagement';
import VisaServices from './components/VisaServices';
import AnalyticsHub from './components/AnalyticsHub';
import OperationsCenter from './components/OperationsCenter';
import Finance from './components/Finance';
import Auth from './components/Auth';
import { LogOut, Bell, Menu, X, Camera, ShieldAlert } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profilePic, setProfilePic] = useState<string>("https://picsum.photos/id/1005/100/100");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check for session on mount
  useEffect(() => {
    const sessionUser = localStorage.getItem('dgm_nexus_user');
    if (sessionUser) {
      setCurrentUser(JSON.parse(sessionUser));
      setIsAuthenticated(true);
    }
    
    const savedPic = localStorage.getItem('dgm_nexus_profile_pic');
    if (savedPic) {
      setProfilePic(savedPic);
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('dgm_nexus_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('dgm_nexus_user');
    setCurrentView(AppView.DASHBOARD);
  };

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfilePic(base64String);
        localStorage.setItem('dgm_nexus_profile_pic', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Filter Nav Items based on Role
  const authorizedNavItems = NAV_ITEMS.filter(item => {
    if (!item.allowedRoles) return true; // Public items
    return currentUser && item.allowedRoles.includes(currentUser.role);
  });

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD: return <Dashboard />;
      case AppView.VERIFICATION: return <Verification />;
      case AppView.FOREIGNERS: return <ForeignerManagement />;
      case AppView.VISA_SERVICES: return <VisaServices />;
      case AppView.ANALYTICS: return <AnalyticsHub />;
      case AppView.OPERATIONS: return <OperationsCenter />;
      case AppView.FINANCE: return <Finance />;
      case AppView.INTELLIGENCE: return <Intelligence />;
      case AppView.COMMUNICATION: return <Communication />;
      default: return <div className="p-8 text-center text-white/50">System Configuration Module - Restricted Access</div>;
    }
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  // Determine Theme Colors based on Emergency Mode
  const isEmergency = currentUser?.isEmergencyMode;
  const mainGradient = isEmergency ? 'bg-gradient-to-br from-red-950 to-black' : 'bg-nexus-gradient';
  const sidebarColor = isEmergency ? 'bg-red-950/90 border-red-500/30' : 'bg-dgm-blue/90 border-white/10';
  const accentColor = isEmergency ? 'bg-red-600 text-white' : 'bg-dgm-gold text-dgm-blue';

  return (
    <div className={`flex h-screen w-screen ${mainGradient} text-white font-sans overflow-hidden selection:bg-dgm-gold selection:text-dgm-blue`}>
      
      {/* Emergency Overlay Banner */}
      {isEmergency && (
        <div className="fixed top-0 inset-x-0 h-1 bg-red-600 z-[60] animate-pulse shadow-[0_0_20px_rgba(220,38,38,0.8)]" />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 ${sidebarColor} backdrop-blur-xl border-r transform transition-transform duration-300 ease-out
        md:relative md:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-white/10 flex justify-between items-center relative overflow-hidden">
          {isEmergency && <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none" />}
          <div>
            <h1 className="text-2xl font-black text-white tracking-tighter">{APP_NAME}</h1>
            <p className={`text-[10px] uppercase tracking-[0.2em] ${isEmergency ? 'text-red-400 font-bold' : 'text-dgm-gold'}`}>
              {isEmergency ? 'EMERGENCY MODE' : 'Migration Control'}
            </p>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-white/60">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2 mt-4">
          {authorizedNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id as AppView);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                currentView === item.id 
                  ? `${accentColor} shadow-lg` 
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon size={20} className={currentView === item.id ? 'animate-bounce-subtle' : ''} />
              <span className="font-semibold tracking-wide text-sm">{item.label}</span>
              {currentView === item.id && (
                <motion.div 
                  layoutId="active-pill"
                  className={`absolute right-2 w-1.5 h-1.5 rounded-full ${isEmergency ? 'bg-white' : 'bg-dgm-blue'}`}
                />
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="relative group cursor-pointer" 
              onClick={() => fileInputRef.current?.click()}
              title="Click to change profile picture"
            >
              <img 
                src={profilePic} 
                className={`w-10 h-10 rounded-full border-2 ${isEmergency ? 'border-red-500' : 'border-dgm-gold'} object-cover`}
                alt="Profile" 
              />
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Camera size={16} className="text-white" />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleProfileUpload} 
                className="hidden" 
                accept="image/*"
              />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{currentUser?.name}</p>
              <p className="text-xs text-white/50 truncate">{currentUser?.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-medium"
          >
            <LogOut size={16} /> Secure Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Top Mobile Bar */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-white/5 backdrop-blur-sm md:hidden">
          <button onClick={() => setMobileMenuOpen(true)} className="text-white">
            <Menu />
          </button>
          <span className="font-bold text-dgm-gold">{APP_NAME}</span>
          <div className="w-8" />
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-8 overflow-hidden relative">
          {/* Background Decorative Elements */}
          <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${isEmergency ? 'bg-red-600' : 'bg-dgm-blue'} rounded-full filter blur-[100px] opacity-30 pointer-events-none translate-x-1/2 -translate-y-1/2 transition-colors duration-500`} />
          <div className={`absolute bottom-0 left-0 w-[300px] h-[300px] ${isEmergency ? 'bg-orange-500' : 'bg-dgm-gold'} rounded-full filter blur-[80px] opacity-10 pointer-events-none -translate-x-1/2 translate-y-1/2 transition-colors duration-500`} />

          {/* View Render */}
          <AnimatePresence mode="wait">
             <motion.div 
                key={currentView}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="h-full z-10 relative"
             >
               {renderView()}
             </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Floating Action / Notification */}
      <div className="fixed top-6 right-6 hidden md:flex items-center gap-4 z-50">
        {isEmergency && (
          <div className="bg-red-600 text-white px-4 py-1.5 rounded-full text-xs font-bold animate-pulse flex items-center gap-2 shadow-lg shadow-red-600/40">
            <ShieldAlert size={14} /> AUDIT LOG ACTIVE
          </div>
        )}
        <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-black" />
        </button>
      </div>
    </div>
  );
};

export default App;