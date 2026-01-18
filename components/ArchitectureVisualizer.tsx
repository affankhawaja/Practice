
import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  Server, 
  Database, 
  Globe, 
  ShieldCheck, 
  Box, 
  Zap, 
  ChevronRight,
  Code,
  Layout,
  Activity
} from 'lucide-react';

const ArchitectureVisualizer: React.FC = () => {
  const [activeView, setActiveView] = useState<'infra' | 'logic'>('infra');
  const [isSimulating, setIsSimulating] = useState(false);

  const pythonSnippet = `
from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel

app = FastAPI(title="StelleCloud Engine", version="3.1.0")

class Enrollment(BaseModel):
    batch_id: str
    user_id: str

@app.post("/api/v1/enroll")
async def process_enrollment(req: Enrollment):
    """Business logic for track orchestration"""
    return {"status": "success", "id": "tx_90123"}
  `;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Architecture</h2>
          <p className="text-slate-500 font-bold">Enterprise-grade microservice orchestration on AWS EKS.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsSimulating(!isSimulating)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border ${
              isSimulating ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-white text-slate-500 border-slate-200'
            }`}
          >
            <Activity size={14} className={isSimulating ? 'animate-pulse' : ''} /> 
            {isSimulating ? 'Simulating Live Traffic' : 'Start Simulation'}
          </button>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button 
              onClick={() => setActiveView('infra')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeView === 'infra' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Layout size={16} /> Blueprint
            </button>
            <button 
              onClick={() => setActiveView('logic')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeView === 'logic' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Code size={16} /> Core Logic
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          {activeView === 'infra' ? (
            <div className="bg-white border border-slate-200 rounded-[3rem] p-12 relative overflow-hidden shadow-sm h-[600px] flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-16">
                {/* Client Layer */}
                <div className="flex flex-col items-center text-center gap-4 relative">
                  <div className="w-24 h-24 bg-white border border-slate-200 rounded-[2rem] shadow-xl flex items-center justify-center text-blue-600">
                    <Globe size={32} />
                  </div>
                  <div>
                    <p className="font-black text-slate-900">User Interface</p>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">React / ESM</span>
                  </div>
                  {isSimulating && <div className="absolute -right-8 top-12 w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>}
                </div>

                <div className="relative flex items-center">
                  <ChevronRight className="text-slate-200 hidden md:block" />
                  {isSimulating && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-[ping-flow_2s_linear_infinite]"></div>
                    </div>
                  )}
                </div>

                {/* API Gateway / Auth Layer */}
                <div className="flex flex-col gap-6 relative">
                   <div className="bg-slate-900 px-8 py-6 rounded-3xl text-white shadow-2xl relative group">
                      <div className="absolute -top-3 -right-3 bg-blue-500 text-white p-2 rounded-xl shadow-lg">
                        <ShieldCheck size={16} />
                      </div>
                      <h4 className="font-black text-sm mb-1 tracking-tight">API Gateway</h4>
                      <p className="text-[10px] text-slate-400 font-mono">AWS ALB / JWT</p>
                   </div>
                   
                   <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                      {isSimulating && <div className="absolute inset-0 bg-blue-500/10 animate-pulse"></div>}
                      <div className="flex items-center gap-4 mb-6 relative z-10">
                        <div className="bg-white/20 p-2 rounded-xl">
                           <Box size={24} />
                        </div>
                        <div>
                           <h4 className="font-black text-lg">FastAPI Cluster</h4>
                           <p className="text-[10px] text-blue-100 opacity-70">Python 3.11 Microservices</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3 relative z-10">
                         {[1, 2, 3].map(i => (
                           <div key={i} className="w-12 h-12 bg-white/10 rounded-xl border border-white/10 flex items-center justify-center">
                              <Server size={18} className={`text-blue-200 ${isSimulating ? 'animate-pulse' : ''}`} />
                           </div>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="relative flex items-center">
                  <ChevronRight className="text-slate-200 hidden md:block" />
                  {isSimulating && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-[ping-flow_1.5s_linear_infinite]"></div>
                    </div>
                  )}
                </div>

                {/* Data Layer */}
                <div className="flex flex-col gap-6">
                   <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[2.5rem] flex flex-col items-center text-center group transition-all hover:bg-emerald-100">
                      <Database size={32} className={`text-emerald-500 mb-3 ${isSimulating ? 'scale-110' : ''} transition-transform`} />
                      <p className="font-black text-slate-900 text-sm">Postgres</p>
                      <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">AWS RDS</span>
                   </div>
                   <div className="bg-amber-50 border border-amber-100 p-8 rounded-[2.5rem] flex flex-col items-center text-center group transition-all hover:bg-amber-100">
                      <Zap size={32} className={`text-amber-500 mb-3 ${isSimulating ? 'animate-bounce' : ''}`} />
                      <p className="font-black text-slate-900 text-sm">Elasticache</p>
                      <span className="text-[10px] text-amber-600 font-bold uppercase tracking-widest">Redis v7</span>
                   </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950 rounded-[3rem] p-12 border border-slate-800 shadow-2xl h-[600px] overflow-hidden flex flex-col">
              <div className="flex items-center gap-4 mb-10 border-b border-white/5 pb-6">
                 <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                 </div>
                 <span className="text-slate-500 font-mono text-xs uppercase tracking-[0.3em] ml-4">main.py • Engine Core</span>
                 <div className="ml-auto bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                   Runtime: Python 3.11
                 </div>
              </div>
              <pre className="text-blue-400 font-mono text-sm overflow-auto custom-scrollbar leading-relaxed">
                {pythonSnippet}
              </pre>
            </div>
          )}
        </div>

        <div className="space-y-6">
           <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-sm">
              <h4 className="font-black text-slate-900 mb-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em]">
                <Activity size={18} className="text-blue-600" />
                Live Telemetry
              </h4>
              <div className="space-y-5">
                {[
                  { label: 'Latency', value: isSimulating ? '9ms' : '14ms', status: 'optimal' },
                  { label: 'Availability', value: '99.99%', status: 'optimal' },
                  { label: 'Ingress PPS', value: isSimulating ? '450' : '12', status: 'optimal' },
                  { label: 'EKS Load', value: isSimulating ? '62%' : '8%', status: 'optimal' },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</span>
                    <span className={`text-xs font-black text-black ${isSimulating && stat.label.includes('PPS') ? 'text-blue-600' : ''}`}>{stat.value}</span>
                  </div>
                ))}
              </div>
           </div>

           <div className="bg-black text-white p-10 rounded-[2.5rem] shadow-2xl shadow-black/20">
              <h4 className="font-black text-sm uppercase tracking-widest mb-4">Architecture Insight</h4>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed font-bold">This visualization represents the production-ready StelleCloud stack. It utilizes AWS EKS with autoscaling groups to manage unpredictable traffic loads.</p>
              <button className="w-full bg-white text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                Export TF Blueprint
              </button>
           </div>
        </div>
      </div>

      <style>{`
        @keyframes ping-flow {
          0% { transform: translateX(-50px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(50px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ArchitectureVisualizer;
