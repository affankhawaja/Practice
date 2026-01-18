
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// Fix: Added missing 'Server' import and removed unused 'Cloud' import
import { Activity, Cpu, Database, Server } from 'lucide-react';

const metricsData = Array.from({ length: 20 }, (_, i) => ({
  time: `${i}:00`,
  cpu: Math.floor(Math.random() * 30) + 40,
  memory: Math.floor(Math.random() * 20) + 60,
  latency: Math.floor(Math.random() * 100) + 50,
}));

const Observability: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Observability Stack</h2>
          <p className="text-slate-500">Live system telemetry from Prometheus & Grafana.</p>
        </div>
        <div className="flex gap-2">
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                Systems Healthy
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
            { label: 'CPU Usage', value: '42.5%', icon: <Cpu className="text-blue-500" />, color: 'blue' },
            { label: 'Memory', value: '1.2 GB', icon: <Database className="text-purple-500" />, color: 'purple' },
            { label: 'EKS Nodes', value: '3 Active', icon: <Server className="text-orange-500" />, color: 'orange' },
            { label: 'Response Time', value: '45ms', icon: <Activity className="text-emerald-500" />, color: 'emerald' },
        ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                    <div className={`p-2 rounded-lg bg-${item.color}-50`}>
                        {item.icon}
                    </div>
                    <span className="text-xs font-bold text-slate-400">Live</span>
                </div>
                <h3 className="text-3xl font-bold text-slate-900">{item.value}</h3>
                <p className="text-sm text-slate-500">{item.label}</p>
            </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">System Performance (Last 24h)</h3>
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 text-xs font-bold text-slate-600 outline-none">
                <option>All Pods</option>
                <option>training-api-svc</option>
                <option>auth-service</option>
            </select>
        </div>
        <div className="p-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metricsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={3} dot={false} name="CPU %" />
                <Line type="monotone" dataKey="memory" stroke="#a855f7" strokeWidth={3} dot={false} name="Memory %" />
                <Line type="monotone" dataKey="latency" stroke="#10b981" strokeWidth={3} dot={false} name="Latency (ms)" />
              </LineChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Observability;
