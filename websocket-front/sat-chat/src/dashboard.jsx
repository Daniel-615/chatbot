import { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

import "./App.css";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [iaLogs, setIaLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3000/api/logs").then((r) => r.json()),
      fetch("http://localhost:3000/api/ia-logs").then((r) => r.json()),
    ])
      .then(([backend, ia]) => {
        setLogs(backend.data || []);
        setIaLogs(ia.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const typeDistribution = useMemo(() => {
    const counts = { human: 0, ai: 0, tool: 0, unknown: 0 };

    iaLogs.forEach((log) => {
      const type = log.message?.type;
      if (counts[type] !== undefined) counts[type]++;
      else counts.unknown++;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [iaLogs]);

  const sessionsCount = useMemo(() => {
    const map = {};

    logs.forEach((l) => {
      const session = l.session || "sesiones";
      map[session] = (map[session] || 0) + 1;
    });

    return Object.entries(map)
      .map(([session, count]) => ({
        session,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [logs]);

  const totalMessages = logs.length + iaLogs.length;

  // Paleta institucional SAT Guatemala
  const COLORS = ["#3498db", "#2ecc71", "#e74c3c", "#f1c40f"];

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
            <button className="btn-admin" onClick={() => navigate("/logs")}>Ir a Logs</button>
            <button className="btn-admin" onClick={() => navigate("/")}>Volver al Chat</button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="sat-hero" style={{ padding: "80px 24px", alignItems: "flex-start" }}>
        <div className="dashboard-container">
          <div className="dashboard-title-bar">
            <div className="dashboard-title-text">
              <h1>Dashboard SAT</h1>
              <p style={{ color: "var(--color-sat-blue-darker)" }}>Indicadores de actividad del asistente virtual</p>
            </div>
          </div>

          {loading ? (
            <div className="dashboard-loading">
              <p>Cargando dashboard...</p>
            </div>
          ) : (
            <>
              {/* CARDS */}
              <div className="cards">
                <div className="card">
                  <h3>Total mensajes</h3>
                  <p>{totalMessages}</p>
                </div>

                <div className="card">
                  <h3>Logs backend</h3>
                  <p>{logs.length}</p>
                </div>

                <div className="card">
                  <h3>Logs IA</h3>
                  <p>{iaLogs.length}</p>
                </div>
              </div>

              {/* GRÁFICOS */}
              <div className="charts">
                {/* PIE CHART */}
                <div className="chart-box">
                  <h3>Tipos de mensajes (IA)</h3>

                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={typeDistribution}
                        dataKey="value"
                        outerRadius={100}
                        label
                      >
                        {typeDistribution.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* BAR CHART */}
                <div className="chart-box">
                  <h3>Sesiones activas</h3>

                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={sessionsCount}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e9ef" />
                      <XAxis dataKey="session" stroke="#6b7689" fontSize={12} />
                      <YAxis stroke="#6b7689" fontSize={12} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
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
