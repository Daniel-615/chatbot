import { useEffect, useState } from "react";
import "./App.css";
import "./logs.css";
import { useNavigate } from "react-router-dom";

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [logsIA, setLogsIA] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("backend");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const itemsPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    setCurrentPage(1);
  }, [view, searchTerm, filterType, sortOrder]);

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

  let processedData = data.filter((log) => {
    // Filtrado por tipo (humano, ia, etc.)
    if (filterType !== "all") {
      const msg = safeJSON(log.message);
      const type = view === "ia" ? getType(msg) : "system";
      if (type !== filterType) return false;
    }

    // Búsqueda por texto
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    
    if (log.id && String(log.id).includes(term)) return true;
    
    if (log.session_id && String(log.session_id).toLowerCase().includes(term)) return true;
    if (log.sessionId && String(log.sessionId).toLowerCase().includes(term)) return true;
    
    const msg = safeJSON(log.message);
    const content = getContent(msg).toLowerCase();
    if (content.includes(term)) return true;

    if (view === "backend" && log.response) {
      const respStr = JSON.stringify(log.response).toLowerCase();
      if (respStr.includes(term)) return true;
    }
    
    return false;
  });

  // Ordenamiento
  processedData.sort((a, b) => {
    if (sortOrder === "asc") {
      return a.id - b.id;
    } else {
      return b.id - a.id;
    }
  });

  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = processedData.slice(startIndex, startIndex + itemsPerPage);

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

          {/* CONTROLS (SWITCH & SEARCH) */}
          <div className="logs-controls">
            <div className="logs-view-switch" style={{ marginBottom: 0 }}>
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

            <div className="logs-search-wrapper">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Buscar por ID, sesión o contenido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="logs-filters">
              {view === "ia" && (
                <select 
                  className="logs-select"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">Todos los tipos</option>
                  <option value="human">Usuario (Human)</option>
                  <option value="ai">Asistente (AI)</option>
                  <option value="tool">Herramienta (Tool)</option>
                </select>
              )}
              
              <select 
                className="logs-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="desc">Más recientes primero (Descendente)</option>
                <option value="asc">Más antiguos primero (Ascendente)</option>
              </select>
            </div>
          </div>

          {/* LISTA */}
          <div className="logs-container">
            {loading ? (
              <div className="logs-loading">
                <p>Cargando registros...</p>
              </div>
            ) : processedData.length === 0 ? (
              <div className="logs-empty">
                <div className="empty-icon">
                  <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#1e3a5f" strokeWidth="1.6">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                  </svg>
                </div>
                <p>{data.length === 0 ? "No hay registros disponibles" : "No se encontraron resultados para la búsqueda"}</p>
              </div>
            ) : (
              <>
                <div className="logs-list">
                  {paginatedData.map((log) => {
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
                
                {totalPages > 1 && (
                  <div className="logs-pagination">
                    <button 
                      className="pagination-btn" 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </button>
                    <div className="pagination-info">
                      <span>Página</span>
                      <input 
                        type="number" 
                        min="1" 
                        max={totalPages} 
                        value={currentPage}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val)) {
                            setCurrentPage(Math.min(Math.max(1, val), totalPages));
                          }
                        }}
                        className="pagination-input"
                      />
                      <span>de {totalPages}</span>
                    </div>
                    <button 
                      className="pagination-btn" 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </>
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
