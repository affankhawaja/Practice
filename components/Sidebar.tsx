
import React from 'react';
import { NAV_ITEMS } from '../constants';
import { Activity, LogOut, ChevronRight, Zap, X } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
  userRole: 'admin' | 'student';
  onLogout: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  userRole, 
  onLogout,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const filteredNav = NAV_ITEMS.filter(item => item.roles.includes(userRole) || item.roles.length === 0);

  return (
    <aside className={`
      w-72 border-r border-slate-200/50 h-screen sticky top-0 flex flex-col z-50 bg-white transition-transform duration-300 lg:translate-x-0
      ${isMobileOpen ? 'translate-x-0 fixed inset-y-0 left-0' : '-translate-x-full fixed inset-y-0 left-0 lg:static'}
    `}>
      <div className="p-8 pb-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="bg-slate-950 p-2.5 rounded-2xl text-white shadow-2xl shadow-slate-950/20">
              <Activity size={22} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h1 className="font-extrabold text-slate-950 text-xl tracking-tighter">STELLE</h1>
            <div className="flex items-center gap-1.5 opacity-50">
               <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
               <span className="text-[9px] font-black uppercase tracking-[0.2em]">v3.2</span>
            </div>
          </div>
        </div>
        
        {isMobileOpen && (
          <button 
            onClick={onCloseMobile}
            className="p-2 text-slate-400 hover:text-slate-950 lg:hidden"
          >
            <X size={20} />
          </button>
        )}
      </div>
      
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        {filteredNav.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3.5 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 group relative ${
              activeTab === item.id 
                ? 'bg-slate-950 text-white shadow-2xl shadow-slate-900/10' 
                : 'text-slate-500 hover:text-slate-950 hover:bg-slate-50'
            }`}
          >
            <span className={`transition-colors duration-300 ${activeTab === item.id ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-950'}`}>
              {item.icon}
            </span>
            <span className="flex-1 text-left tracking-tight">{item.label}</span>
            {activeTab === item.id && (
              <div className="absolute right-4 animate-in fade-in slide-in-from-right-1">
                <ChevronRight size={14} className="opacity-40" />
              </div>
            )}
          </button>
        ))}
      </nav>

      <div className="p-6 space-y-4">
        <div className="bg-slate-50/50 backdrop-blur-xl border border-slate-100 p-5 rounded-[2rem] shadow-sm">
           <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner shrink-0">
                 <Zap size={16} />
              </div>
              <div className="flex-1">
                 <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest leading-none mb-1">Latency</p>
                 <p className="text-xs font-bold text-slate-950">12ms <span className="text-emerald-500 font-black">Stable</span></p>
              </div>
           </div>
           <button 
             onClick={onLogout}
             className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all border border-slate-200/50 hover:border-rose-100 uppercase tracking-widest"
           >
             <LogOut size={14} />
             Log Out
           </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
