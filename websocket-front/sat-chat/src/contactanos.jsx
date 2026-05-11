import React from "react";

export default function Contactanos() {
  const goBack = () => {
    window.history.back();
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <button style={styles.backButton} onClick={goBack}>
          ← Regresar
        </button>

        <h2 style={styles.logo}>SAT</h2>
      </nav>

      {/* Card */}
      <div style={styles.card}>
        <div style={styles.info}>
          <h1 style={{ color: "#000000" }}>Contáctanos</h1>

          <p style={{ color: "#000000" }}>
            Estamos disponibles para ayudarte con cualquier duda o proyecto.
          </p>

          <div style={styles.item}>
            <strong>📞 Teléfono:</strong>
            <span>+502 5555-1234</span>
          </div>

          <div style={styles.item}>
            <strong>📧 Correo:</strong>
            <span>contacto@empresa.com</span>
          </div>

          <div style={styles.item}>
            <strong>📍 Dirección:</strong>
            <span>Zona 10, Ciudad de Guatemala</span>
          </div>
        </div>

        <div style={styles.mapContainer}>
          <iframe
            title="Mapa"
            src="https://www.google.com/maps?q=Zona+10+Guatemala&output=embed"
            width="100%"
            height="100%"
            style={styles.map}
            allowFullScreen=""
            loading="lazy"
          />
        </div>
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
    marginBottom: "20px",
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

  card: {
    display: "flex",
    flexWrap: "wrap",
    width: "100%",
    maxWidth: "1000px",
    margin: "0 auto",
    backgroundColor: "#fff",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },

  info: {
    flex: "1",
    minWidth: "300px",
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  item: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    fontSize: "18px",
    color: "#000000",
  },

  mapContainer: {
    flex: "1",
    minWidth: "300px",
    height: "500px",
  },

  map: {
    border: "none",
  },
};