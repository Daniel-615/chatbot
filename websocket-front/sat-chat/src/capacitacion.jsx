import React from "react";

export default function Capacitacion() {
  const goBack = () => {
    window.history.back();
  };

  const cursos = [
    {
      titulo: "Capacitación SAT",
      descripcion:
        "Aprende a realizar correctamente declaraciones, pagos y trámites tributarios.",
    },
    {
      titulo: "Facturación Electrónica FEL",
      descripcion:
        "Implementación y uso de sistemas FEL para empresas y pequeños negocios.",
    },
    {
      titulo: "Excel para Contabilidad",
      descripcion:
        "Automatiza reportes financieros y mejora el control de datos contables.",
    },
    {
      titulo: "Gestión Empresarial",
      descripcion:
        "Capacitación enfocada en administración y control de procesos empresariales.",
    },
    {
      titulo: "Educación Financiera",
      descripcion:
        "Aprende conceptos básicos de ahorro, inversión y manejo financiero.",
    },
    {
      titulo: "Asesoría Personalizada",
      descripcion:
        "Sesiones privadas para resolver dudas tributarias y contables.",
    },
  ];

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <button style={styles.backButton} onClick={goBack}>
          ← Regresar
        </button>

        <h2 style={styles.logo}>Capacitación</h2>
      </nav>

      {/* Hero */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>
          Programas de Capacitación Profesional
        </h1>

        <p style={styles.heroText}>
          Fortalece tus conocimientos tributarios, contables y administrativos
          con nuestras capacitaciones especializadas.
        </p>
      </div>

      {/* Cursos */}
      <div style={styles.grid}>
        {cursos.map((curso, index) => (
          <div key={index} style={styles.card}>
            <h3 style={styles.cardTitle}>{curso.titulo}</h3>

            <p style={styles.cardText}>
              {curso.descripcion}
            </p>

            <button style={styles.button}>
              Ver detalles
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f3f4f6",
    padding: "20px",
  },

  navbar: {
    width: "100%",
    height: "70px",
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    borderRadius: "12px",
    marginBottom: "30px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    boxSizing: "border-box",
  },

  logo: {
    color: "#000000",
    margin: 0,
  },

  backButton: {
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "16px",
  },

  hero: {
    textAlign: "center",
    marginBottom: "40px",
    padding: "20px",
  },

  heroTitle: {
    fontSize: "42px",
    color: "#111827",
    marginBottom: "16px",
  },

  heroText: {
    fontSize: "18px",
    color: "#4b5563",
    maxWidth: "700px",
    margin: "0 auto",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  cardTitle: {
    color: "#111827",
    fontSize: "22px",
    margin: 0,
  },

  cardText: {
    color: "#4b5563",
    fontSize: "16px",
    lineHeight: "1.6",
  },

  button: {
    marginTop: "auto",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontSize: "16px",
    cursor: "pointer",
  },
};