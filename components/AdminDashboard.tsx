
import React from 'react';
import { Course } from '../types';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { TrendingUp, Users, DollarSign, Activity, ArrowUpRight, BarChart3, Download, Plus } from 'lucide-react';

interface AdminDashboardProps {
  courses: Course[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ courses }) => {
  const totalEnrollments = courses.reduce((acc, c) => acc + c.enrolled, 0);
  const totalRevenue = courses.reduce((acc, c) => acc + (c.enrolled * c.price), 0);
  
  const stats = [
    { label: 'Active Students', value: totalEnrollments.toLocaleString(), icon: <Users size={18} />, trend: '+12%', color: 'blue' },
    { label: 'Platform Revenue', value: `$${(totalRevenue/1000).toFixed(1)}k`, icon: <DollarSign size={18} />, trend: '+5.4%', color: 'emerald' },
    { label: 'Tracks Loaded', value: courses.length, icon: <Activity size={18} />, trend: 'Stable', color: 'slate' },
    { label: 'Retention Rate', value: '91.4%', icon: <BarChart3 size={18} />, trend: '+0.8%', color: 'amber' },
  ];

  const chartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 1200 },
    { name: 'Mar', value: 900 },
    { name: 'Apr', value: 2400 },
    { name: 'May', value: 1800 },
    { name: 'Jun', value: 3100 },
    { name: 'Jul', value: totalRevenue / 100 },
  ];

  return (
    <div className="space-y-8 md:space-y-12 animate-fade-in-up">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-8">
        <div className="space-y-1 md:space-y-2">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-950 tracking-tighter">Executive Intelligence</h2>
          <p className="text-slate-400 font-bold flex items-center gap-2 uppercase text-[9px] md:text-[10px] tracking-[0.3em]">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
             Live System Metrics
          </p>
        </div>
        <div className="flex gap-3 md:gap-4 overflow-x-auto no-scrollbar pb-1">
          <button className="flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3.5 bg-white border border-slate-200 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm shrink-0 shine-effect">
            <Download size={12} /> Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3.5 bg-slate-950 text-white rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-950/20 shrink-0 shine-effect">
            <Plus size={12} /> New Widget
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {stats.map((stat, idx) => (
          <div key={idx} className={`bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-200/50 shadow-sm hover:shadow-2xl transition-all duration-500 group animate-fade-in-up stagger-${idx+1}`}>
            <div className="flex justify-between items-start mb-4 md:mb-6">
              <div className={`p-3 md:p-4 rounded-xl md:rounded-[1.25rem] bg-slate-50 text-slate-950 shadow-inner group-hover:bg-slate-950 group-hover:text-white transition-colors duration-500 shrink-0`}>
                {stat.icon}
              </div>
              <span className={`text-[8px] md:text-[9px] font-black px-2 md:px-3 py-1 md:py-1.5 rounded-full uppercase tracking-widest ${stat.trend.includes('+') ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-[9px] md:text-[10px] font-black text-slate-400 mb-1 md:mb-2 uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-end gap-2">
              <h3 className="text-2xl md:text-4xl font-extrabold text-slate-950 tracking-tighter">{stat.value}</h3>
              <ArrowUpRight size={16} className="text-slate-200 mb-1 md:mb-2 group-hover:text-blue-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] border border-slate-200/50 shadow-sm relative overflow-hidden animate-fade-in-up stagger-4">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] hidden md:block">
           <Activity size={200} />
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10 md:mb-16 relative z-10">
          <div>
            <h4 className="text-xl md:text-2xl font-extrabold text-slate-950 tracking-tight">Growth Trajectory</h4>
            <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-[0.2em] mt-1 md:mt-2">Active Enrollment Analysis</p>
          </div>
          <div className="flex bg-slate-50 p-1 rounded-xl md:rounded-2xl border border-slate-200/50 shadow-inner w-full sm:w-auto">
            <button className="flex-1 sm:px-6 py-2 bg-white text-[9px] md:text-[10px] font-black text-slate-950 rounded-lg md:rounded-xl shadow-lg border border-slate-200/50 uppercase tracking-widest">Quarterly</button>
            <button className="flex-1 sm:px-6 py-2 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Annual</button>
          </div>
        </div>
        
        <div className="h-[300px] md:h-[450px] relative z-10 -mx-4 sm:mx-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.08}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                stroke="#cbd5e1" 
                fontSize={9} 
                tickLine={false} 
                axisLine={false} 
                tickMargin={12}
                fontFamily="Plus Jakarta Sans"
                fontWeight={800}
                style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}
              />
              <YAxis 
                stroke="#cbd5e1" 
                fontSize={9} 
                tickLine={false} 
                axisLine={false} 
                tickMargin={12}
                fontFamily="Plus Jakarta Sans"
                fontWeight={800}
              />
              <Tooltip 
                cursor={{ stroke: '#3b82f6', strokeWidth: 1 }}
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 20px 40px -10px rgb(0 0 0 / 0.1)', 
                  fontSize: '11px', 
                  fontWeight: '800',
                  padding: '12px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={4} 
                fillOpacity={1} 
                fill="url(#colorValue)" 
                animationDuration={2500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
