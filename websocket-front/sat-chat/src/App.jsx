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
        JSON.stringify({
          type: "init",
          sessionId: sessionId.current,
        })
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
      addMessage("No hay conexión con el servidor. Reconéctate.", "bot");
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
    <div className="container">
      <div className="background-effects">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <div className="chat">
        <div className="header">
          <div className="header-icon">📊</div>
          <div className="header-text">
            <h1>Asistente SAT Guatemala</h1>
            <p>Tu consultor tributario virtual</p>
          </div>
        </div>

        <div className={`status-bar ${connected ? "connected" : "disconnected"}`}>
          <span className="status-indicator">
            {connected ? "🟢 Conectado" : "🔴 Desconectado"}
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
              <p>Escribe tu primera consulta tributaria</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`msg ${msg.type}`}>
              <div className="msg-avatar">
                {msg.type === "bot" ? "🤖" : "👤"}
              </div>
              <div className="msg-content">
                <span className="msg-text">{msg.text}</span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="msg bot">
              <div className="msg-avatar">🤖</div>
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
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}