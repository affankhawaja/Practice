
import React, { useState, useMemo } from 'react';
import { Course, CourseProgress, ChatMessage } from '../types';
import { 
  Users, 
  Clock, 
  ArrowRight, 
  CheckCircle, 
  MapPin, 
  User, 
  Search,
  Check,
  Trophy,
  MessageSquare,
  ShieldCheck,
  Flame,
  TrendingUp,
  Award,
  Sparkles,
  Calendar
} from 'lucide-react';

interface CourseGridProps {
  courses: Course[];
  onEnroll: (courseId: string) => void;
  userEnrollments: string[];
  isLearningView?: boolean;
  progress?: CourseProgress[];
  onToggleStep?: (courseId: string, stepIndex: number) => void;
  messages?: ChatMessage[];
}

const CourseGrid: React.FC<CourseGridProps> = ({ 
  courses, 
  onEnroll, 
  userEnrollments, 
  isLearningView = false,
  progress = [],
  onToggleStep,
  messages = []
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedRoadmap, setExpandedRoadmap] = useState<string | null>(null);
  const [expandedBroadcasts, setExpandedBroadcasts] = useState<string | null>(null);

  const categories = ['All', 'Cloud', 'DevOps', 'Backend', 'Infrastructure'];

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           course.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || course.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [courses, searchQuery, activeCategory]);

  const toggleRoadmap = (e: React.MouseEvent, courseId: string) => {
    e.stopPropagation();
    setExpandedBroadcasts(null);
    setExpandedRoadmap(expandedRoadmap === courseId ? null : courseId);
  };

  const toggleBroadcasts = (e: React.MouseEvent, courseId: string) => {
    e.stopPropagation();
    setExpandedRoadmap(null);
    setExpandedBroadcasts(expandedBroadcasts === courseId ? null : courseId);
  };

  const getCompletedSteps = (courseId: string) => {
    const p = progress.find(p => p.courseId === courseId);
    return p ? p.completedSteps : [];
  };

  const getTrendBadge = (trend: Course['trend']) => {
    switch (trend) {
      case 'Hot':
        return (
          <span className="flex items-center gap-2 bg-rose-500/10 text-rose-600 px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest border border-rose-500/20 backdrop-blur-md">
            <Flame size={10} className="fill-rose-600" /> Hot
          </span>
        );
      case 'Growing':
        return (
          <span className="flex items-center gap-2 bg-blue-500/10 text-blue-600 px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest border border-blue-500/20 backdrop-blur-md">
            <TrendingUp size={10} /> Rising
          </span>
        );
      case 'Best Seller':
        return (
          <span className="flex items-center gap-2 bg-amber-500/10 text-amber-600 px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest border border-amber-500/20 backdrop-blur-md">
            <Award size={10} /> Top
          </span>
        );
      case 'New':
        return (
          <span className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest border border-emerald-500/20 backdrop-blur-md">
            <Sparkles size={10} /> Fresh
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-12 pb-20 overflow-hidden">
      {/* Filters */}
      {!isLearningView && (
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-between animate-fade-in-up">
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-[1.5rem] border border-slate-200/50 shadow-sm overflow-x-auto no-scrollbar w-full md:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 md:px-6 py-2.5 md:py-3 rounded-[1.25rem] text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                  activeCategory === cat 
                  ? 'bg-slate-950 text-white shadow-xl shadow-slate-900/20' 
                  : 'text-slate-400 hover:text-slate-950 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-80 lg:w-96 group">
            <Search className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={16} />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search curriculum catalog..."
              className="w-full bg-white border border-slate-200/50 rounded-2xl md:rounded-[2rem] py-3.5 md:py-4 pl-12 md:pl-14 pr-6 text-xs md:text-sm font-bold text-slate-950 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/20 transition-all shadow-sm"
            />
          </div>
        </div>
      )}

      {/* Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {filteredCourses.map((course, idx) => {
            const isEnrolled = userEnrollments.includes(course.id);
            const isRoadmapOpen = expandedRoadmap === course.id;
            const isBroadcastOpen = expandedBroadcasts === course.id;
            const completedSteps = getCompletedSteps(course.id);
            const totalSteps = course.roadmap?.length || 0;
            const progressPercent = totalSteps > 0 ? (completedSteps.length / totalSteps) * 100 : 0;
            const courseMessages = messages.filter(m => m.courseId === course.id);
            
            return (
              <div 
                key={course.id} 
                className={`group bg-white border border-slate-200/50 rounded-[2rem] md:rounded-[3rem] overflow-hidden hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] transition-all duration-500 flex flex-col h-full relative animate-fade-in-up stagger-${(idx % 4) + 1} shine-effect`}
              >
                <div className="relative h-48 md:h-60 overflow-hidden shrink-0">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-60 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="absolute top-4 left-4 md:top-6 md:left-6 flex flex-col gap-1.5 md:gap-2">
                    <span className="bg-white/95 backdrop-blur-xl text-slate-950 px-3 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest border border-white/50 shadow-xl">
                      {course.category}
                    </span>
                    {!isLearningView && getTrendBadge(course.trend)}
                  </div>

                  {isLearningView && progressPercent === 100 && (
                    <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-emerald-500 text-white p-2 md:p-3 rounded-xl md:rounded-2xl shadow-2xl animate-bounce">
                      <Trophy size={16} />
                    </div>
                  )}
                </div>
                
                <div className="p-6 md:p-10 flex-1 flex flex-col">
                  {isLearningView && (
                    <div className="mb-6 md:mb-8 space-y-2 md:space-y-3">
                       <div className="flex justify-between text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <span>Batch Progress</span>
                          <span className="text-slate-950">{Math.round(progressPercent)}%</span>
                       </div>
                       <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-slate-950 transition-all duration-1000 ease-out"
                            style={{ width: `${progressPercent}%` }}
                          />
                       </div>
                    </div>
                  )}

                  <h3 className="text-lg md:text-2xl font-extrabold text-slate-950 mb-1.5 md:mb-2 tracking-tight group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>
                  
                  <div className="flex items-center gap-3 mb-4 md:mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 overflow-hidden border border-slate-100 shrink-0">
                        <User size={10} />
                      </div>
                      <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-slate-500 truncate">{course.instructor}</span>
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-slate-500 mb-6 md:mb-8 leading-relaxed line-clamp-2 font-medium">
                    {course.description}
                  </p>

                  {/* Actions for Enrolled Participants */}
                  {isEnrolled && (
                    <div className="mb-6 md:mb-8 flex gap-4 md:gap-5 border-t border-slate-50 pt-6 md:pt-8">
                      <button 
                        onClick={(e) => toggleRoadmap(e, course.id)}
                        className={`flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${isRoadmapOpen ? 'text-blue-600' : 'text-slate-400 hover:text-slate-950'}`}
                      >
                        <MapPin size={12} />
                        Modules
                      </button>
                      <button 
                        onClick={(e) => toggleBroadcasts(e, course.id)}
                        className={`flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${isBroadcastOpen ? 'text-blue-600' : 'text-slate-400 hover:text-slate-950'}`}
                      >
                        <MessageSquare size={12} />
                        Updates
                        {courseMessages.length > 0 && <span className="w-1 h-1 bg-rose-500 rounded-full"></span>}
                      </button>
                    </div>
                  )}

                  {/* Expanded Sections */}
                  {isRoadmapOpen && (
                    <div className="mb-6 md:mb-8 space-y-2 animate-in slide-in-from-top-4 duration-500">
                      {course.roadmap?.map((step, i) => {
                        const isDone = completedSteps.includes(i);
                        return (
                          <div 
                            key={i} 
                            className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all ${
                              isDone 
                              ? 'bg-emerald-50/50 border-emerald-100 text-emerald-700' 
                              : 'bg-slate-50 border-slate-100 text-slate-600'
                            }`}
                          >
                            <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[8px] md:text-[10px] font-black shrink-0 ${
                              isDone ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white border border-slate-200 text-slate-400'
                            }`}>
                              {isDone ? <Check size={12} /> : i + 1}
                            </div>
                            <span className={`text-[11px] md:text-xs font-bold line-clamp-1 ${isDone ? 'line-through opacity-50' : ''}`}>
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {isBroadcastOpen && (
                    <div className="mb-6 md:mb-8 space-y-3 md:space-y-4 animate-in slide-in-from-top-4 duration-500 max-h-48 md:max-h-56 overflow-y-auto custom-scrollbar pr-2">
                       {courseMessages.length > 0 ? courseMessages.map((msg) => (
                         <div key={msg.id} className="bg-slate-50 p-4 md:p-5 rounded-2xl md:rounded-3xl border border-slate-100 relative overflow-hidden group/msg">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 opacity-0 group-hover/msg:opacity-100 transition-opacity"></div>
                            <div className="flex items-center gap-2 mb-1.5 md:mb-2">
                               <ShieldCheck size={10} className="text-blue-600" />
                               <span className="text-[8px] md:text-[9px] font-black uppercase text-slate-950">Broadcast</span>
                               <span className="text-[7px] md:text-[8px] font-extrabold text-slate-300 ml-auto">
                                 {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                               </span>
                            </div>
                            <p className="text-[10px] md:text-xs font-bold text-slate-600 leading-relaxed">{msg.text}</p>
                         </div>
                       )) : (
                         <div className="py-8 text-center bg-slate-50 rounded-[1.5rem] md:rounded-[2.5rem] border border-dashed border-slate-200">
                            <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">No recent alerts</p>
                         </div>
                       )}
                    </div>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-x-4 md:gap-x-8 gap-y-3 mb-6 md:mb-10 text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest mt-auto">
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-blue-500" />
                      <span>{course.enrolled} Enrolled</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-slate-300" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-amber-500" />
                      <span>Starts: {course.startDate}</span>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-6 md:pt-10 border-t border-slate-50">
                    <div className="flex flex-col">
                      <span className="text-[8px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Full Access</span>
                      <span className="text-xl md:text-3xl font-extrabold text-slate-950 tracking-tighter">${course.price}</span>
                    </div>
                    
                    {isEnrolled ? (
                      <div className="flex items-center gap-2 bg-emerald-500 text-white px-5 md:px-8 py-2.5 md:py-4 rounded-xl md:rounded-2xl font-black text-[9px] md:text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 border border-emerald-400">
                        <CheckCircle size={14} />
                        Active
                      </div>
                    ) : (
                      <button 
                        onClick={() => onEnroll(course.id)}
                        className="flex items-center gap-2 md:gap-3 bg-slate-950 text-white px-5 md:px-8 py-2.5 md:py-4 rounded-xl md:rounded-2xl font-black text-[9px] md:text-xs uppercase tracking-widest hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-500/30 transition-all transform active:scale-95"
                      >
                        Enroll Track
                        <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-dashed border-slate-200 rounded-[2rem] md:rounded-[4rem] p-16 md:p-32 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
            <Search size={28} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl md:text-2xl font-black text-slate-950 tracking-tight">Zero matches</h3>
            <p className="text-slate-400 font-bold max-w-sm mx-auto text-sm">Refine your search parameters.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseGrid;
