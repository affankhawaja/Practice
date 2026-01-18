
import React, { useState } from 'react';
import { User } from '../types';
import { api } from '../api';
import { 
  Activity, 
  Mail, 
  Lock, 
  User as UserIcon, 
  ArrowRight,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Zap,
  Globe,
  Cpu,
  Layers,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

interface AuthProps {
  onAuthSuccess: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student' as 'admin' | 'student'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const user = await api.login(formData.email, formData.password);
        onAuthSuccess(user);
      } else {
        const user = await api.signup({
          name: formData.name,
          email: formData.email,
          role: 'student'
        });
        onAuthSuccess(user);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col lg:flex-row overflow-hidden font-sans">
      {/* Informative Content Panel (Left/Top on mobile) */}
      <div className="lg:w-1/2 p-8 md:p-12 lg:p-20 flex flex-col justify-center relative bg-white lg:bg-transparent overflow-hidden">
        {/* Decorative Background for Desktop */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30 pointer-events-none hidden lg:block">
           <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-100/50 rounded-full blur-[120px]"></div>
           <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-50/50 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-2xl mx-auto lg:mx-0 space-y-12 relative z-10">
          <div className="flex items-center gap-4 animate-fade-in-up">
            <div className="bg-slate-950 p-3 rounded-2xl text-white shadow-2xl shadow-slate-950/20">
              <Activity size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-950 tracking-tighter">STELLECLOUD</h1>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Precision DevOps Engine</span>
            </div>
          </div>

          <div className="space-y-6 animate-fade-in-up stagger-1">
            <h2 className="text-4xl md:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.1]">
              Engineer Your Path <br /> to <span className="gradient-text">Senior DevOps.</span>
            </h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-lg">
              The only platform featuring production-grade infrastructure mirrors, real-time telemetry labs, and automated orchestration curricula.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in-up stagger-2">
            {[
              { icon: <ShieldCheck className="text-blue-600" />, title: 'Production Labs', desc: 'Deploy on live AWS/EKS nodes.' },
              { icon: <Zap className="text-blue-600" />, title: 'Instant Eval', desc: 'Real-time IaC policy feedback.' },
              { icon: <Layers className="text-blue-600" />, title: 'Microservices', desc: 'Master full-stack orchestration.' },
              { icon: <Globe className="text-blue-600" />, title: 'Global Bench', desc: 'Compare metrics with senior peers.' }
            ].map((feature, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-3xl hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-950 mb-1">{feature.title}</h4>
                  <p className="text-xs text-slate-500 font-medium leading-snug">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-100 animate-fade-in-up stagger-3 flex flex-wrap gap-8 items-center">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+50}`} className="w-10 h-10 rounded-full border-4 border-[#fcfcfd] shadow-sm" alt="Student" />
              ))}
            </div>
            <div>
              <p className="text-sm font-black text-slate-950 tracking-tight leading-none mb-1">Join 12,000+ Engineers</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active nodes in 42 regions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Form Side */}
      <div className="lg:w-1/2 p-6 md:p-12 lg:p-20 flex items-center justify-center bg-slate-50 lg:bg-[#fcfcfd]">
        <div className="max-w-md w-full animate-fade-in-up stagger-2">
          <div className="bg-white border border-slate-200 rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50 relative overflow-hidden group/form">
            {/* Visual Flair */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] -z-10 group-hover/form:scale-110 transition-transform"></div>
            
            <div className="text-center mb-10">
              <h3 className="text-2xl font-black text-slate-950 tracking-tight">
                {isLogin ? 'Access Portal' : 'Register Candidate'}
              </h3>
              <p className="text-sm text-slate-400 font-bold mt-2 uppercase tracking-widest text-[10px]">
                {isLogin ? 'Enter credentials to authorize' : 'Initialize your learning path'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Identity</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/40 focus:bg-white transition-all font-bold text-slate-950 shadow-inner"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Transmission Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/40 focus:bg-white transition-all font-bold text-slate-950 shadow-inner"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Passcode</label>
                   {isLogin && <button type="button" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 transition-colors">Recover</button>}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input
                    required
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/40 focus:bg-white transition-all font-bold text-slate-950 shadow-inner"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                disabled={isLoading}
                className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-slate-950/20 disabled:opacity-70 disabled:cursor-not-allowed group active:scale-[0.98] shine-effect"
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    {isLogin ? 'Initialize Uplink' : 'Activate Credentials'}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-slate-100 text-center">
              <p className="text-slate-500 text-sm font-bold">
                {isLogin ? "New to the ecosystem?" : "Already verified?"}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError(null);
                  }}
                  className="text-blue-600 font-black ml-2 hover:text-blue-800 transition-colors underline decoration-2 underline-offset-4"
                >
                  {isLogin ? 'Create Account' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
          
          <div className="mt-12 space-y-8 animate-fade-in-up stagger-4">
             <div className="flex items-center gap-4 bg-white/50 border border-slate-200/50 p-4 rounded-3xl">
                <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                   <CheckCircle2 size={18} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-950 uppercase tracking-widest leading-none mb-1">Affan Khawaja</p>
                   <p className="text-[9px] font-bold text-slate-400">Lead Platform Architect verified the latest build v3.2.4</p>
                </div>
             </div>
             <p className="text-center text-[9px] font-black uppercase tracking-[0.4em] text-slate-300">
               Protected by Enterprise AES-256 Encryption
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
