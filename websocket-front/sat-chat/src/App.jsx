import { useEffect, useRef, useState } from "react";
import "./App.css";
import { useNavigate } from "react-router-dom";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
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
            <button className="nav-btn" onClick={() => navigate("/logs")}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              Ver Logs
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="sat-main">
        <div className="chat-container">
          {/* Chat Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2a3 3 0 0 0-3 3v1a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                  <path d="M19 9a7 7 0 0 0-14 0c0 3 2 5 7 5s7-2 7-5Z"/>
                  <rect x="3" y="16" width="18" height="6" rx="2"/>
                </svg>
              </div>
              <div className="chat-header-text">
                <h1>Asistente Virtual SAT</h1>
                <p>Consultas tributarias y fiscales</p>
              </div>
            </div>
            <div className={`connection-status ${connected ? "online" : "offline"}`}>
              <span className="status-dot"></span>
              <span className="status-text">{connected ? "En línea" : "Desconectado"}</span>
              {!connected && (
                <button className="reconnect-btn" onClick={connectWS}>
                  Reconectar
                </button>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <button className="quick-btn" onClick={() => setInput("¿Cómo presento mi declaración anual?")}>
              Declaración Anual
            </button>
            <button className="quick-btn" onClick={() => setInput("¿Cuáles son mis obligaciones fiscales?")}>
              Obligaciones Fiscales
            </button>
            <button className="quick-btn" onClick={() => setInput("¿Cómo obtengo mi constancia de situación fiscal?")}>
              Constancia Fiscal
            </button>
          </div>

          {/* Messages */}
          <div className="messages-container">
            {messages.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#235B4E" strokeWidth="1.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <h3>Bienvenido al Asistente SAT</h3>
                <p>Escribe tu consulta tributaria o selecciona una opción rápida</p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.type}`}>
                <div className="message-avatar">
                  {msg.type === "bot" ? (
                    <img src="/gemini.webp" alt="IA" className="avatar-img" />
                  ) : (
                    <img src="/vegetta.webp" alt="Usuario" className="avatar-img" />
                  )}
                </div>
                <div className="message-content">
                  <span className="message-sender">{msg.type === "bot" ? "Asistente SAT" : "Tú"}</span>
                  <p className="message-text">{msg.text}</p>
                  <span className="message-time">
                    {msg.time.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                  </span>
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
                  <span className="message-sender">Asistente SAT</span>
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
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
                placeholder="Escribe tu consulta tributaria..."
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button 
                className="send-btn" 
                onClick={sendMessage} 
                disabled={!input.trim()}
                aria-label="Enviar mensaje"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22,2 15,22 11,13 2,9"/>
                </svg>
              </button>
            </div>
            <p className="input-hint">
              Presiona Enter para enviar o haz clic en el botón
            </p>
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
