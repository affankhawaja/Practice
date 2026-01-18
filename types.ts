
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
  avatar?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  duration: string;
  startDate: string;
  enrolled: number;
  category: string;
  thumbnail: string;
  roadmap?: string[];
  trend?: 'Hot' | 'Growing' | 'Best Seller' | 'New' | 'Stable';
}

export interface Enrollment {
  userId: string;
  courseId: string;
  userName: string;
  userEmail: string;
}

export interface CourseProgress {
  courseId: string;
  completedSteps: number[];
}

export interface ChatMessage {
  id: string;
  courseId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  targetRole: 'admin' | 'student' | 'all';
  targetUserId?: string;
  targetCourseId?: string;
}

export interface Metric {
  name: string;
  value: number;
  change: number;
  type: 'increase' | 'decrease' | 'neutral';
}

export interface Phase {
  id: number;
  title: string;
  status: 'completed' | 'current' | 'upcoming';
  description: string;
  tasks: string[];
}
