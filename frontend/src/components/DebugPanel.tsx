import React, { useState, useEffect } from 'react';
import './DebugPanel.css';

interface DebugPanelProps {
  isVisible: boolean;
  onToggle: () => void;
}

interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error';
  message: string;
  data?: any;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ isVisible, onToggle }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    // Capture console logs
    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error
    };

    const addLog = (level: 'info' | 'warn' | 'error', message: string, data?: any) => {
      const logEntry: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date(),
        level,
        message,
        data
      };
      setLogs(prev => [logEntry, ...prev.slice(0, 99)]);
    };

    console.log = (...args: any[]) => {
      originalConsole.log(...args);
      addLog('info', args.join(' '), args.length > 1 ? args.slice(1) : undefined);
    };

    console.warn = (...args: any[]) => {
      originalConsole.warn(...args);
      addLog('warn', args.join(' '), args.length > 1 ? args.slice(1) : undefined);
    };

    console.error = (...args: any[]) => {
      originalConsole.error(...args);
      addLog('error', args.join(' '), args.length > 1 ? args.slice(1) : undefined);
    };

    return () => {
      console.log = originalConsole.log;
      console.warn = originalConsole.warn;
      console.error = originalConsole.error;
    };
  }, []);

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    return log.level === filter;
  });

  const clearLogs = () => {
    setLogs([]);
  };

  const exportLogs = () => {
    const logData = JSON.stringify(logs, null, 2);
    const blob = new Blob([logData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `debug-logs-${new Date().toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const checkApiConnection = async () => {
    try {
      const response = await fetch('/api/actuator/health');
      console.log('API Health Check:', response.status, await response.json());
    } catch (error) {
      console.error('API Health Check Failed:', error);
    }
  };

  if (!isVisible) {
    return (
      <button
        className="debug-toggle debug-toggle-hidden"
        onClick={onToggle}
        title="Open Debug Panel"
      >
        🐛
      </button>
    );
  }

  return (
    <div className="debug-panel">
      <div className="debug-header">
        <h3>Debug Panel</h3>
        <div className="debug-actions">
          <button onClick={checkApiConnection} className="debug-btn">
            Test API
          </button>
          <button onClick={clearLogs} className="debug-btn">
            Clear
          </button>
          <button onClick={exportLogs} className="debug-btn">
            Export
          </button>
          <button onClick={onToggle} className="debug-close">
            ✕
          </button>
        </div>
      </div>

      <div className="debug-filters">
        <label>
          <input
            type="radio"
            value="all"
            checked={filter === 'all'}
            onChange={(e) => setFilter(e.target.value)}
          />
          All ({logs.length})
        </label>
        <label>
          <input
            type="radio"
            value="info"
            checked={filter === 'info'}
            onChange={(e) => setFilter(e.target.value)}
          />
          Info ({logs.filter(l => l.level === 'info').length})
        </label>
        <label>
          <input
            type="radio"
            value="warn"
            checked={filter === 'warn'}
            onChange={(e) => setFilter(e.target.value)}
          />
          Warn ({logs.filter(l => l.level === 'warn').length})
        </label>
        <label>
          <input
            type="radio"
            value="error"
            checked={filter === 'error'}
            onChange={(e) => setFilter(e.target.value)}
          />
          Error ({logs.filter(l => l.level === 'error').length})
        </label>
      </div>

      <div className="debug-logs">
        {filteredLogs.map((log) => (
          <div key={log.id} className={`debug-log debug-log-${log.level}`}>
            <div className="debug-log-header">
              <span className="debug-timestamp">
                {log.timestamp.toLocaleTimeString()}
              </span>
              <span className={`debug-level debug-level-${log.level}`}>
                {log.level.toUpperCase()}
              </span>
            </div>
            <div className="debug-message">{log.message}</div>
            {log.data && (
              <details className="debug-data">
                <summary>Data</summary>
                <pre>{JSON.stringify(log.data, null, 2)}</pre>
              </details>
            )}
          </div>
        ))}

        {filteredLogs.length === 0 && (
          <div className="debug-empty">
            No logs to display
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugPanel;