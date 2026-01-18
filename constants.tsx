
import React from 'react';
import { Course, Phase } from './types';
import { 
  Layout, 
  BookOpen,
  UserPlus,
  GraduationCap,
  MessageSquare
} from 'lucide-react';

export const INITIAL_COURSES: Course[] = [
  {
    id: '1',
    title: 'Mastering AWS EKS',
    description: 'Learn how to deploy and manage production-ready Kubernetes clusters on AWS.',
    instructor: 'Alex Rivera',
    price: 99,
    duration: '12h 30m',
    startDate: '2024-05-15',
    enrolled: 1240,
    category: 'Cloud',
    thumbnail: 'https://picsum.photos/seed/eks/400/250',
    roadmap: ['Cluster Networking', 'IAM Roles for Service Accounts', 'Autoscaling with Karpenter', 'GitOps with ArgoCD'],
    trend: 'Hot'
  },
  {
    id: '2',
    title: 'Terraform for DevOps Engineers',
    description: 'Infrastructure as Code from scratch to multi-environment deployment.',
    instructor: 'Sarah Chen',
    price: 79,
    duration: '8h 15m',
    startDate: '2024-06-01',
    enrolled: 850,
    category: 'Infrastructure',
    thumbnail: 'https://picsum.photos/seed/tf/400/250',
    roadmap: ['State Management', 'Modules & Reusability', 'Terragrunt Integration', 'Policy as Code with Sentinel'],
    trend: 'Growing'
  }
];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Admin Metrics', icon: <Layout size={20} />, roles: ['admin'] },
  { id: 'instructor', label: 'Course Control', icon: <UserPlus size={20} />, roles: ['admin'] },
  { id: 'courses', label: 'Browse Catalog', icon: <BookOpen size={20} />, roles: ['student'] },
  { id: 'my-learning', label: 'My Learning', icon: <GraduationCap size={20} />, roles: ['student'] },
  { id: 'chat', label: 'Broadcasts', icon: <MessageSquare size={20} />, roles: ['admin', 'student'] },
];

export const PROJECT_PHASES: Phase[] = [
  {
    id: 1,
    title: 'Platform Foundation',
    status: 'completed',
    description: 'Core microservice architecture and deployment strategy.',
    tasks: ['Dockerize FastAPI app', 'EKS Cluster setup', 'RDS Configuration']
  }
];
