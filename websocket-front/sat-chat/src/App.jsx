import { useEffect, useRef, useState } from "react";
import "./App.css";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);

  const ws = useRef(null);
  const sessionId = useRef("user-" + Math.random().toString(36).substring(7));

  // ======================
  // ADD MESSAGE
  // ======================
  const addMessage = (text, type) => {
    setMessages((prev) => [...prev, { text, type }]);
  };

  // ======================
  // CONNECT WEBSOCKET
  // ======================
  const connectWS = () => {
    // cerrar si ya existe
    if (ws.current) {
      ws.current.close();
    }

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
        "👋 Bienvenido al Asistente SAT Guatemala. Estoy listo para ayudarte con tus consultas tributarias.",
        "bot"
      );
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "n8n-response") {
        addMessage(
          data.data?.response?.output ||
          data.data?.response?.answer ||
          "Respuesta recibida",
          "bot"
        );
      }
    };

    ws.current.onclose = () => {
      setConnected(false);
    };

    ws.current.onerror = () => {
      setConnected(false);
    };
  };

  // ======================
  // INIT
  // ======================
  useEffect(() => {
    connectWS();

    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  // ======================
  // SEND MESSAGE
  // ======================
  const sendMessage = async () => {
    if (!input.trim()) return;

    if (!connected) {
      addMessage("❌ No hay conexión con el servidor. Reconéctate.", "bot");
      return;
    }

    const text = input;

    addMessage(text, "user");
    setInput("");

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

  // ======================
  // UI
  // ======================
  return (
    <div className="container">
      <div className="chat">

        <div className="header">
          Asistente SAT Guatemala
        </div>

        {/* STATUS BAR */}
        <div
          style={{
            padding: "5px 10px",
            fontSize: "12px",
            background: connected ? "#d4edda" : "#f8d7da",
            color: connected ? "#155724" : "#721c24",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <span>
            {connected ? "🟢 Conectado" : "🔴 Desconectado"}
          </span>

          {!connected && (
            <button
              onClick={connectWS}
              style={{
                fontSize: "12px",
                padding: "5px 10px",
                cursor: "pointer"
              }}
            >
              Reconectar
            </button>
          )}
        </div>

        {/* MESSAGES */}
        <div className="messages">
          {messages.map((msg, i) => (
            <div key={i} className={`msg ${msg.type}`}>
              {msg.text}
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div className="inputBox">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu consulta..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Enviar</button>
        </div>

      </div>
    </div>
  );
}