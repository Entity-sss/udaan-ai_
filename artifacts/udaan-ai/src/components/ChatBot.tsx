import { useState, useRef, useEffect } from "react";
import { useSendChatMessage } from "@workspace/api-client-react";
import { getStoredStudent } from "@/lib/auth";

interface Message {
  role: "user" | "ai";
  text: string;
}

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatBot({ isOpen, onClose }: ChatBotProps) {
  const student = getStoredStudent();
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Hi! I'm your Udaan AI assistant. Ask me anything about your learning journey, courses, or tech topics!" },
  ]);
  const [input, setInput] = useState("");
  const sendMessage = useSendChatMessage();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || sendMessage.isPending) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);

    try {
      const res = await sendMessage.mutateAsync({
        data: { studentId: student?.id || "anonymous", message: userMsg },
      });
      setMessages(prev => [...prev, { role: "ai", text: res.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "Sorry, I had trouble responding. Please try again." }]);
    }
  }

  const suggestions = [
    "How do I start with Python?",
    "What is Machine Learning?",
    "Best AI courses for beginners?",
    "Show my roadmap progress",
  ];

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        width: "360px",
        maxHeight: "520px",
        background: "rgba(10, 7, 30, 0.97)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(124,58,237,0.4)",
        borderRadius: "20px",
        boxShadow: "0 0 60px rgba(124,58,237,0.25)",
        display: "flex",
        flexDirection: "column",
        zIndex: 1000,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "1rem 1.25rem",
          borderBottom: "1px solid rgba(124,58,237,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(124,58,237,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #7c3aed, #9333ea)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.75rem",
              color: "white",
              fontWeight: 700,
            }}
          >
            AI
          </div>
          <div>
            <p style={{ color: "white", fontWeight: 600, fontSize: "0.9rem", margin: 0 }}>Udaan Assistant</p>
            <p style={{ color: "#a78bfa", fontSize: "0.7rem", margin: 0 }}>Always here to help</p>
          </div>
        </div>
        <button
          data-testid="button-close-chat"
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: "rgba(255,255,255,0.5)",
            cursor: "pointer",
            fontSize: "1.2rem",
            padding: "0.25rem",
          }}
        >
          x
        </button>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "80%",
                padding: "0.75rem 1rem",
                borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                background:
                  msg.role === "user"
                    ? "linear-gradient(135deg, #7c3aed, #9333ea)"
                    : "rgba(124,58,237,0.12)",
                border: msg.role === "ai" ? "1px solid rgba(124,58,237,0.2)" : "none",
                color: "white",
                fontSize: "0.875rem",
                lineHeight: 1.5,
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {sendMessage.isPending && (
          <div style={{ display: "flex", gap: "4px", padding: "0.75rem 1rem" }}>
            {[0, 1, 2].map(i => (
              <div
                key={i}
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#7c3aed",
                  animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
                }}
              />
            ))}
            <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }`}</style>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length === 1 && (
        <div style={{ padding: "0 1rem 0.75rem", display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => setInput(s)}
              style={{
                padding: "0.3rem 0.7rem",
                background: "rgba(124,58,237,0.1)",
                border: "1px solid rgba(124,58,237,0.25)",
                borderRadius: "20px",
                color: "#a78bfa",
                fontSize: "0.75rem",
                cursor: "pointer",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div
        style={{
          padding: "0.75rem 1rem",
          borderTop: "1px solid rgba(124,58,237,0.2)",
          display: "flex",
          gap: "0.5rem",
        }}
      >
        <input
          data-testid="input-chat-message"
          type="text"
          placeholder="Ask me anything..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          style={{
            flex: 1,
            padding: "0.625rem 0.875rem",
            background: "rgba(124,58,237,0.1)",
            border: "1px solid rgba(124,58,237,0.25)",
            borderRadius: "10px",
            color: "white",
            fontSize: "0.875rem",
            outline: "none",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        />
        <button
          data-testid="button-send-message"
          onClick={handleSend}
          disabled={sendMessage.isPending}
          style={{
            padding: "0.625rem 1rem",
            background: "linear-gradient(135deg, #7c3aed, #9333ea)",
            border: "none",
            borderRadius: "10px",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "0.875rem",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
