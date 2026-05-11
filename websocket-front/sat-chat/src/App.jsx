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

  /*
  ========================================
  SESSION ID PERSISTENTE
  ========================================
  */

  const sessionId = useRef(
    localStorage.getItem("sessionId") ||
    "user-" + Math.random().toString(36).substring(7)
  );

  /*
  ========================================
  CHAT ID
  ========================================
  */

  const chatId = useRef(null);

  /*
  ========================================
  GUARDAR SESSION
  ========================================
  */

  useEffect(() => {

    localStorage.setItem(
      "sessionId",
      sessionId.current
    );

  }, []);

  /*
  ========================================
  AUTO SCROLL
  ========================================
  */

  const scrollToBottom = () => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /*
  ========================================
  AGREGAR MENSAJE
  ========================================
  */

  const addMessage = (
    text,
    type,
    time = new Date()
  ) => {

    setMessages((prev) => [
      ...prev,
      {
        text,
        type,
        time
      }
    ]);
  };

  /*
  ========================================
  INICIALIZAR CHAT
  ========================================
  */

  const initializeChat = async () => {

    try {

      const response = await fetch(
        "http://localhost:3000/api/chat/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            user_id: sessionId.current
          })
        }
      );

      const data = await response.json();

      if (data.ok) {

        chatId.current = data.chat.id;

        await loadMessages(
          sessionId.current
        );
      }

    } catch (err) {

      console.error(
        "Error inicializando chat:",
        err
      );
    }
  };

  /*
  ========================================
  CARGAR MENSAJES
  ========================================
  */

  const loadMessages = async (
    userId
  ) => {

    try {

      const response = await fetch(
        `http://localhost:3000/api/chat/${userId}`
      );

      const data = await response.json();

      if (
        data.ok &&
        data.chat?.messages
      ) {

        const formattedMessages =
          data.chat.messages.map(
            (msg) => ({
              text: msg.message,
              type: msg.sender,
              time: new Date(
                msg.createdAt
              )
            })
          );

        formattedMessages.sort(
          (a, b) =>
            new Date(a.time) -
            new Date(b.time)
        );

        setMessages(
          formattedMessages
        );

      } else {

        addMessage(
          "Bienvenido al Asistente Virtual del SAT. Estoy aquí para ayudarte con tus consultas tributarias.",
          "bot"
        );
      }

    } catch (err) {

      console.error(
        "Error cargando mensajes:",
        err
      );
    }
  };

  /*
  ========================================
  GUARDAR MENSAJE
  ========================================
  */

  const saveMessage = async (
    message,
    sender
  ) => {

    if (!chatId.current) return;

    try {

      await fetch(
        "http://localhost:3000/api/chat/message",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            chat_id:
              chatId.current,
            message,
            sender
          })
        }
      );

    } catch (err) {

      console.error(
        "Error guardando mensaje:",
        err
      );
    }
  };

  /*
  ========================================
  WEBSOCKET
  ========================================
  */

  const connectWS = () => {

    if (
      ws.current &&
      ws.current.readyState === 1
    ) {
      return;
    }

    ws.current = new WebSocket(
      "ws://localhost:3000"
    );

    ws.current.onopen = () => {

      setConnected(true);

      ws.current.send(
        JSON.stringify({
          type: "init",
          sessionId:
            sessionId.current
        })
      );
    };

    ws.current.onmessage = async (
      event
    ) => {

      const data = JSON.parse(
        event.data
      );

      setIsTyping(false);

      if (
        data.type ===
        "n8n-response"
      ) {

        const text =
          data.data?.text ||
          "Respuesta vacía";

        addMessage(
          text,
          "bot"
        );

        await saveMessage(
          text,
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

  /*
  ========================================
  INIT
  ========================================
  */

  useEffect(() => {

    initializeChat();

    connectWS();

    return () => {
      ws.current?.close();
    };

  }, []);

  /*
  ========================================
  ENVIAR MENSAJE
  ========================================
  */

  const sendMessage = async () => {

    if (!input.trim()) return;

    if (!connected) {

      addMessage(
        "No hay conexión con el servidor.",
        "bot"
      );

      return;
    }

    const text = input;

    addMessage(
      text,
      "user"
    );

    await saveMessage(
      text,
      "user"
    );

    setInput("");

    setIsTyping(true);

    try {

      await fetch(
        "http://localhost:3000/api/n8n/message",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            message: text,
            sessionId:
              sessionId.current
          })
        }
      );

    } catch (err) {

      console.error(err);

      setIsTyping(false);
    }
  };

  return (
    <div className="sat-page">

      {/* TOP BAR */}
      <div className="sat-gov-bar">

        <div className="sat-gov-bar-content">

          <div className="sat-gov-bar-left">
            Gobierno de la República
            de Guatemala
          </div>

          <div className="sat-gov-bar-right">

            <span>
              1550 Asistencia
            </span>

            <span>
              consultas@sat.gob.gt
            </span>

          </div>

        </div>
      </div>

      {/* NAV */}
      <header className="sat-official-nav">

        <div className="sat-nav-content">

          <div className="sat-logo-full">

            <div className="sat-logo-text">

              <span className="sat-wordmark">
                SAT
              </span>

              <span className="sat-submark">
                SUPERINTENDENCIA DE
                ADMINISTRACION
                TRIBUTARIA
              </span>

            </div>
          </div>

          <nav className="sat-nav-links-official">

            <a href="/servicios">
              Servicios Tributarios
            </a>

            <a href="/aduanas">
              Aduanas
            </a>

            <a href="/capacitacion">
              Capacitación
            </a>

            <a href="/contactanos">
              Contáctanos
            </a>

            <button
              className="btn-admin"
              onClick={() =>
                navigate(
                  "/dashboard"
                )
              }
            >
              Dashboard
            </button>

            <button
              className="btn-admin"
              onClick={() =>
                navigate("/logs")
              }
            >
              Logs
            </button>

          </nav>
        </div>
      </header>

      {/* HERO */}
      <main className="sat-hero">

        <div className="hero-content">

          {/* TEXTO */}
          <div className="hero-text-section">

            <h1 className="hero-title">
              CONSULTAS FISCALES SIN
              COMPLICACIONES
            </h1>

            <p className="hero-subtitle">
              El Asistente Virtual del
              Servicio de Administración
              Tributaria está aquí para
              resolver tus dudas
              fiscales.
            </p>

            <div className="hero-ctas">

              <button
                className="btn-primary"
                onClick={() =>
                  setInput(
                    "¿Cómo presento mi declaración anual?"
                  )
                }
              >
                Declaración Anual
              </button>

              <button
                className="btn-secondary"
                onClick={() =>
                  setInput(
                    "¿Cómo obtengo mi constancia de situación fiscal?"
                  )
                }
              >
                Constancia Fiscal
              </button>

            </div>
          </div>

          {/* BOTÓN CHAT */}
          <button
            className="chat-toggle-btn"
            onClick={() =>
              setIsChatOpen(true)
            }
          >

            <svg
              viewBox="0 0 24 24"
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>

          </button>

          {/* CHAT */}
          <div
            className={`hero-app-section ${
              isChatOpen
                ? "open"
                : ""
            }`}
          >

            <div className="chat-container">

              {/* HEADER */}
              <div className="chat-header">

                <div className="chat-header-info">

                  <div className="chat-header-text">

                    <h2>
                      Asistente Virtual
                    </h2>

                    <div
                      className={`connection-status ${
                        connected
                          ? "online"
                          : "offline"
                      }`}
                    >

                      <span className="status-dot"></span>

                      <span className="status-text">

                        {connected
                          ? "En línea"
                          : "Desconectado"}

                      </span>

                    </div>
                  </div>
                </div>

                {/* BOTONES DERECHA */}
                <div
                  style={{
                    display: "flex",
                    alignItems:
                      "center",
                    gap: "10px"
                  }}
                >

                  {/* SIEMPRE VISIBLE */}
                  <button
                    className="reconnect-btn"
                    onClick={connectWS}
                  >
                    Reconectar
                  </button>

                  <button
                    className="close-chat-btn"
                    onClick={() =>
                      setIsChatOpen(
                        false
                      )
                    }
                  >
                    ✕
                  </button>

                </div>
              </div>

              {/* MENSAJES */}
              <div className="messages-container">

                {messages.map(
                  (msg, i) => (

                    <div
                      key={i}
                      className={`message ${msg.type}`}
                    >

                      {/* BOT AVATAR */}
                      {msg.type ===
                        "bot" && (

                        <div className="message-avatar bot-avatar">

                          <img
                            src="/gemini.webp"
                            alt="Gemini"
                            className="avatar-img"
                          />

                        </div>
                      )}

                      {/* CONTENT */}
                      <div className="message-content">

                        <div className="message-header">

                          <span className="message-sender">

                            {msg.type ===
                              "bot"
                              ? "Asistente SAT"
                              : "Tú"}

                          </span>

                          <span className="message-time">

                            {msg.time.toLocaleTimeString(
                              "es-GT",
                              {
                                hour:
                                  "2-digit",
                                minute:
                                  "2-digit"
                              }
                            )}

                          </span>
                        </div>

                        <div className="message-text">

                          <p>
                            {msg.text}
                          </p>

                        </div>

                      </div>

                      {/* USER AVATAR */}
                      {msg.type ===
                        "user" && (

                        <div className="message-avatar user-avatar">

                          <img
                            src="/vegetta.webp"
                            alt="Usuario"
                            className="avatar-img"
                          />

                        </div>
                      )}

                    </div>
                  )
                )}

                {/* TYPING */}
                {isTyping && (

                  <div className="message bot">

                    <div className="message-avatar bot-avatar">

                      <img
                        src="/gemini.webp"
                        alt="Gemini"
                        className="avatar-img"
                      />

                    </div>

                    <div className="message-content">

                      <div className="message-header">

                        <span className="message-sender">
                          Asistente SAT
                        </span>

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

                <div
                  ref={
                    messagesEndRef
                  }
                />

              </div>

              {/* INPUT */}
              <div className="input-container">

                <div className="input-wrapper">

                  <input
                    type="text"
                    value={input}
                    onChange={(e) =>
                      setInput(
                        e.target.value
                      )
                    }
                    placeholder="Preguntar al asistente..."
                    onKeyDown={(e) =>
                      e.key ===
                        "Enter" &&
                      sendMessage()
                    }
                  />

                  <button
                    className="send-btn"
                    onClick={
                      sendMessage
                    }
                    disabled={
                      !input.trim()
                    }
                  >
                    Enviar
                  </button>

                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="sat-footer">

        <div className="footer-content">

          <p>
            © Superintendencia de
            Administración Tributaria
          </p>

        </div>
      </footer>
    </div>
  );
}