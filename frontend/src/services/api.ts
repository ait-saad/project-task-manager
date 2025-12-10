import axios from 'axios';
import { LoginRequest, ProjectRequest, TaskRequest, Project, Task } from '../types';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = async (data: LoginRequest) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

// Projects
export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get('/projects');
  return response.data;
};

export const getProject = async (id: number): Promise<Project> => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

export const createProject = async (data: ProjectRequest): Promise<Project> => {
  const response = await api.post('/projects', data);
  return response.data;
};

export const updateProject = async (id: number, data: ProjectRequest): Promise<Project> => {
  const response = await api.put(`/projects/${id}`, data);
  return response.data;
};

export const deleteProject = async (id: number): Promise<void> => {
  await api.delete(`/projects/${id}`);
};

// Tasks
export const getTasks = async (projectId: number): Promise<Task[]> => {
  const response = await api.get(`/projects/${projectId}/tasks`);
  return response.data;
};

export const createTask = async (projectId: number, data: TaskRequest): Promise<Task> => {
  const response = await api.post(`/projects/${projectId}/tasks`, data);
  return response.data;
};

export const updateTask = async (projectId: number, taskId: number, data: TaskRequest): Promise<Task> => {
  const response = await api.put(`/projects/${projectId}/tasks/${taskId}`, data);
  return response.data;
};

export const toggleTask = async (projectId: number, taskId: number): Promise<Task> => {
  const response = await api.patch(`/projects/${projectId}/tasks/${taskId}/toggle`);
  return response.data;
};

export const deleteTask = async (projectId: number, taskId: number): Promise<void> => {
  await api.delete(`/projects/${projectId}/tasks/${taskId}`);
};
