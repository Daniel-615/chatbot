import { useEffect, useState } from "react";
import "./App.css";
import "./logs.css";
import { useNavigate } from "react-router-dom";

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [logsIA, setLogsIA] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("backend");

  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3000/api/logs").then((r) => r.json()),
      fetch("http://localhost:3000/api/ia-logs").then((r) => r.json())
    ])
      .then(([backend, ia]) => {
        setLogs(backend.data || []);
        setLogsIA(ia.data || []);
        setLoading(false);
      })
      .catch(() => {
        setLogs([]);
        setLogsIA([]);
        setLoading(false);
      });
  }, []);

  const safeJSON = (value) => {
    if (!value) return null;

    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }

    return value;
  };

  const getType = (msg) => {
    if (!msg) return "unknown";
    if (typeof msg === "object" && msg.type) return msg.type;
    return "unknown";
  };

  const getContent = (msg) => {
    if (!msg) return "Sin contenido";

    if (typeof msg === "string") return msg;

    if (typeof msg === "object") {
      return msg.content ?? JSON.stringify(msg, null, 2);
    }

    return String(msg);
  };

  const getAvatar = (type) => {
    if (type === "human") return "/vegetta.webp";
    if (type === "ai") return "/gemini.webp";
    if (type === "tool") return "/docs.webp";
    return "/vegetta.webp";
  };

  const data = view === "backend" ? logs : logsIA;

  return (
    <div className="sat-page">
      {/* Barra superior gubernamental */}
      <div className="sat-gov-bar">
        <div className="sat-gov-bar-content">
          <div className="sat-gov-bar-left">
            Gobierno de la República de Guatemala
          </div>
          <div className="sat-gov-bar-right">
            <span>
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              1550 Asistencia
            </span>
            <span>
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              consultas@sat.gob.gt
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Bar (Official SAT Style) */}
      <header className="sat-official-nav">
        <div className="sat-nav-content">
          <div className="sat-logo-full">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="sat-logo-icon">
              <path d="M20 4 L34 11 V21 C34 28 27.5 33.5 20 36 C12.5 33.5 6 28 6 21 V11 Z" fill="#ffffff" fillOpacity="0.95"/>
              <path d="M13 20 L18 25 L28 14" stroke="#1e3a5f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M11 29 H29" stroke="#c79a3a" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <div className="sat-logo-text">
              <span className="sat-wordmark">SAT</span>
              <span className="sat-submark">SUPERINTENDENCIA DE ADMINISTRACION TRIBUTARIA</span>
            </div>
          </div>
          <nav className="sat-nav-links-official">
            <a href="#">Servicios Tributarios</a>
            <a href="#">Aduanas</a>
            <a href="#">Capacitación</a>
            <a href="#">Contáctanos</a>
            <button className="btn-admin" onClick={() => navigate("/dashboard")}>Ir al Dashboard</button>
            <button className="btn-admin" onClick={() => navigate("/")}>Volver al Chat</button>
          </nav>
        </div>
      </header>

      {/* MAIN */}
      <main className="sat-hero" style={{ padding: "80px 24px", alignItems: "flex-start" }}>
        <div className="logs-wrapper">
          <div className="page-title-section">
            <h1>Registro de Actividad</h1>
          </div>

          {/* SWITCH */}
          <div className="logs-view-switch">
            <button
              type="button"
              onClick={() => setView("backend")}
              className={`logs-view-btn ${view === "backend" ? "active" : ""}`}
            >
              Backend
              <span className="count-badge">{logs.length}</span>
            </button>

            <button
              type="button"
              onClick={() => setView("ia")}
              className={`logs-view-btn ${view === "ia" ? "active" : ""}`}
            >
              IA
              <span className="count-badge">{logsIA.length}</span>
            </button>
          </div>

          {/* LISTA */}
          <div className="logs-container">
            {loading ? (
              <div className="logs-loading">
                <p>Cargando registros...</p>
              </div>
            ) : data.length === 0 ? (
              <div className="logs-empty">
                <div className="empty-icon">
                  <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#1e3a5f" strokeWidth="1.6">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                  </svg>
                </div>
                <p>No hay registros disponibles</p>
              </div>
            ) : (
              <div className="logs-list">
                {data.map((log) => {
                  const msg = safeJSON(log.message);
                  const type = view === "ia" ? getType(msg) : "system";

                  return (
                    <article key={log.id} className="log-card">
                      {/* HEADER CARD */}
                      <div className="log-card-header">
                        <div className="log-card-meta">
                          <img
                            src={view === "ia" ? getAvatar(type) : "/vegetta.webp"}
                            alt="avatar"
                            className="log-avatar"
                          />

                          <span className="log-badge id">ID: {log.id}</span>

                          {view === "ia" && (
                            <span className={`log-badge type-${type}`}>
                              {type}
                            </span>
                          )}

                          {view === "backend" && log.session_id && (
                            <span className="log-badge session">
                              Session: {log.session_id}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* BODY */}
                      <div className="log-card-body">
                        <div className="log-field">
                          <label>Mensaje</label>
                          <pre>
                            {view === "ia"
                              ? getContent(msg)
                              : JSON.stringify(log.message, null, 2)}
                          </pre>
                        </div>

                        {view === "backend" && (
                          <div className="log-field">
                            <label>Respuesta</label>
                            <pre>
                              {log.response
                                ? JSON.stringify(log.response, null, 2)
                                : "Sin respuesta"}
                            </pre>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="sat-footer">
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-links">
              <a href="#">Aviso de privacidad</a>
              <span className="divider">|</span>
              <a href="#">Términos y condiciones</a>
            </div>
            <p className="footer-copyright">
              &copy; Superintendencia de Administración Tributaria
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
