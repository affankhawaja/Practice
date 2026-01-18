
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar.tsx';
import CourseGrid from './components/CourseGrid.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import InstructorPortal from './components/InstructorPortal.tsx';
import ChatRoom from './components/ChatRoom.tsx';
import Auth from './components/Auth.tsx';
import PaymentModal from './components/PaymentModal.tsx';
import { INITIAL_COURSES } from './constants.tsx';
import { Course, User as UserType, Notification, CourseProgress, Enrollment, ChatMessage } from './types.ts';
import { Bell, User, Activity, X, Check, Clock, GraduationCap, ArrowUpRight, Menu } from 'lucide-react';
import { api } from './api.ts';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserType | null>(() => {
    const saved = localStorage.getItem('stelle_current_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [checkoutCourse, setCheckoutCourse] = useState<Course | null>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('stelle_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [allEnrollments, setAllEnrollments] = useState<Enrollment[]>(() => {
    const saved = localStorage.getItem('stelle_all_enrollments');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('stelle_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>(() => {
    const saved = localStorage.getItem('stelle_progress');
    return saved ? JSON.parse(saved) : [];
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('stelle_chats');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('stelle_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('stelle_all_enrollments', JSON.stringify(allEnrollments));
  }, [allEnrollments]);

  useEffect(() => {
    localStorage.setItem('stelle_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('stelle_progress', JSON.stringify(courseProgress));
  }, [courseProgress]);

  useEffect(() => {
    localStorage.setItem('stelle_chats', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('stelle_current_user', JSON.stringify(currentUser));
      if (currentUser.role === 'admin' && (activeTab === 'courses' || activeTab === 'my-learning')) {
        setActiveTab('dashboard');
      } else if (currentUser.role === 'student' && (activeTab === 'dashboard' || activeTab === 'instructor')) {
        setActiveTab('courses');
      }
    } else {
      localStorage.removeItem('stelle_current_user');
    }
  }, [currentUser, activeTab]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addNotification = (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: Notification = {
      ...notif,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const userEnrollmentIds = allEnrollments
    .filter(e => e.userId === currentUser?.id)
    .map(e => e.courseId);

  const initiateEnrollment = (courseId: string) => {
    if (!currentUser) return;
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const isAlreadyEnrolled = allEnrollments.some(e => e.userId === currentUser.id && e.courseId === courseId);
    if (!isAlreadyEnrolled) {
      setCheckoutCourse(course);
    }
  };

  const handlePaymentSuccess = async (courseId: string) => {
    if (!currentUser) return;
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    await api.enrollCourse(courseId, currentUser.id);
    const newEnrollment: Enrollment = {
      userId: currentUser.id,
      courseId: courseId,
      userName: currentUser.name,
      userEmail: currentUser.email
    };
    
    setAllEnrollments(prev => [...prev, newEnrollment]);
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, enrolled: c.enrolled + 1 } : c));
    
    addNotification({
      title: 'Enrollment Successful',
      message: `You have successfully joined ${course.title}.`,
      targetRole: 'student',
      targetUserId: currentUser.id,
      targetCourseId: courseId
    });

    addNotification({
      title: 'New Enrollment',
      message: `${currentUser.name} enrolled in ${course.title}.`,
      targetRole: 'admin'
    });

    setCheckoutCourse(null);
    setActiveTab('my-learning');
  };

  const handleSendMessage = (courseId: string, text: string) => {
    if (!currentUser || currentUser.role !== 'admin') return;
    const course = courses.find(c => c.id === courseId);
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      courseId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text,
      timestamp: Date.now()
    };
    setChatMessages(prev => [...prev, newMessage]);
    
    addNotification({
      title: 'Batch Update',
      message: `New transmission for ${course?.title || 'your track'}.`,
      targetRole: 'student',
      targetCourseId: courseId
    });
  };

  const toggleCourseStep = (courseId: string, stepIndex: number) => {
    setCourseProgress(prev => {
      const existing = prev.find(p => p.courseId === courseId);
      const course = courses.find(c => c.id === courseId);
      
      let newSteps: number[] = [];
      let isCompleted = false;

      if (existing) {
        isCompleted = existing.completedSteps.includes(stepIndex);
        newSteps = isCompleted 
          ? existing.completedSteps.filter(s => s !== stepIndex)
          : [...existing.completedSteps, stepIndex];
      } else {
        newSteps = [stepIndex];
      }
      
      addNotification({
        title: `Progress Update`,
        message: `Milestone marked in ${course?.title}.`,
        targetRole: 'student',
        targetCourseId: courseId
      });

      if (existing) {
        return prev.map(p => p.courseId === courseId ? { ...p, completedSteps: newSteps } : p);
      } else {
        return [...prev, { courseId, completedSteps: newSteps }];
      }
    });
  };

  const isNotificationVisible = (n: Notification) => {
    if (!currentUser) return false;
    const roleMatches = n.targetRole === 'all' || 
                        (n.targetRole === 'admin' && currentUser.role === 'admin') || 
                        (n.targetRole === 'student' && currentUser.role === 'student');
    if (!roleMatches) return false;
    if (currentUser.role === 'student' && n.targetCourseId) {
      if (!userEnrollmentIds.includes(n.targetCourseId)) return false;
    }
    if (n.targetUserId && n.targetUserId !== currentUser.id) return false;
    return true;
  };

  const markAllRead = () => {
    if (!currentUser) return;
    setNotifications(prev => prev.map(n => {
      return isNotificationVisible(n) ? { ...n, read: true } : n;
    }));
  };

  const filteredNotifications = notifications.filter(isNotificationVisible);
  const unreadCount = filteredNotifications.filter(n => !n.read).length;

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminDashboard courses={courses} />;
      case 'chat': return (
        <ChatRoom 
          currentUser={currentUser!} 
          courses={courses} 
          messages={chatMessages} 
          onSendMessage={handleSendMessage}
          userEnrollments={userEnrollmentIds}
        />
      );
      case 'courses': return (
        <div className="space-y-8 md:space-y-12">
           <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
              <div className="space-y-2 md:space-y-3">
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tighter">Global Catalog</h2>
                <p className="text-slate-400 font-bold uppercase text-[9px] md:text-[10px] tracking-[0.3em] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  Professional DevOps Tracks
                </p>
              </div>
           </div>
           <CourseGrid courses={courses} onEnroll={initiateEnrollment} userEnrollments={userEnrollmentIds} messages={chatMessages} />
        </div>
      );
      case 'my-learning': 
        const enrolledCourses = courses.filter(c => userEnrollmentIds.includes(c.id));
        return (
          <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tighter">My Active Path</h2>
                <p className="text-slate-400 font-bold uppercase text-[9px] md:text-[10px] tracking-[0.3em] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  In Progress: {enrolledCourses.length} Tracks
                </p>
              </div>
              <div className="bg-white border border-slate-200/50 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] flex items-center gap-4 md:gap-6 shadow-sm w-full md:w-auto justify-between md:justify-start">
                 <div className="text-right">
                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Completion Score</p>
                    <p className="text-xl md:text-2xl font-black text-slate-950">A+</p>
                 </div>
                 <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 text-slate-950 rounded-xl md:rounded-2xl flex items-center justify-center shadow-inner">
                    <GraduationCap size={20} />
                 </div>
              </div>
            </div>
            {enrolledCourses.length > 0 ? (
               <CourseGrid 
                 courses={enrolledCourses} 
                 onEnroll={() => {}} 
                 userEnrollments={userEnrollmentIds} 
                 isLearningView={true}
                 progress={courseProgress}
                 onToggleStep={() => {}} 
                 messages={chatMessages}
               />
            ) : (
              <div className="bg-white border border-slate-200/50 rounded-[2rem] md:rounded-[4rem] p-12 md:p-32 text-center space-y-6 md:space-y-8 shadow-sm">
                 <div className="w-16 h-16 md:w-24 md:h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-100">
                    <GraduationCap size={32} />
                 </div>
                 <div className="space-y-3">
                    <h3 className="text-xl md:text-2xl font-black text-slate-950 tracking-tight">No Active Enrollments</h3>
                    <p className="text-slate-400 font-bold max-w-sm mx-auto text-sm">Launch your career by choosing a specialized DevOps curriculum.</p>
                 </div>
                 <button 
                   onClick={() => setActiveTab('courses')}
                   className="w-full md:w-auto bg-slate-950 text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl md:rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl shadow-slate-950/20"
                 >
                   Explore Tracks
                 </button>
              </div>
            )}
          </div>
        );
      case 'instructor': return (
        <InstructorPortal 
          courses={courses} 
          onAddCourse={(c) => setCourses(prev => [c, ...prev])} 
          onDeleteCourse={(id) => {
            setCourses(prev => prev.filter(c => c.id !== id));
            setAllEnrollments(prev => prev.filter(e => e.courseId !== id));
            setCourseProgress(prev => prev.filter(p => p.courseId !== id));
            setChatMessages(prev => prev.filter(m => m.courseId !== id));
          }} 
          onUpdateCourse={(c) => setCourses(prev => prev.map(old => old.id === c.id ? c : old))}
          enrollments={allEnrollments}
          progress={courseProgress}
          onToggleProgress={(courseId, _, stepIndex) => toggleCourseStep(courseId, stepIndex)}
          onSendMessage={handleSendMessage}
        />
      );
      default: return <AdminDashboard courses={courses} />;
    }
  };

  if (!currentUser) {
    return <Auth onAuthSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Desktop and Mobile Drawer */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(id) => {
          setActiveTab(id);
          setIsMobileMenuOpen(false);
        }} 
        userRole={currentUser.role} 
        onLogout={handleLogout} 
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />
      
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 lg:hidden animate-in fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Payment Modal Overlay */}
      {checkoutCourse && (
        <PaymentModal 
          course={checkoutCourse} 
          onClose={() => setCheckoutCourse(null)} 
          onSuccess={handlePaymentSuccess}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 bg-[#fcfcfd]">
        <header className="h-20 lg:h-24 bg-white/40 backdrop-blur-3xl border-b border-slate-200/30 px-4 md:px-8 lg:px-12 flex items-center justify-between shrink-0 sticky top-0 z-40">
           <div className="flex items-center gap-3 md:gap-4">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl lg:hidden transition-all"
              >
                <Menu size={20} />
              </button>
              <div className="hidden sm:flex bg-white/80 border border-slate-200/50 px-3 md:px-4 py-1.5 md:py-2 rounded-full items-center gap-2 md:gap-3 shadow-sm">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 whitespace-nowrap">Node: Primary</span>
              </div>
           </div>
           
           <div className="flex items-center gap-2 md:gap-6">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 md:p-3 text-slate-400 hover:text-slate-950 hover:bg-white rounded-xl md:rounded-2xl transition-all border border-transparent hover:border-slate-200/50"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 md:w-4 md:h-4 bg-rose-500 text-white text-[7px] md:text-[8px] font-black flex items-center justify-center rounded-full ring-2 md:ring-4 ring-white shadow-xl animate-in zoom-in duration-500">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div 
                  ref={notificationRef}
                  className="absolute top-full right-4 mt-4 md:mt-6 w-[280px] sm:w-[320px] md:w-[420px] bg-white border border-slate-200/50 rounded-[2rem] md:rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500"
                >
                  <div className="p-5 md:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-[10px] md:text-xs font-black text-slate-950 uppercase tracking-[0.3em]">Signals</h3>
                    <button 
                      onClick={markAllRead}
                      className="text-[8px] md:text-[9px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest bg-blue-50 px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                  <div className="max-h-[350px] md:max-h-[500px] overflow-y-auto custom-scrollbar">
                    {filteredNotifications.length > 0 ? filteredNotifications.map((n) => (
                      <div 
                        key={n.id} 
                        className={`p-4 md:p-6 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-all flex gap-4 md:gap-5 relative group ${!n.read ? 'bg-blue-50/20' : ''}`}
                      >
                        {!n.read && (
                          <div className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2">
                            <div className="w-1 md:w-1.5 h-1 md:h-1.5 bg-blue-600 rounded-full"></div>
                          </div>
                        )}
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 ml-1 md:ml-2 ${n.read ? 'bg-white border border-slate-100 text-slate-300' : 'bg-slate-950 text-white shadow-xl shadow-slate-950/20'}`}>
                          {n.targetRole === 'admin' ? <Activity size={18} /> : <GraduationCap size={18} />}
                        </div>
                        <div className="space-y-1 flex-1 min-w-0">
                          <p className="text-xs md:text-sm font-black text-slate-950 leading-tight truncate">{n.title}</p>
                          <p className="text-[10px] md:text-xs text-slate-500 font-bold leading-relaxed line-clamp-2">{n.message}</p>
                        </div>
                      </div>
                    )) : (
                      <div className="p-12 md:p-20 text-center space-y-4">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Everything current</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="h-6 md:h-8 w-px bg-slate-200/50 hidden sm:block"></div>
              
              <div className="flex items-center gap-2 md:gap-4 pl-0 sm:pl-2 group cursor-pointer">
                <div className="text-right hidden md:block">
                   <p className="text-sm font-black text-slate-950 leading-none mb-1 group-hover:text-blue-600 transition-colors">{currentUser.name}</p>
                   <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">{currentUser.role}</p>
                </div>
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-[1.25rem] bg-slate-950 border border-slate-800 flex items-center justify-center text-white shadow-xl shadow-slate-950/20 transform group-hover:scale-105 transition-transform duration-300">
                  <User size={18} />
                </div>
              </div>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 custom-scrollbar">
          <div className="max-w-7xl mx-auto pb-12 md:pb-24">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
