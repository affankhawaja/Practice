
import React, { useState } from 'react';
import { Course, Enrollment, CourseProgress } from '../types';
import { 
  Plus, Edit3, Trash2, X, Save, ListChecks, Trash, 
  Calendar, Clock, Flame, TrendingUp,
  Check, UserCircle, DollarSign, MessageSquare, Send, Sparkles, Award
} from 'lucide-react';

interface InstructorPortalProps {
  courses: Course[];
  onAddCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
  onUpdateCourse: (course: Course) => void;
  enrollments: Enrollment[];
  progress: CourseProgress[];
  onToggleProgress: (courseId: string, userId: string, stepIndex: number) => void;
  onSendMessage: (courseId: string, text: string) => void;
}

const InstructorPortal: React.FC<InstructorPortalProps> = ({ 
  courses, 
  onAddCourse, 
  onDeleteCourse,
  onUpdateCourse,
  enrollments,
  progress,
  onToggleProgress,
  onSendMessage
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [roadmapStep, setRoadmapStep] = useState('');
  const [broadcastText, setBroadcastText] = useState('');
  const [formData, setFormData] = useState<Partial<Course>>({
    title: '',
    description: '',
    price: 0,
    category: 'Cloud',
    instructor: '',
    duration: '',
    startDate: '',
    roadmap: [],
    trend: 'Stable'
  });

  const [activeCourseForProgress, setActiveCourseForProgress] = useState<string | null>(null);

  const addRoadmapStep = () => {
    if (roadmapStep.trim()) {
      setFormData(prev => ({
        ...prev,
        roadmap: [...(prev.roadmap || []), roadmapStep.trim()]
      }));
      setRoadmapStep('');
    }
  };

  const removeRoadmapStep = (index: number) => {
    setFormData(prev => ({
      ...prev,
      roadmap: (prev.roadmap || []).filter((_, i) => i !== index)
    }));
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (broadcastText.trim() && activeCourseForProgress) {
      onSendMessage(activeCourseForProgress, broadcastText.trim());
      setBroadcastText('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const updatedCourse = courses.find(c => c.id === editingId);
      if (updatedCourse) {
        onUpdateCourse({ ...updatedCourse, ...formData } as Course);
      }
      setEditingId(null);
    } else {
      const course: Course = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        enrolled: 0,
        thumbnail: `https://picsum.photos/seed/${Math.random()}/400/250`,
      } as Course;
      onAddCourse(course);
    }
    setFormData({ title: '', description: '', price: 0, category: 'Cloud', instructor: '', duration: '', startDate: '', roadmap: [], trend: 'Stable' });
    setShowForm(false);
  };

  const handleEdit = (course: Course) => {
    setFormData({ ...course, roadmap: course.roadmap || [] });
    setEditingId(course.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ title: '', description: '', price: 0, category: 'Cloud', instructor: '', duration: '', startDate: '', roadmap: [], trend: 'Stable' });
    setShowForm(false);
  };

  const selectedCourse = courses.find(c => c.id === activeCourseForProgress);
  const enrolledStudentsCount = enrollments.filter(e => e.courseId === activeCourseForProgress).length;

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-950 tracking-tight">Track Management</h2>
          <p className="text-slate-500 font-medium text-sm">Control curriculum orchestration and batch updates.</p>
        </div>
        {!showForm && !activeCourseForProgress && (
          <button 
            onClick={() => setShowForm(true)}
            className="w-full sm:w-auto bg-slate-950 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg font-bold text-sm"
          >
            <Plus size={18} /> New Track
          </button>
        )}
      </div>

      {activeCourseForProgress && selectedCourse && (
        <div className="bg-white border border-slate-200 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-xl animate-in slide-in-from-top-4 duration-500">
           <div className="flex justify-between items-start mb-6 md:mb-10 pb-4 md:pb-6 border-b border-slate-100">
              <div className="space-y-1">
                 <h3 className="text-xl md:text-2xl font-black text-slate-950 tracking-tight">{selectedCourse.title}</h3>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{enrolledStudentsCount} Enrolled Students</p>
              </div>
              <button 
                onClick={() => setActiveCourseForProgress(null)}
                className="p-2 hover:bg-slate-50 rounded-xl text-slate-400"
              >
                <X size={24} />
              </button>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12">
              <div className="lg:col-span-3 space-y-8 md:space-y-12">
                 <div className="bg-slate-50 rounded-[2rem] p-6 md:p-10 border border-slate-100">
                    <div className="mb-6 md:mb-8">
                       <h4 className="font-black text-slate-950 text-lg">Roadmap Status</h4>
                       <p className="text-[10px] font-black text-slate-400 mt-1 uppercase">Updates are pushed instantly to candidates.</p>
                    </div>
                    <div className="space-y-2 md:space-y-3">
                       {selectedCourse.roadmap?.map((step, idx) => {
                          const courseProg = progress.find(p => p.courseId === selectedCourse.id);
                          const isDone = courseProg?.completedSteps.includes(idx);
                          
                          return (
                            <button
                              key={idx}
                              onClick={() => onToggleProgress(selectedCourse.id, 'global', idx)}
                              className={`w-full text-left p-4 md:p-6 rounded-xl md:rounded-2xl border transition-all flex items-center justify-between group ${
                                isDone 
                                ? 'bg-white border-emerald-500 text-emerald-800 shadow-lg' 
                                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-950'
                              }`}
                            >
                               <div className="flex items-center gap-4 md:gap-6">
                                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center text-xs md:text-sm font-black shrink-0 ${
                                    isDone ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                                  }`}>
                                     {isDone ? <Check size={18} /> : idx + 1}
                                  </div>
                                  <span className="font-bold text-sm md:text-base truncate max-w-[150px] sm:max-w-none">{step}</span>
                               </div>
                               {isDone ? (
                                 <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full shrink-0">Done</span>
                               ) : (
                                 <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 text-slate-400 hidden sm:block">Mark Done</div>
                               )}
                            </button>
                          );
                       })}
                    </div>
                 </div>

                 <div className="bg-white border border-slate-200 rounded-[2rem] p-6 md:p-10 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                       <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                          <MessageSquare size={18} />
                       </div>
                       <div>
                          <h4 className="font-black text-slate-950 text-lg">Broadcast Hub</h4>
                          <p className="text-[10px] font-black text-slate-400 mt-1 uppercase">Alert all batch candidates.</p>
                       </div>
                    </div>
                    <form onSubmit={handleSendBroadcast} className="flex flex-col sm:flex-row gap-3 md:gap-4">
                       <input 
                         value={broadcastText}
                         onChange={(e) => setBroadcastText(e.target.value)}
                         placeholder="New announcement..."
                         className="flex-1 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl px-5 md:px-6 py-3.5 md:py-4 text-xs md:text-sm font-bold text-slate-950 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                       />
                       <button 
                         type="submit"
                         disabled={!broadcastText.trim()}
                         className="bg-slate-950 text-white px-6 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest hover:bg-blue-600 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-30"
                       >
                         Send <Send size={14} />
                       </button>
                    </form>
                 </div>
              </div>

              <div className="space-y-4 md:space-y-6">
                 <div className="bg-slate-50 border border-slate-100 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem]">
                    <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Class Overview</h5>
                    <div className="space-y-4">
                       <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-500">Candidates</span>
                          <span className="text-sm font-black text-slate-950">{enrolledStudentsCount}</span>
                       </div>
                       <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-500">Launch Date</span>
                          <span className="text-sm font-black text-slate-950">{selectedCourse.startDate}</span>
                       </div>
                    </div>
                 </div>
                 
                 <div className="bg-slate-950 text-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-xl">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Internal Note</p>
                    <p className="text-xs font-bold leading-relaxed opacity-80">Synchronized updates are active for this curriculum track.</p>
                 </div>
              </div>
           </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <h3 className="text-xl md:text-2xl font-black text-slate-950">{editingId ? 'Modify Track' : 'Create New Track'}</h3>
            <button onClick={handleCancel} className="text-slate-400 hover:text-slate-950 p-2">
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-1.5 md:space-y-2">
              <label className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Track Title</label>
              <input 
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl p-3.5 md:p-4 outline-none focus:ring-4 focus:ring-blue-500/10 text-xs md:text-sm font-bold text-slate-950"
                placeholder="Course title..."
              />
            </div>
            <div className="space-y-1.5 md:space-y-2">
              <label className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Domain</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl p-3.5 md:p-4 outline-none text-xs md:text-sm font-bold text-slate-950"
              >
                <option>Cloud</option>
                <option>DevOps</option>
                <option>Backend</option>
                <option>Infrastructure</option>
              </select>
            </div>

            <div className="space-y-1.5 md:space-y-2">
              <label className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Lead Instructor</label>
              <input 
                required
                value={formData.instructor}
                onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl p-3.5 md:p-4 outline-none focus:ring-4 focus:ring-blue-500/10 text-xs md:text-sm font-bold text-slate-950"
                placeholder="Full name..."
              />
            </div>

            <div className="space-y-1.5 md:space-y-2">
              <label className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Tuition Fee ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  required
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl py-3.5 md:py-4 pl-10 pr-4 outline-none focus:ring-4 focus:ring-blue-500/10 text-xs md:text-sm font-bold text-slate-950"
                />
              </div>
            </div>

            <div className="space-y-1.5 md:space-y-2">
              <label className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Trend Signal</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { value: 'Hot', icon: <Flame size={14} /> },
                  { value: 'Growing', icon: <TrendingUp size={14} /> },
                  { value: 'Best Seller', icon: <Award size={14} /> },
                  { value: 'New', icon: <Sparkles size={14} /> },
                  { value: 'Stable', icon: <Check size={14} /> }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, trend: opt.value as Course['trend'] })}
                    className={`flex items-center justify-center gap-1.5 p-2 rounded-lg border text-[8px] font-black uppercase transition-all ${
                      formData.trend === opt.value 
                        ? 'bg-slate-950 text-white border-slate-950 shadow-md' 
                        : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    {opt.icon}
                    <span className="hidden sm:inline">{opt.value}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 md:space-y-2">
              <label className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Launch Date</label>
              <input 
                required
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl p-3.5 md:p-4 outline-none focus:ring-4 focus:ring-blue-500/10 text-xs md:text-sm font-bold text-slate-950"
              />
            </div>

            <div className="md:col-span-2 space-y-4 md:space-y-6">
               <label className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-slate-400 ml-1">Curriculum Milestones</label>
               <div className="flex gap-3">
                  <input 
                    value={roadmapStep}
                    onChange={(e) => setRoadmapStep(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRoadmapStep())}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-bold text-slate-950 outline-none focus:ring-4 focus:ring-blue-500/10"
                    placeholder="Brief description..."
                  />
                  <button 
                    type="button" 
                    onClick={addRoadmapStep}
                    className="bg-slate-950 text-white px-5 md:px-8 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs hover:bg-blue-600 transition-all shrink-0"
                  >
                    Add
                  </button>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                  {formData.roadmap?.map((step, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-50 border border-slate-100 px-4 md:px-5 py-2.5 md:py-3 rounded-xl md:rounded-2xl">
                      <span className="text-xs font-bold text-slate-700 truncate mr-2">{step}</span>
                      <button type="button" onClick={() => removeRoadmapStep(idx)} className="text-slate-300 hover:text-rose-500 transition-colors shrink-0">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
               </div>
            </div>

            <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-100">
              <button 
                type="submit"
                className="flex-1 bg-slate-950 text-white py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-600 transition-all shadow-xl"
              >
                {editingId ? 'Apply Updates' : 'Publish Catalog Track'}
              </button>
              <button 
                type="button"
                onClick={handleCancel}
                className="py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-[0.2em] text-xs text-slate-400 hover:text-slate-950 transition-colors bg-slate-50 sm:bg-transparent"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {!activeCourseForProgress && (
        <div className="bg-white border border-slate-200 rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Curriculum</th>
                  <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Milestones</th>
                  <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Economics</th>
                  <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-6 md:px-8 py-5 md:py-6">
                      <div className="flex items-center gap-4">
                        <img src={course.thumbnail} className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl object-cover border border-slate-100 shadow-sm shrink-0" alt="" />
                        <div className="min-w-0">
                          <p className="font-black text-slate-950 leading-tight truncate text-sm md:text-base">{course.title}</p>
                          <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{course.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-5 md:py-6">
                      <span className="text-[8px] md:text-[9px] font-black bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full uppercase tracking-widest border border-blue-100">
                        {course.roadmap?.length || 0} Steps
                      </span>
                    </td>
                    <td className="px-6 md:px-8 py-5 md:py-6">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-black text-slate-950">${course.price}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={10} className="text-slate-300" />
                          <span className="text-[10px] font-bold text-slate-400">{course.startDate}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 md:px-8 py-5 md:py-6 text-right">
                       <div className="flex justify-end items-center gap-1.5">
                        <button 
                          onClick={() => setActiveCourseForProgress(course.id)}
                          className="px-3 md:px-4 py-2 bg-slate-950 text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-lg md:rounded-xl hover:bg-blue-600 transition-all shadow-sm"
                        >
                          Sync
                        </button>
                        <button 
                          onClick={() => handleEdit(course)}
                          className="p-2 text-slate-300 hover:text-slate-950 transition-all rounded-lg hover:bg-slate-100"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => onDeleteCourse(course.id)}
                          className="p-2 text-slate-300 hover:text-rose-500 transition-all rounded-lg hover:bg-rose-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorPortal;
