export interface User {
  email: string;
  name: string;
  token: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  totalTasks: number;
  completedTasks: number;
  progressPercentage: number;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string | null;
  completed: boolean;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'DONE';
  createdAt: string;
}

export interface TaskWithProject extends Task {
  projectId: number;
  projectTitle: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ProjectRequest {
  title: string;
  description: string;
}

export interface TaskRequest {
  title: string;
  description: string;
  dueDate: string | null;
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'DONE';
}
