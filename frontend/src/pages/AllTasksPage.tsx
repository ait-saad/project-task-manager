import React, { useEffect, useState } from 'react';
import { Task } from '../types';
import { getAllTasks } from '../services/api';

const AllTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <div className="detail-container">
      <header className="detail-header">
        <h1>All Tasks</h1>
      </header>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="tasks-list">
          {tasks.map((task) => (
            <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <div className="task-content">
                <h3>{task.title}</h3>
                {task.description && <p>{task.description}</p>}
                {task.dueDate && (
                  <span className="due-date">Due: {formatDate(task.dueDate)}</span>
                )}
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
