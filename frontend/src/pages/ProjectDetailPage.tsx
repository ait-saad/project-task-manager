import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProject, getTasks, createTask, updateTask, toggleTask, deleteTask } from '../services/api';
import { Project, Task } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import SkeletonLoader from '../components/SkeletonLoader';
import TaskCheckbox from '../components/TaskCheckbox';
import DebugPanel from '../components/DebugPanel';
import { ArrowLeftIcon, PlusIcon, EditIcon, TrashIcon, CalendarIcon, CheckIcon } from '../components/Icons';
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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [debugVisible, setDebugVisible] = useState(false);

  useEffect(() => {
    if (id) {
      loadProjectData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setSaving(true);
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
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    setSaving(true);
    try {
      const updated = await updateTask(Number(id), editingTask.id, {
        title,
        description,
        dueDate: dueDate || null,
      });
      setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
      closeModal();
      loadProjectData();
    } catch (err) {
      setError('Failed to update task');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleTask = async (taskId: number) => {
    try {
      console.log('Toggling task:', { projectId: id, taskId });

      // Optimistic update for better UX
      setTasks(tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ));

      const updated = await toggleTask(Number(id), taskId);
      console.log('Toggle response:', updated);

      // Update with server response
      setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));

      // Reload project data to update progress
      await loadProjectData();

      // Clear any previous errors
      setError('');
    } catch (err: any) {
      console.error('Toggle task error:', err);

      // Revert optimistic update
      setTasks(tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ));

      // Show detailed error message
      const errorMessage = err.response?.data?.message ||
                          err.response?.data?.error ||
                          err.message ||
                          'Failed to update task. Please try again.';
      setError(errorMessage);
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
    return (
      <div className="detail-container">
        <header className="detail-header">
          <div className="skeleton skeleton-rect" style={{ width: '160px', height: '2.5rem', borderRadius: '8px' }} />
        </header>

        <div className="project-info">
          <div className="skeleton skeleton-text" style={{ width: '60%', height: '2rem', marginBottom: '1rem' }} />
          <div className="skeleton skeleton-text" style={{ width: '100%', height: '1rem', marginBottom: '0.5rem' }} />
          <div className="skeleton skeleton-text" style={{ width: '80%', height: '1rem', marginBottom: '2rem' }} />

          <div className="progress-section">
            <div className="progress-info">
              <div className="skeleton skeleton-text" style={{ width: '200px', height: '0.875rem' }} />
              <div className="skeleton skeleton-text" style={{ width: '40px', height: '0.875rem' }} />
            </div>
            <div className="skeleton skeleton-rect" style={{ width: '100%', height: '8px', borderRadius: '4px' }} />
          </div>
        </div>

        <div className="tasks-section">
          <div className="tasks-header">
            <div className="skeleton skeleton-text" style={{ width: '100px', height: '1.5rem' }} />
            <div className="skeleton skeleton-rect" style={{ width: '120px', height: '2.5rem', borderRadius: '8px' }} />
          </div>

          <div className="skeleton-list">
            <SkeletonLoader variant="task-item" count={4} />
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return <div className="error-page">Project not found</div>;
  }

  return (
    <div className="detail-container">
      <header className="detail-header">
        <button className="back-button" onClick={() => navigate('/projects')}>
          <ArrowLeftIcon size={16} />
          Back to Projects
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
            <PlusIcon size={16} />
            Add Task
          </button>
        </div>

        <div className="tasks-list">
          {tasks.map((task) => (
            <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <div className="task-checkbox-wrapper">
                <TaskCheckbox
                  checked={task.completed}
                  onChange={() => handleToggleTask(task.id)}
                  size="medium"
                  disabled={saving}
                />
              </div>
              <div className="task-content">
                <h3>{task.title}</h3>
                {task.description && <p>{task.description}</p>}
                {task.dueDate && (
                  <span className="due-date">
                    <CalendarIcon size={12} />
                    Due: {formatDate(task.dueDate)}
                  </span>
                )}
              </div>
              <div className="task-actions">
                <button className="edit-button" onClick={() => openEditModal(task)}>
                  <EditIcon size={14} />
                  Edit
                </button>
                <button className="delete-button" onClick={() => handleDeleteTask(task.id)}>
                  <TrashIcon size={14} />
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
                <button type="submit" className="primary" disabled={saving}>
                  {saving ? (
                    <>
                      <LoadingSpinner size="small" variant="white" />
                      {editingTask ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingTask ? 'Update' : 'Create'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Debug Panel - only visible in development */}
      <DebugPanel
        isVisible={debugVisible}
        onToggle={() => setDebugVisible(!debugVisible)}
      />
    </div>
  );
};

export default ProjectDetailPage;
