import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProject, getTasks, createTask, updateTask, toggleTask, deleteTask } from '../services/api';
import { Project, Task } from '../types';
import './ProjectDetailPage.css';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadProjectData();
    }
  }, [id]);

  const loadProjectData = async () => {
    try {
      const [projectData, tasksData] = await Promise.all([
        getProject(Number(id)),
        getTasks(Number(id)),
      ]);
      setProject(projectData);
      setTasks(tasksData);
    } catch (err) {
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newTask = await createTask(Number(id), {
        title,
        description,
        dueDate: dueDate || null,
      });
      setTasks([...tasks, newTask]);
      closeModal();
      loadProjectData();
    } catch (err) {
      setError('Failed to create task');
    }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    try {
      const updated = await updateTask(Number(id), editingTask.id, {
        title,
        description,
        dueDate: dueDate || null,
      });
      setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
      closeModal();
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleToggleTask = async (taskId: number) => {
    try {
      const updated = await toggleTask(Number(id), taskId);
      setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
      loadProjectData();
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(Number(id), taskId);
        setTasks(tasks.filter((t) => t.id !== taskId));
        loadProjectData();
      } catch (err) {
        setError('Failed to delete task');
      }
    }
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setDueDate('');
    setShowModal(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || '');
    setDueDate(task.dueDate || '');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setDueDate('');
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!project) {
    return <div className="error-page">Project not found</div>;
  }

  return (
    <div className="detail-container">
      <header className="detail-header">
        <button className="back-button" onClick={() => navigate('/projects')}>
          &larr; Back to Projects
        </button>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="project-info">
        <h1>{project.title}</h1>
        {project.description && <p>{project.description}</p>}

        <div className="progress-section">
          <div className="progress-info">
            <span>Progress: {project.completedTasks} / {project.totalTasks} tasks completed</span>
            <span>{project.progressPercentage.toFixed(0)}%</span>
          </div>
          <div className="progress-bar large">
            <div
              className="progress-fill"
              style={{ width: `${project.progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="tasks-section">
        <div className="tasks-header">
          <h2>Tasks</h2>
          <button className="create-button" onClick={openCreateModal}>
            + Add Task
          </button>
        </div>

        <div className="tasks-list">
          {tasks.map((task) => (
            <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <div className="task-checkbox">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task.id)}
                />
              </div>
              <div className="task-content">
                <h3>{task.title}</h3>
                {task.description && <p>{task.description}</p>}
                {task.dueDate && (
                  <span className="due-date">Due: {formatDate(task.dueDate)}</span>
                )}
              </div>
              <div className="task-actions">
                <button className="edit-button" onClick={() => openEditModal(task)}>
                  Edit
                </button>
                <button className="delete-button" onClick={() => handleDeleteTask(task.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="empty-tasks">
              <p>No tasks yet. Add your first task!</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingTask ? 'Edit Task' : 'Add New Task'}</h2>
            <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Task title"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Task description (optional)"
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="primary">
                  {editingTask ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailPage;
