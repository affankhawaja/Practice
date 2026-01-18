
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Course, User } from '../types';
import { Send, MessageSquare, ShieldCheck, User as UserIcon, Clock, ChevronLeft } from 'lucide-react';

interface ChatRoomProps {
  currentUser: User;
  courses: Course[];
  messages: ChatMessage[];
  onSendMessage: (courseId: string, text: string) => void;
  userEnrollments: string[];
}

const ChatRoom: React.FC<ChatRoomProps> = ({ 
  currentUser, 
  courses, 
  messages, 
  onSendMessage,
  userEnrollments 
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [inputText, setInputText] = useState('');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedCourseId]);

  const isAdmin = currentUser.role === 'admin';
  
  // Filter courses for selection
  const availableCourses = isAdmin 
    ? courses 
    : courses.filter(c => userEnrollments.includes(c.id));

  // Default selection
  useEffect(() => {
    if (!selectedCourseId && availableCourses.length > 0) {
      setSelectedCourseId(availableCourses[0].id);
    }
  }, [availableCourses]);

  // Handle mobile responsive view logic
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsSidebarVisible(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredMessages = messages.filter(m => m.courseId === selectedCourseId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && selectedCourseId) {
      onSendMessage(selectedCourseId, inputText.trim());
      setInputText('');
    }
  };

  const selectCourse = (id: string) => {
    setSelectedCourseId(id);
    if (window.innerWidth < 1024) setIsSidebarVisible(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-12rem)] bg-white border border-slate-200 lg:rounded-[3rem] overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex h-full relative">
        {/* Sidebar Selector */}
        <div className={`
          absolute lg:static inset-y-0 left-0 w-full lg:w-80 border-r border-slate-100 flex flex-col bg-slate-50/30 z-20 transition-transform duration-300
          ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-6 border-b border-slate-100 bg-white">
            <h3 className="text-sm font-black text-black uppercase tracking-[0.2em] mb-1">Broadcast Hub</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Select track batch</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {availableCourses.map(course => (
              <button
                key={course.id}
                onClick={() => selectCourse(course.id)}
                className={`w-full text-left p-4 rounded-2xl transition-all border ${
                  selectedCourseId === course.id 
                    ? 'bg-black text-white border-black shadow-lg shadow-black/10' 
                    : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                }`}
              >
                <p className="text-xs font-black truncate">{course.title}</p>
                <p className={`text-[9px] mt-1 font-bold uppercase tracking-widest ${selectedCourseId === course.id ? 'text-white/60' : 'text-slate-400'}`}>
                   {course.category} • {course.enrolled} Students
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
            <div className="flex items-center gap-3 md:gap-4">
              {!isSidebarVisible && (
                <button 
                  onClick={() => setIsSidebarVisible(true)}
                  className="p-2 -ml-2 text-slate-400 hover:text-slate-950 lg:hidden transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
              )}
              <div className="w-9 h-9 md:w-10 md:h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <MessageSquare size={18} />
              </div>
              <div className="min-w-0">
                <h4 className="font-black text-slate-950 leading-tight truncate text-sm md:text-base">
                  {courses.find(c => c.id === selectedCourseId)?.title || 'Broadcast Line'}
                </h4>
                <div className="flex items-center gap-1.5">
                   <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                   <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Secure Transmission</span>
                </div>
              </div>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 md:p-8 space-y-5 md:space-y-6 custom-scrollbar"
          >
            {filteredMessages.length > 0 ? filteredMessages.map((msg) => (
              <div key={msg.id} className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-2 md:gap-3 mb-1.5 md:mb-2">
                   <div className="w-5 h-5 md:w-6 md:h-6 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                      <ShieldCheck size={12} className="text-blue-600" />
                   </div>
                   <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-900">{msg.senderName}</span>
                   <span className="text-[8px] md:text-[9px] font-bold text-slate-300 ml-auto">
                     {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </span>
                </div>
                <div className="bg-slate-50 p-4 md:p-5 rounded-2xl rounded-tl-none border border-slate-100 max-w-full md:max-w-2xl">
                   <p className="text-xs md:text-sm font-semibold text-slate-700 leading-relaxed">{msg.text}</p>
                </div>
              </div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30 p-10">
                <div className="p-4 md:p-6 bg-slate-50 rounded-full">
                  <MessageSquare size={32} className="text-slate-300" />
                </div>
                <div>
                   <p className="text-xs md:text-sm font-black text-black uppercase tracking-widest">Awaiting Update</p>
                   <p className="text-[10px] md:text-xs font-bold text-slate-500 mt-1 max-w-[200px]">
                     Broadcast updates from the lead instructor will appear here.
                   </p>
                </div>
              </div>
            )}
          </div>

          {isAdmin ? (
            <div className="p-4 md:p-8 border-t border-slate-100 bg-slate-50/50">
              <form onSubmit={handleSend} className="flex gap-3 md:gap-4">
                <input 
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Send broadcast..."
                  className="flex-1 bg-white border border-slate-200 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-bold text-black focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm"
                />
                <button 
                  type="submit"
                  disabled={!inputText.trim()}
                  className="bg-black text-white px-5 md:px-8 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest hover:bg-blue-600 disabled:opacity-30 transition-all flex items-center gap-2 shadow-xl shadow-black/10 shrink-0"
                >
                  <span className="hidden sm:inline">Broadcast</span> <Send size={14} />
                </button>
              </form>
            </div>
          ) : (
            <div className="p-4 md:p-6 border-t border-slate-100 bg-slate-50/20 text-center">
               <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live broadcast feed • Locked</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
