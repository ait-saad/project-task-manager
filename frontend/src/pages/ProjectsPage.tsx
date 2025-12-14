import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProjects, createProject, deleteProject } from '../services/api';
import { Project } from '../types';
import './ProjectsPage.css';

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
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
    try {
      const newProject = await createProject({ title, description });
      setProjects([...projects, newProject]);
      setShowModal(false);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError('Failed to create project');
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
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="projects-container">
      <header className="header">
        <h1>My Projects</h1>
        <div className="header-right">
          <a className="link-button" href="/tasks">All Tasks</a>
          <button className="primary-button" onClick={() => setShowModal(true)}>+ New Project</button>
          <span className="user-name">{user?.name}</span>
          <button
            className="logout-button"
            onClick={() => {
              logout();
              // reliable redirect out of the app
              window.location.href = '/login';
            }}
          >
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
            + New Project
          </button>
        </div>
      </div>

      <div className="projects-grid">
        {pagedProjects.map((project) => (
          <div
            key={project.id}
            className="project-card"
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
                Delete
              </button>
            </div>
            <p className="project-description">
              {project.description || 'No description'}
            </p>
            <div className="progress-section">
              <div className="progress-info">
                <span>{project.completedTasks} / {project.totalTasks} tasks</span>
                <span>{project.progressPercentage.toFixed(0)}%</span>
              </div>
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
                <button type="submit" className="primary">
                  Create
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
