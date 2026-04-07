import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIMentorChatProps {
  currentQuestion?: string;
  studentName?: string;
}

const BASE = "";

export function AIMentorChat({ currentQuestion, studentName }: AIMentorChatProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hey${studentName ? ` ${studentName.split(" ")[0]}` : ""}! 👋 I'm your AI Mentor. I can help you understand any question in this assessment, explain tech concepts, or guide you on the right career path.\n\nWhat would you like to know?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  async function send() {
    const text = input.trim();
    if (!text || streaming) return;

    const userMsg: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setStreaming(true);

    const assistantMsg: Message = { role: "assistant", content: "" };
    setMessages(prev => [...prev, assistantMsg]);

    try {
      const response = await fetch(`${BASE}/api/mentor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          context: { currentQuestion, studentName },
        }),
      });

      if (!response.ok || !response.body) throw new Error("Failed");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.done) break;
              if (data.content) {
                setMessages(prev => {
                  const copy = [...prev];
                  copy[copy.length - 1] = { ...copy[copy.length - 1], content: copy[copy.length - 1].content + data.content };
                  return copy;
                });
              }
            } catch {}
          }
        }
      }
    } catch {
      setMessages(prev => {
        const copy = [...prev];
        copy[copy.length - 1] = { ...copy[copy.length - 1], content: "Sorry, I couldn't connect right now. Please try again!" };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const suggestions = [
    "Explain this question to me",
    "Which career path suits me?",
    "What should I learn first?",
    "Tips for this assessment",
  ];

  return (
    <>
      <style>{`
        @keyframes mentor-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(124,58,237,0.5), 0 4px 20px rgba(124,58,237,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(124,58,237,0), 0 4px 20px rgba(124,58,237,0.5); }
        }
        @keyframes mentor-slide-in {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes typing-dot {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <button
        data-testid="button-ai-mentor"
        onClick={() => setOpen(o => !o)}
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: 1000,
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #7c3aed, #9333ea)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.4rem",
          animation: open ? "none" : "mentor-pulse 2.5s ease-in-out infinite",
          transition: "transform 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
        title="Ask AI Mentor"
      >
        {open ? "✕" : "🤖"}
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "5rem",
            right: "1.5rem",
            zIndex: 999,
            width: "min(380px, calc(100vw - 2rem))",
            height: "500px",
            background: "rgba(8,5,26,0.97)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(124,58,237,0.4)",
            borderRadius: "20px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 8px 60px rgba(0,0,0,0.6), 0 0 40px rgba(124,58,237,0.15)",
            animation: "mentor-slide-in 0.25s ease-out",
          }}
        >
          <div style={{ padding: "0.875rem 1.125rem", borderBottom: "1px solid rgba(124,58,237,0.2)", display: "flex", alignItems: "center", gap: "0.75rem", background: "rgba(124,58,237,0.08)" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #9333ea)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>🤖</div>
            <div style={{ flex: 1 }}>
              <p style={{ color: "white", fontWeight: 700, fontSize: "0.9rem", margin: 0, lineHeight: 1.2 }}>AI Mentor</p>
              <p style={{ color: "#10b981", fontSize: "0.7rem", margin: 0, display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                Online · Powered by Claude
              </p>
            </div>
            {currentQuestion && (
              <div style={{ padding: "0.2rem 0.5rem", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: "6px", fontSize: "0.65rem", color: "#fbbf24", fontWeight: 600 }}>
                Q in view
              </div>
            )}
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "0.875rem", display: "flex", flexDirection: "column", gap: "0.75rem", scrollbarWidth: "thin", scrollbarColor: "rgba(124,58,237,0.3) transparent" }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                {m.role === "assistant" && (
                  <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "linear-gradient(135deg, #7c3aed, #9333ea)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", flexShrink: 0, marginRight: "0.5rem", alignSelf: "flex-end" }}>🤖</div>
                )}
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "0.625rem 0.875rem",
                    borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    background: m.role === "user" ? "linear-gradient(135deg, #7c3aed, #9333ea)" : "rgba(255,255,255,0.06)",
                    border: m.role === "assistant" ? "1px solid rgba(124,58,237,0.15)" : "none",
                    color: "white",
                    fontSize: "0.84rem",
                    lineHeight: 1.55,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {m.content}
                  {streaming && i === messages.length - 1 && m.role === "assistant" && m.content === "" && (
                    <span style={{ display: "inline-flex", gap: "3px", alignItems: "center", padding: "0.2rem 0" }}>
                      {[0, 1, 2].map(d => (
                        <span key={d} style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#a78bfa", animation: `typing-dot 1.2s ease-in-out ${d * 0.2}s infinite` }} />
                      ))}
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {messages.length === 1 && (
            <div style={{ padding: "0 0.875rem 0.5rem", display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => { setInput(s); textareaRef.current?.focus(); }}
                  style={{
                    padding: "0.3rem 0.65rem",
                    borderRadius: "20px",
                    border: "1px solid rgba(124,58,237,0.3)",
                    background: "rgba(124,58,237,0.08)",
                    color: "#a78bfa",
                    fontSize: "0.72rem",
                    cursor: "pointer",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 500,
                  }}
                >{s}</button>
              ))}
            </div>
          )}

          <div style={{ padding: "0.75rem", borderTop: "1px solid rgba(124,58,237,0.15)", display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything... (Enter to send)"
              rows={1}
              style={{
                flex: 1,
                padding: "0.6rem 0.875rem",
                background: "rgba(124,58,237,0.08)",
                border: "1px solid rgba(124,58,237,0.25)",
                borderRadius: "12px",
                color: "white",
                fontSize: "0.84rem",
                fontFamily: "'Space Grotesk', sans-serif",
                outline: "none",
                resize: "none",
                maxHeight: "80px",
                overflow: "auto",
                lineHeight: 1.5,
              }}
              onFocus={e => (e.target.style.borderColor = "rgba(124,58,237,0.6)")}
              onBlur={e => (e.target.style.borderColor = "rgba(124,58,237,0.25)")}
            />
            <button
              onClick={send}
              disabled={streaming || !input.trim()}
              style={{
                width: "36px",
                height: "36px",
                flexShrink: 0,
                borderRadius: "10px",
                border: "none",
                background: streaming || !input.trim() ? "rgba(124,58,237,0.2)" : "linear-gradient(135deg, #7c3aed, #9333ea)",
                color: "white",
                cursor: streaming || !input.trim() ? "not-allowed" : "pointer",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
            >
              {streaming ? "⋯" : "↑"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
