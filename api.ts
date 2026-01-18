
import { Course, User } from './types';

class MockApiService {
  private ADMIN_EMAIL = 'affankhawaja2@gmail.com';
  private ADMIN_PASSWORD = 'affan';

  private getUsers(): User[] {
    const saved = localStorage.getItem('stelle_users');
    return saved ? JSON.parse(saved) : [];
  }

  private saveUsers(users: User[]) {
    localStorage.setItem('stelle_users', JSON.stringify(users));
  }

  async login(email: string, password: string): Promise<User> {
    await new Promise(r => setTimeout(r, 800));

    // Hardcoded Admin/Instructor Account Check
    if (email === this.ADMIN_EMAIL) {
      if (password === this.ADMIN_PASSWORD) {
        return {
          id: 'admin-primary',
          name: 'Affan Khawaja',
          email: this.ADMIN_EMAIL,
          role: 'admin',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Affan'
        };
      } else {
        throw new Error('Invalid password for admin account.');
      }
    }

    const users = this.getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('User not found. Please sign up.');
    }
    // In a real mock app, any password works for signed-up students
    return user;
  }

  async signup(data: Omit<User, 'id'>): Promise<User> {
    await new Promise(r => setTimeout(r, 1000));
    
    // Check against hardcoded admin email
    if (data.email === this.ADMIN_EMAIL) {
      throw new Error('This email is reserved for administrative access.');
    }

    const users = this.getUsers();
    if (users.some(u => u.email === data.email)) {
      throw new Error('Email already registered.');
    }

    const newUser: User = {
      ...data,
      id: Math.random().toString(36).substr(2, 9)
    };

    this.saveUsers([...users, newUser]);
    return newUser;
  }

  async getCourses(): Promise<Course[]> {
    await new Promise(r => setTimeout(r, 400));
    const data = JSON.parse(localStorage.getItem('stelle_courses') || '[]');
    return data;
  }

  async enrollCourse(courseId: string, userId: string): Promise<{ success: boolean }> {
    await new Promise(r => setTimeout(r, 600));
    console.debug(`[API] User ${userId} enrolled in ${courseId}`);
    return { success: true };
  }

  async createCourse(course: Course): Promise<Course> {
    await new Promise(r => setTimeout(r, 800));
    console.debug(`[API] Created course: ${course.title}`);
    return course;
  }

  async deleteCourse(courseId: string): Promise<void> {
    await new Promise(r => setTimeout(r, 500));
    console.debug(`[API] Deleted resource: ${courseId}`);
  }
}

export const api = new MockApiService();
