import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProjects, createProject, deleteProject } from '../services/api';
import { Project } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import SkeletonLoader from '../components/SkeletonLoader';
import { PlusIcon, TrashIcon, LogOutIcon, UserIcon, FolderIcon, GridIcon } from '../components/Icons';
import StatusBadge from '../components/StatusBadge';
import ProgressRing from '../components/ProgressRing';
import './ProjectsPage.css';

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(projects.length / pageSize));
  const pagedProjects = projects.slice((page - 1) * pageSize, page * pageSize);
  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const newProject = await createProject({ title, description });
      setProjects([...projects, newProject]);
      setShowModal(false);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError('Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        setProjects(projects.filter((p) => p.id !== id));
      } catch (err) {
        setError('Failed to delete project');
      }
    }
  };

  if (loading) {
    return (
      <div className="projects-container">
        <header className="header">
          <div className="skeleton skeleton-text" style={{ width: '200px', height: '2rem' }} />
          <div className="header-right">
            <div className="skeleton skeleton-rect" style={{ width: '80px', height: '2rem', borderRadius: '6px' }} />
            <div className="skeleton skeleton-rect" style={{ width: '120px', height: '2rem', borderRadius: '8px' }} />
            <div className="skeleton skeleton-text" style={{ width: '100px', height: '1rem' }} />
            <div className="skeleton skeleton-rect" style={{ width: '80px', height: '2rem', borderRadius: '8px' }} />
          </div>
        </header>

        <div className="projects-header">
          <div className="skeleton skeleton-text" style={{ width: '150px', height: '1.5rem' }} />
          <div className="projects-header-actions">
            <div className="skeleton skeleton-rect" style={{ width: '120px', height: '2rem', borderRadius: '6px' }} />
            <div className="skeleton skeleton-rect" style={{ width: '140px', height: '2rem', borderRadius: '8px' }} />
          </div>
        </div>

        <div className="skeleton-grid">
          <SkeletonLoader variant="project-card" count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="projects-container">
      <header className="header">
        <div className="header-left">
          <FolderIcon size={24} className="header-icon" />
          <h1>My Projects</h1>
        </div>
        <div className="header-right">
          <a className="link-button" href="/tasks">
            <GridIcon size={16} />
            All Tasks
          </a>
          <button className="primary-button" onClick={() => setShowModal(true)}>
            <PlusIcon size={16} />
            New Project
          </button>
          <div className="user-info">
            <UserIcon size={16} />
            <span className="user-name">{user?.name}</span>
          </div>
          <button
            className="logout-button"
            onClick={() => {
              logout();
              // reliable redirect out of the app
              window.location.href = '/login';
            }}
          >
            <LogOutIcon size={16} />
            Logout
          </button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="projects-header">
        <h2>{projects.length} Project{projects.length !== 1 ? 's' : ''}</h2>
        <div className="projects-header-actions">
          <label>
            Page size:
            <select value={pageSize} onChange={(e) => { setPageSize(parseInt(e.target.value) || 6); setPage(1); }}>
              <option value={6}>6</option>
              <option value={9}>9</option>
              <option value={12}>12</option>
            </select>
          </label>
          <button className="create-button" onClick={() => setShowModal(true)}>
            <PlusIcon size={16} />
            New Project
          </button>
        </div>
      </div>

      <div className="projects-grid stagger-children">
        {pagedProjects.map((project, index) => (
          <div
            key={project.id}
            className="project-card"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            <div className="project-card-header">
              <h3>{project.title}</h3>
              <button
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteProject(project.id);
                }}
              >
                <TrashIcon size={14} />
                Delete
              </button>
            </div>
            <p className="project-description">
              {project.description || 'No description'}
            </p>
            <div className="project-stats">
              <div className="task-count">
                <span className="tasks-completed">{project.completedTasks}</span>
                <span className="tasks-separator">/</span>
                <span className="tasks-total">{project.totalTasks}</span>
                <span className="tasks-label">tasks</span>
              </div>
              <StatusBadge
                status={
                  project.progressPercentage === 100 ? 'completed' :
                  project.progressPercentage > 0 ? 'in-progress' :
                  'not-started'
                }
                size="small"
              />
            </div>
            <div className="progress-section">
              <ProgressRing
                progress={project.progressPercentage}
                size={60}
                strokeWidth={6}
                color={
                  project.progressPercentage === 100 ? '#10b981' :
                  project.progressPercentage > 0 ? '#2563eb' :
                  '#94a3b8'
                }
                showPercentage={true}
                animated={true}
              />
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${project.progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="empty-state">
            <p>No projects yet. Create your first project!</p>
          </div>
        )}
      </div>

      <div className="pagination">
        <button disabled={page === 1} onClick={goPrev}>Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={goNext}>Next</button>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Project</h2>
            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Project title"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Project description (optional)"
                  rows={3}
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary" disabled={creating}>
                  {creating ? (
                    <>
                      <LoadingSpinner size="small" variant="white" />
                      Creating...
                    </>
                  ) : (
                    'Create'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
