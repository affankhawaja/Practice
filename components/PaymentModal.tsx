
import React, { useState } from 'react';
import { Course } from '../types';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  ArrowRight,
  ChevronRight,
  Building2,
  Smartphone,
  Copy,
  Check
} from 'lucide-react';

interface PaymentModalProps {
  course: Course;
  onClose: () => void;
  onSuccess: (courseId: string) => void;
}

type PaymentMethod = 'bank' | 'wallet';

const PaymentModal: React.FC<PaymentModalProps> = ({ course, onClose, onSuccess }) => {
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  const [method, setMethod] = useState<PaymentMethod>('bank');
  const [copied, setCopied] = useState<string | null>(null);
  
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    
    // Simulate payment gateway delay
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess(course.id);
      }, 1500);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={step !== 'processing' ? onClose : undefined}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
        
        {step === 'details' && (
          <>
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-slate-950 p-2 rounded-xl text-white">
                  <ShieldCheck size={18} />
                </div>
                <h3 className="font-black text-slate-950 uppercase tracking-widest text-xs">Payment Gateway</h3>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-950 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Order Summary */}
              <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={course.thumbnail} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="" />
                  <div>
                    <p className="font-black text-slate-950 text-sm tracking-tight">{course.title}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Enrolling for ${course.price}</p>
                  </div>
                </div>
              </div>

              {/* Method Selector */}
              <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
                <button 
                  type="button"
                  onClick={() => setMethod('bank')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${method === 'bank' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <Building2 size={14} /> Bank Transfer
                </button>
                <button 
                  type="button"
                  onClick={() => setMethod('wallet')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${method === 'wallet' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <Smartphone size={14} /> Mobile Wallets
                </button>
              </div>

              <form onSubmit={handlePayment} className="space-y-6">
                {method === 'bank' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="bg-slate-950 text-white p-6 rounded-3xl space-y-4 shadow-xl">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Stelle Cloud Bank</p>
                          <p className="text-sm font-black mt-1">Institutional Account</p>
                        </div>
                        <Building2 size={24} className="text-slate-700" />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5 group">
                           <div className="min-w-0">
                             <p className="text-[8px] font-black uppercase text-slate-500">Account Number</p>
                             <p className="text-xs font-mono font-bold truncate">PK89 STEL 0000 0123 4567 8910</p>
                           </div>
                           <button 
                             type="button" 
                             onClick={() => handleCopy('PK89 STEL 0000 0123 4567 8910', 'bank_acc')}
                             className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                           >
                             {copied === 'bank_acc' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-slate-500" />}
                           </button>
                        </div>
                        <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                           <div>
                             <p className="text-[8px] font-black uppercase text-slate-500">Beneficiary</p>
                             <p className="text-xs font-bold">StelleCloud Training Ops</p>
                           </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold text-center leading-relaxed px-4">
                      Please transfer the exact amount and click "Confirm" below to initiate verification.
                    </p>
                  </div>
                )}

                {method === 'wallet' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-3xl relative group">
                        <div className="flex items-center gap-3 mb-4">
                           <div className="w-8 h-8 bg-emerald-500 text-white rounded-lg flex items-center justify-center shrink-0">
                              <Smartphone size={16} />
                           </div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-emerald-900">EasyPaisa</p>
                        </div>
                        <p className="text-sm font-black text-slate-900 mb-1">0300 1234567</p>
                        <p className="text-[9px] font-bold text-emerald-600/60">Verified Business Account</p>
                        <button 
                          type="button"
                          onClick={() => handleCopy('0300 1234567', 'wallet_ep')}
                          className="absolute top-4 right-4 p-2 bg-white rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {copied === 'wallet_ep' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} className="text-slate-400" />}
                        </button>
                      </div>

                      <div className="bg-rose-50 border border-rose-100 p-5 rounded-3xl relative group">
                        <div className="flex items-center gap-3 mb-4">
                           <div className="w-8 h-8 bg-rose-600 text-white rounded-lg flex items-center justify-center shrink-0">
                              <Smartphone size={16} />
                           </div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-rose-900">JazzCash</p>
                        </div>
                        <p className="text-sm font-black text-slate-900 mb-1">0345 7654321</p>
                        <p className="text-[9px] font-bold text-rose-600/60">Verified Business Account</p>
                        <button 
                          type="button"
                          onClick={() => handleCopy('0345 7654321', 'wallet_jc')}
                          className="absolute top-4 right-4 p-2 bg-white rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {copied === 'wallet_jc' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} className="text-slate-400" />}
                        </button>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold text-center leading-relaxed">
                      Send to either wallet and confirm below.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-slate-950 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-600 transition-all shadow-2xl shadow-slate-950/20 active:scale-95 flex items-center justify-center gap-3 shine-effect"
                >
                  Confirm Transfer • ${course.price}
                  <ArrowRight size={18} />
                </button>
              </form>

              <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Lock size={12} className="text-emerald-500" />
                End-to-End Cryptographic Security
              </div>
            </div>
          </>
        )}

        {step === 'processing' && (
          <div className="p-20 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-slate-100 rounded-full" />
              <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-blue-600">
                <ShieldCheck size={32} />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-black text-slate-950 tracking-tighter">Verifying Funds</h3>
              <p className="text-sm font-medium text-slate-500 max-w-xs mx-auto">Cross-referencing blockchain ledger for transaction hash...</p>
            </div>
            <div className="flex gap-1.5">
               <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
               <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
               <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce"></div>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="p-20 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 animate-bounce">
              <CheckCircle2 size={48} />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-black text-slate-950 tracking-tighter">Access Authorized</h3>
              <p className="text-sm font-medium text-slate-500">Curriculum nodes initialized successfully.</p>
            </div>
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-6 py-3 rounded-2xl border border-emerald-100 font-black uppercase text-[10px] tracking-widest">
               <ChevronRight size={14} className="animate-pulse" /> Launching Workspace
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PaymentModal;
