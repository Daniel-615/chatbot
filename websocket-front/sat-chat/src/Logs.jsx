import { useEffect, useState } from "react";
import "./logs.css";
import { useNavigate } from "react-router-dom";

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/logs")
      .then((res) => res.json())
      .then((data) => {
        const sorted = (data.data || []).sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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
    <div className="sat-page">

      {/* Header */}
      <header className="sat-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="sat-logo">
              <div className="logo-icon">
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="40" height="40" rx="4" fill="#235B4E"/>
                  <path d="M10 20L15 25L30 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 30H32" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="logo-text">
                <span className="logo-title">SAT</span>
                <span className="logo-subtitle">Servicio de Administración Tributaria</span>
              </div>
            </div>
          </div>
          <nav className="header-nav">
            <button className="nav-btn" onClick={() => navigate("/")}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m12 19-7-7 7-7"/>
                <path d="M19 12H5"/>
              </svg>
              Volver al Chat
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="sat-main">
        <div className="logs-wrapper">
          {/* Page Title */}
          <div className="page-title-section">
            <div className="page-icon">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <div className="page-title-text">
              <h1>Registro de Actividad</h1>
              <p>Historial de consultas y respuestas del sistema</p>
            </div>
          </div>

          {/* Stats */}
          <div className="logs-stats">
            <div className="stat-card">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                </svg>
              </div>
              <div className="stat-info">
                <span className="stat-label">Total de Registros</span>
                <span className="stat-value">{logs.length}</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
              </div>
              <div className="stat-info">
                <span className="stat-label">Última Actividad</span>
                <span className="stat-value highlight">
                  {logs.length > 0
                    ? new Date(logs[0].createdAt).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })
                    : "--:--"}
                </span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon online">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22,4 12,14.01 9,11.01"/>
                </svg>
              </div>
              <div className="stat-info">
                <span className="stat-label">Estado del Sistema</span>
                <span className="stat-value highlight online">Activo</span>
              </div>
            </div>
          </div>

          {/* Logs List */}
          <div className="logs-container">
            {loading ? (
              <div className="logs-loading">
                <div className="spinner"></div>
                <p>Cargando registros...</p>
              </div>
            ) : logs.length === 0 ? (
              <div className="logs-empty">
                <div className="empty-icon">
                  <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#235B4E" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                  </svg>
                </div>
                <h3>Sin registros disponibles</h3>
                <p>Los registros de actividad aparecerán aquí</p>
              </div>
            ) : (
              <div className="logs-list">
                {logs.map((log, index) => (
                  <article key={log.id} className="log-card">
                    <div className="log-card-header">
                      <div className="log-badges">
                        <span className="badge badge-id">ID: {log.id}</span>
                        {index === 0 && (
                          <span className="badge badge-recent">Más reciente</span>
                        )}
                      </div>
                      <time className="log-time">
                        {new Date(log.createdAt).toLocaleString("es-MX")}
                      </time>
                    </div>

                    <div className="log-card-body">
                      <div className="log-field">
                        <label>
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                          </svg>
                          Consulta del Usuario
                        </label>
                        <p>{log.message}</p>
                      </div>

                      <div className="log-field">
                        <label>
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="10" rx="2"/>
                            <circle cx="12" cy="5" r="3"/>
                          </svg>
                          Respuesta del Sistema
                        </label>
                        <pre>{formatResponse(log.response)}</pre>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="sat-footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="#">Aviso de privacidad</a>
            <span className="divider">|</span>
            <a href="#">Términos y condiciones</a>
            <span className="divider">|</span>
            <a href="#">Mapa del sitio</a>
          </div>
          <p className="footer-copyright">
            Servicio de Administración Tributaria - Todos los derechos reservados
          </p>
        </div>
      </footer>
    </div>
  );
}
