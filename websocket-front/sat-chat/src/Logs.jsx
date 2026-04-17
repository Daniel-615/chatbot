import { useEffect, useState } from "react";
import "./logs.css";

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/logs")
      .then((res) => res.json())
      .then((data) => {
        const sorted = (data.data || []).sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );

        setLogs(sorted);
        setLoading(false);
      })
      .catch(() => {
        setLogs([]);
        setLoading(false);
      });
  }, []);

  const formatResponse = (response) => {
    if (!response) return "Sin respuesta";

    if (typeof response === "string") {
      try {
        const parsed = JSON.parse(response);
        return JSON.stringify(parsed, null, 2);
      } catch {
        return response;
      }
    }

    return JSON.stringify(response, null, 2);
  };

  return (
    <div className="logs-container">
      <div className="logs-wrapper">
        <header className="logs-header">
          <div className="logs-header-icon">📄</div>
          <div>
            <h1>Logs de N8N</h1>
            <p>Monitorea las interacciones del sistema</p>
          </div>
        </header>

        <div className="logs-stats">
          <div className="stat-card">
            <span className="stat-label">Total Logs</span>
            <span className="stat-value">{logs.length}</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Último registro</span>
            <span className="stat-value highlight">
              {logs.length > 0
                ? new Date(logs[0].createdAt).toLocaleTimeString()
                : "--:--"}
            </span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Estado</span>
            <div className="status-indicator">
              <span className="status-dot"></span>
              <span className="stat-value highlight">Activo</span>
            </div>
          </div>
        </div>

        <div className="logs-list">
          {loading ? (
            <div className="logs-loading">
              <div className="spinner"></div>
            </div>
          ) : logs.length === 0 ? (
            <div className="logs-empty">
              <p>No hay logs disponibles</p>
              <span>Los registros aparecerán aquí</span>
            </div>
          ) : (
            logs.map((log, index) => (
              <article key={log.id} className="log-card">
                <div className="log-card-header">
                  <div className="log-badges">
                    <span className="badge badge-id">#{log.id}</span>
                    {index === 0 && (
                      <span className="badge badge-recent">
                        Más reciente
                      </span>
                    )}
                  </div>

                  <time className="log-time">
                    {new Date(log.createdAt).toLocaleString()}
                  </time>
                </div>

                <div className="log-card-body">
                  <div className="log-field">
                    <label>Mensaje</label>
                    <p>{log.message}</p>
                  </div>

                  <div className="log-field">
                    <label>Respuesta</label>
                    <pre>{formatResponse(log.response)}</pre>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}