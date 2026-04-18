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

  const COLORS = ["#235B4E", "#8884d8", "#f39c12", "#e74c3c"];

  if (loading) return <p>Cargando dashboard...</p>;

  return (
    <div className="dashboard-container">
<nav className="header-nav">
            <button
              onClick={() => navigate("/logs")}
              style={{
                padding: 10,
                background: "#235B4E",
                color: "white",
                border: "none",
                cursor: "pointer"
              }}
            >
              Ir a logs
            </button>
            <button className="nav-btn" onClick={() => navigate("/")}>
              Volver al Chat
            </button>
          </nav>
      <h1 className="title">Dashboard SAT</h1>

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
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="session" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#235B4E" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
}