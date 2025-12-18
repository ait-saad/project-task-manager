import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskWithProject } from '../types';
import { getAllTasks } from '../services/api';
import './AllTasksPage.css';

const AllTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<TaskWithProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getAllTasks();
        setTasks(data);
      } catch (e) {
        setError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleTaskClick = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };

  const handleDashboardClick = () => {
    navigate('/projects');
  };

  return (
    <div className="detail-container">
      <header className="detail-header">
        <div className="header-left">
          <button
            className="dashboard-btn"
            onClick={handleDashboardClick}
            title="Back to Dashboard"
          >
            ← Dashboard
          </button>
          <h1>All Tasks</h1>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="tasks-list">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`task-item ${task.completed ? 'completed' : ''} clickable`}
              onClick={() => handleTaskClick(task.projectId)}
              title={`Go to project: ${task.projectTitle}`}
            >
              <div className="task-content">
                <h3>{task.title}</h3>
                {task.description && <p>{task.description}</p>}
                <div className="task-meta">
                  <span className="project-name">📁 {task.projectTitle}</span>
                  {task.dueDate && (
                    <span className="due-date">Due: {formatDate(task.dueDate)}</span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="empty-tasks">
              <p>No tasks yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AllTasksPage;
