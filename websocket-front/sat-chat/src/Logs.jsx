import { useEffect, useState } from "react";
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

      {/* HEADER */}
      <header className="sat-header">
        <div className="header-content">

          <div className="logo-section">
            <div className="sat-logo">
              <span className="logo-title">SAT</span>
            </div>
          </div>

          <nav className="header-nav">
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                padding: 10,
                background: "#235B4E",
                color: "white",
                border: "none",
                cursor: "pointer"
              }}
            >
              Ir al Dashboard
            </button>
            <button className="nav-btn" onClick={() => navigate("/")}>
              Volver al Chat
            </button>
          </nav>

        </div>
      </header>

      {/* MAIN */}
      <main className="sat-main">
        <div className="logs-wrapper">

          <div className="page-title-section">
            <h1>Registro de Actividad</h1>
          </div>

          {/* SWITCH */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <button
              onClick={() => setView("backend")}
              style={{
                padding: 10,
                background: view === "backend" ? "#235B4E" : "#ddd",
                color: view === "backend" ? "white" : "black",
                border: "none",
                cursor: "pointer"
              }}
            >
              Backend ({logs.length})
            </button>

            <button
              onClick={() => setView("ia")}
              style={{
                padding: 10,
                background: view === "ia" ? "#235B4E" : "#ddd",
                color: view === "ia" ? "white" : "black",
                border: "none",
                cursor: "pointer"
              }}
            >
              IA ({logsIA.length})
            </button>
          </div>

          {/* LISTA */}
          <div className="logs-container">

            {loading ? (
              <p>Cargando...</p>
            ) : data.length === 0 ? (
              <p>No hay logs</p>
            ) : (
              <div className="logs-list">

                {data.map((log) => {
                  const msg = safeJSON(log.message);
                  const type = view === "ia" ? getType(msg) : "system";

                  return (
                    <article key={log.id} className="log-card">

                      {/* HEADER CARD */}
                      <div className="log-card-header">

                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

                          <img
                            src={view === "ia" ? getAvatar(type) : "/vegetta.webp"}
                            alt="avatar"
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: "50%",
                              objectFit: "cover"
                            }}
                          />

                          <span>ID: {log.id}</span>

                          {view === "ia" && (
                            <span style={{ opacity: 0.7 }}>
                              Type: {type}
                            </span>
                          )}

                          {view === "backend" && (
                            <span style={{ opacity: 0.7 }}>
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

    </div>
  );
}