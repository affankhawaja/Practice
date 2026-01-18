
import React from 'react';
import { PROJECT_PHASES } from '../constants';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

const ProjectPlan: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Development Roadmap</h2>
        <p className="text-slate-500">Track the phase-by-phase implementation of the StelleCloud platform.</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {PROJECT_PHASES.map((phase) => (
          <div 
            key={phase.id} 
            className={`bg-white border rounded-2xl p-6 transition-all ${
              phase.status === 'current' ? 'ring-2 ring-blue-500 border-transparent shadow-lg shadow-blue-500/10' : 'border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  phase.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 
                  phase.status === 'current' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {phase.status === 'completed' ? <CheckCircle2 size={24} /> : phase.id}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{phase.title}</h3>
                  <p className="text-sm text-slate-500">{phase.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {phase.status === 'current' && (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
                    <Clock size={12} />
                    In Progress
                  </span>
                )}
                {phase.status === 'completed' && (
                   <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                    Completed
                   </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-14">
              {phase.tasks.map((task, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                  {phase.status === 'completed' ? (
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  ) : (
                    <Circle size={16} className="text-slate-300 shrink-0" />
                  )}
                  {task}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-indigo-600 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">Ready for Production?</h3>
          <p className="text-indigo-100 max-w-md">Our automated CI/CD pipelines and Infrastructure-as-Code ensure that moving to the next phase is just a commit away.</p>
        </div>
        <button className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors whitespace-nowrap">
          View Pipeline Config
        </button>
      </div>
    </div>
  );
};

export default ProjectPlan;
