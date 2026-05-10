import { useEffect, useRef, useState } from "react";
import "./App.css";
import { useNavigate } from "react-router-dom";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const navigate = useNavigate();
  const ws = useRef(null);
  const sessionId = useRef("user-" + Math.random().toString(36).substring(7));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text, type) => {
    setMessages((prev) => [...prev, { text, type, time: new Date() }]);
  };

  const connectWS = () => {
    if (ws.current) ws.current.close();

    ws.current = new WebSocket("ws://localhost:3000");

    ws.current.onopen = () => {
      setConnected(true);

      ws.current.send(
        JSON.stringify({
          type: "init",
          sessionId: sessionId.current,
        })
      );

      addMessage(
        "Bienvenido al Asistente Virtual del SAT. Estoy aquí para ayudarte con tus consultas tributarias, declaraciones y trámites fiscales.",
        "bot"
      );
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setIsTyping(false);

      if (data.type === "n8n-response") {
        const text = data.data?.text;
        addMessage(text || "Respuesta vacía", "bot");
      }
    };

    ws.current.onclose = () => setConnected(false);
    ws.current.onerror = () => setConnected(false);
  };

  useEffect(() => {
    connectWS();
    return () => ws.current?.close();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    if (!connected) {
      addMessage("No hay conexión con el servidor. Intenta reconectarte.", "bot");
      return;
    }

    const text = input;

    addMessage(text, "user");
    setInput("");
    setIsTyping(true);

    await fetch("http://localhost:3000/api/n8n/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: text,
        sessionId: sessionId.current,
      }),
    });
  };

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
            <button className="btn-admin" onClick={() => navigate("/dashboard")}>Dashboard</button>
            <button className="btn-admin" onClick={() => navigate("/logs")}>Logs</button>
          </nav>
        </div>
      </header>

      {/* Hero Section (Split layout) */}
      <main className="sat-hero">
        <div className="hero-content">
          {/* Left 50% - Typography Block */}
          <div className="hero-text-section">
            <h1 className="hero-title">CONSULTAS FISCALES SIN COMPLICACIONES</h1>
            <p className="hero-subtitle">
              El Asistente Virtual del Servicio de Administración Tributaria está aquí para resolver tus dudas fiscales, guiarte en tus declaraciones y facilitarte el cumplimiento de tus obligaciones, las 24 horas del día.
            </p>
            <div className="hero-ctas">
               <button className="btn-primary" onClick={() => setInput("¿Cómo presento mi declaración anual?")}>
                 Declaración Anual
               </button>
               <button className="btn-secondary" onClick={() => setInput("¿Cómo obtengo mi constancia de situación fiscal?")}>
                 Constancia Fiscal
               </button>
            </div>
            
            <div className="floating-ornament">
              <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2 L12 22 M2 12 L22 12" />
              </svg>
            </div>
          </div>

          {/* Right 50% - Chat Product Mockup (Sliding Panel) */}
          <button className="chat-toggle-btn" onClick={() => setIsChatOpen(true)}>
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </button>

          <div className={`hero-app-section ${isChatOpen ? 'open' : ''}`}>
            <div className="chat-container">
              {/* Chat Header */}
              <div className="chat-header">
                <div className="chat-header-info">
                  <div className="chat-avatar">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2a3 3 0 0 0-3 3v1a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                      <path d="M19 9a7 7 0 0 0-14 0c0 3 2 5 7 5s7-2 7-5Z"/>
                      <rect x="3" y="16" width="18" height="6" rx="2"/>
                    </svg>
                  </div>
                  <div className="chat-header-text">
                    <h2>Asistente Virtual</h2>
                    <div className={`connection-status ${connected ? "online" : "offline"}`}>
                      <span className="status-dot"></span>
                      <span className="status-text">{connected ? "En línea" : "Desconectado"}</span>
                    </div>
                  </div>
                </div>
                <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                  {!connected && (
                    <button className="reconnect-btn" onClick={connectWS}>
                      Reconectar
                    </button>
                  )}
                  <button className="close-chat-btn" onClick={() => setIsChatOpen(false)}>
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="messages-container">
                {messages.length === 0 && (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#1e3a5f" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                    </div>
                    <h3>Comienza a conversar</h3>
                    <p>Escribe tu consulta tributaria abajo.</p>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <div key={i} className={`message ${msg.type}`}>
                    <div className="message-avatar">
                      {msg.type === "bot" ? (
                        <img src="/gemini.webp" alt="IA" className="avatar-img" />
                      ) : (
                        <img src="/vegetta.webp" alt="User" className="avatar-img" />
                      )}
                    </div>
                    <div className="message-content">
                      <div className="message-header">
                        <span className="message-sender">{msg.type === "bot" ? "Asistente SAT" : "Tú"}</span>
                        <span className="message-time">
                          {msg.time.toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <div className="message-text">
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="message bot">
                    <div className="message-avatar">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="10" rx="2"/>
                        <circle cx="12" cy="5" r="3"/>
                      </svg>
                    </div>
                    <div className="message-content">
                      <div className="message-header">
                        <span className="message-sender">Asistente SAT</span>
                      </div>
                      <div className="message-text">
                        <div className="typing-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="input-container">
                <div className="input-wrapper">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Preguntar al asistente..."
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <button
                    className="send-btn"
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    aria-label="Enviar mensaje"
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22,2 15,22 11,13 2,9"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="sat-footer">
        <div className="footer-content">
          <p>&copy; Superintendencia de Administración Tributaria - Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
