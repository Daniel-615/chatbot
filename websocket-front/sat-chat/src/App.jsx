import { useEffect, useRef, useState } from "react";
import "./App.css";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

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
        JSON.stringify({ type: "init", sessionId: sessionId.current })
      );
      addMessage(
        "Bienvenido al Asistente SAT Guatemala. Estoy listo para ayudarte con tus consultas tributarias.",
        "bot"
      );
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setIsTyping(false);
      if (data.type === "n8n-response") {
        addMessage(
          data.data?.response?.output ||
            data.data?.response?.answer ||
            "Respuesta recibida",
          "bot"
        );
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
      addMessage("No hay conexión con el servidor. Reconéctate.", "bot");
      return;
    }

    const text = input;
    addMessage(text, "user");
    setInput("");
    setIsTyping(true);

    await fetch("http://localhost:3000/api/n8n/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, sessionId: sessionId.current }),
    });
  };

  return (
    <div className="container">
      <div className="background-effects">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <div className="chat">
        <div className="header">
          <div className="header-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div className="header-text">
            <h1>Asistente SAT Guatemala</h1>
            <p>Tu consultor tributario virtual</p>
          </div>
        </div>

        <div className={`status-bar ${connected ? "connected" : "disconnected"}`}>
          <span className="status-indicator">
            <span className="status-dot"></span>
            {connected ? "Conectado" : "Desconectado"}
          </span>
          {!connected && (
            <button className="reconnect-btn" onClick={connectWS}>
              Reconectar
            </button>
          )}
        </div>

        <div className="messages">
          {messages.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <p>Escribe tu primera consulta tributaria</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`msg ${msg.type}`}>
              <div className="msg-avatar">
                {msg.type === "bot" ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                    <line x1="9" y1="9" x2="9.01" y2="9"/>
                    <line x1="15" y1="9" x2="15.01" y2="9"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                )}
              </div>
              <div className="msg-content">
                <span className="msg-text">{msg.text}</span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="msg bot">
              <div className="msg-avatar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                  <line x1="9" y1="9" x2="9.01" y2="9"/>
                  <line x1="15" y1="9" x2="15.01" y2="9"/>
                </svg>
              </div>
              <div className="msg-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu consulta tributaria..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage} disabled={!input.trim()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}