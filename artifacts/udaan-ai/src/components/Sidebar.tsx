import { useLocation } from "wouter";
import { clearStoredStudent, getStoredStudent } from "@/lib/auth";
import logoPath from "/logo.png";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: "D" },
  { label: "My Roadmap", path: "/roadmap", icon: "R" },
  { label: "Courses", path: "/courses", icon: "C" },
  { label: "Library", path: "/library", icon: "L" },
  { label: "Progress", path: "/progress", icon: "P" },
  { label: "Certificates", path: "/certificates", icon: "C" },
];

interface SidebarProps {
  onChatOpen: () => void;
}

export function Sidebar({ onChatOpen }: SidebarProps) {
  const [location, setLocation] = useLocation();
  const student = getStoredStudent();

  function handleLogout() {
    clearStoredStudent();
    setLocation("/");
  }

  return (
    <div
      style={{
        width: "240px",
        minHeight: "100vh",
        background: "rgba(8, 5, 25, 0.95)",
        borderRight: "1px solid rgba(124,58,237,0.2)",
        display: "flex",
        flexDirection: "column",
        padding: "1.5rem 1rem",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem", paddingLeft: "0.5rem" }}>
        <img
          src={logoPath}
          alt="Udaan AI"
          style={{
            width: "36px",
            height: "36px",
            objectFit: "contain",
            filter: "brightness(0) invert(1) drop-shadow(0 0 6px rgba(245,158,11,0.5))",
          }}
        />
        <span
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            background: "linear-gradient(135deg, #ffffff, #c084fc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Udaan AI
        </span>
      </div>

      <div
        style={{
          background: "rgba(124,58,237,0.1)",
          border: "1px solid rgba(124,58,237,0.2)",
          borderRadius: "16px",
          padding: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #7c3aed, #9333ea)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 700,
            fontSize: "1.2rem",
            marginBottom: "0.75rem",
          }}
        >
          {student?.name?.[0]?.toUpperCase() || "S"}
        </div>
        <p style={{ color: "white", fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.25rem" }}>
          {student?.name || "Student"}
        </p>
        <p style={{ color: "#a78bfa", fontSize: "0.75rem", fontWeight: 500 }}>
          {student?.studentId || "UDN-0000"}
        </p>
      </div>

      <nav style={{ flex: 1 }}>
        {navItems.map(item => {
          const isActive = location === item.path || (item.path !== "/roadmap" && location.startsWith(item.path));
          return (
            <button
              key={item.path}
              data-testid={`nav-${item.label.toLowerCase().replace(" ", "-")}`}
              onClick={() => setLocation(item.path)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1rem",
                borderRadius: "12px",
                border: "none",
                background: isActive ? "rgba(124,58,237,0.25)" : "transparent",
                color: isActive ? "#c084fc" : "rgba(255,255,255,0.55)",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: isActive ? 600 : 400,
                textAlign: "left",
                transition: "all 0.2s",
                marginBottom: "0.25rem",
                fontFamily: "'Space Grotesk', sans-serif",
                borderLeft: isActive ? "3px solid #7c3aed" : "3px solid transparent",
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(124,58,237,0.1)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(255,255,255,0.55)";
                }
              }}
            >
              <span
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  background: isActive ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: isActive ? "#a78bfa" : "rgba(255,255,255,0.35)",
                }}
              >
                {item.icon}
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>

      <div style={{ paddingTop: "1rem", borderTop: "1px solid rgba(124,58,237,0.15)" }}>
        <button
          data-testid="button-ai-chat"
          onClick={onChatOpen}
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(147,51,234,0.2))",
            border: "1px solid rgba(124,58,237,0.35)",
            borderRadius: "12px",
            color: "#c084fc",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "0.875rem",
            marginBottom: "0.75rem",
            fontFamily: "'Space Grotesk', sans-serif",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            justifyContent: "center",
          }}
        >
          <span>AI</span> Udaan Assistant
        </button>

        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "0.6rem",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px",
            color: "rgba(255,255,255,0.35)",
            cursor: "pointer",
            fontSize: "0.8rem",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
