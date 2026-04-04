import { useLocation } from "wouter";
import { StarField } from "@/components/StarField";
import logoPath from "/logo.png";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #050511 0%, #0d0d2b 40%, #1a0a3d 70%, #050511 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <StarField />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
          padding: "2rem",
          textAlign: "center",
          animation: "fadeIn 1s ease-out",
        }}
      >
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(124,58,237,0.4), 0 0 40px rgba(124,58,237,0.2); }
            50% { box-shadow: 0 0 40px rgba(124,58,237,0.6), 0 0 80px rgba(124,58,237,0.3); }
          }
        `}</style>

        <div
          style={{
            animation: "float 4s ease-in-out infinite",
            marginBottom: "0.5rem",
          }}
        >
          <img
            src={logoPath}
            alt="Udaan AI Logo"
            data-testid="img-logo"
            style={{
              width: "160px",
              height: "160px",
              objectFit: "contain",
              filter: "brightness(0) invert(1) drop-shadow(0 0 12px rgba(245,158,11,0.8)) drop-shadow(0 0 24px rgba(245,158,11,0.4))",
            }}
          />
        </div>

        <div>
          <h1
            style={{
              fontSize: "clamp(3rem, 8vw, 5rem)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              background: "linear-gradient(135deg, #ffffff 0%, #c084fc 40%, #f59e0b 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "0.5rem",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Udaan AI
          </h1>
          <p
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
              color: "rgba(255,255,255,0.65)",
              maxWidth: "560px",
              lineHeight: 1.6,
              fontWeight: 400,
            }}
          >
            Your personalized journey to tech mastery begins here. AI-powered roadmaps crafted for your growth.
          </p>
        </div>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", marginTop: "0.5rem" }}>
          <button
            data-testid="button-get-started"
            onClick={() => setLocation("/signup")}
            style={{
              padding: "1rem 2.5rem",
              fontSize: "1.1rem",
              fontWeight: 600,
              color: "white",
              background: "linear-gradient(135deg, #7c3aed, #9333ea)",
              border: "none",
              borderRadius: "50px",
              cursor: "pointer",
              animation: "pulse-glow 3s ease-in-out infinite",
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: "0.02em",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            Get Started
          </button>
        </div>

        <div style={{ display: "flex", gap: "2rem", marginTop: "2rem" }}>
          {[
            { label: "AI-Powered", icon: "AI" },
            { label: "Personalized", icon: "P" },
            { label: "Certified", icon: "C" },
          ].map(item => (
            <div
              key={item.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "rgba(124,58,237,0.2)",
                  border: "1px solid rgba(124,58,237,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#a78bfa",
                }}
              >
                {item.icon}
              </div>
              <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
