import { useEffect } from "react";

interface AboutModalProps {
  onClose: () => void;
}

const FEATURES = [
  { icon: "🧠", title: "AI Skill Assessment", desc: "Personalized MCQ assessment that maps your current skills, interests, and career goals to create a tailored learning plan." },
  { icon: "🗺️", title: "Personalized Roadmap", desc: "A phased learning roadmap auto-generated from your assessment — broken into beginner, intermediate, and advanced stages." },
  { icon: "📚", title: "Structured Courses", desc: "Video lectures, notes, practice exercises, and progress tracking across 20+ courses in Python, ML, Web Dev, DSA, and more." },
  { icon: "📖", title: "Notes Library", desc: "A searchable, filterable library of study notes and resources. Bookmark favorites and access them anytime." },
  { icon: "✅", title: "Mock Test", desc: "Timed MCQ tests across Python, JavaScript, Data Structures, ML/AI, and Web Dev with detailed answer reviews and explanations." },
  { icon: "🎙️", title: "Mock Interview", desc: "Role-based interview simulations for Frontend, Backend, Full Stack, ML Engineer, and Data Scientist roles — with model answers." },
  { icon: "📄", title: "Auto Resume Builder", desc: "Resume auto-populated with your Udaan AI courses, certificates, and skills. Edit, preview, and print as PDF instantly." },
  { icon: "📊", title: "Progress Dashboard", desc: "Real-time charts tracking your weekly activity, skill radar, points, streaks, and overall course completion." },
  { icon: "🏆", title: "Certificates", desc: "Printable certificates with unique student IDs and QR codes awarded upon completing courses." },
  { icon: "🤖", title: "AI Mentor Chat", desc: "Claude-powered AI mentor available during your skills assessment to answer questions and guide your career choices." },
  { icon: "💬", title: "AI Chatbot", desc: "Always-available AI assistant inside the app to answer questions about courses, roadmap, tech concepts, and more." },
  { icon: "🔑", title: "Secure Auth", desc: "OTP-based mobile authentication with a unique Udaan Student ID (UDN-YYYY-XXXX) assigned to every learner." },
];

const STEPS = [
  { num: "01", title: "Create Your Account", desc: "Sign up with your name, email, and mobile number. Get an OTP to verify — your unique Student ID is generated instantly." },
  { num: "02", title: "Complete the AI Assessment", desc: "Answer 8 quick questions about your experience, language knowledge, interests, and career goals. Your AI Mentor is available to help!" },
  { num: "03", title: "Get Your Personalized Roadmap", desc: "Udaan AI generates a custom phased roadmap with recommended courses, timelines, and skill targets just for you." },
  { num: "04", title: "Learn, Practice, and Test", desc: "Work through courses with lectures and notes, use the Library, take Mock Tests, and practice Mock Interviews anytime." },
  { num: "05", title: "Build Your Profile", desc: "Auto-generate your resume from your progress, earn certificates, track your streaks, and showcase your growth." },
];

export function AboutModal({ onClose }: AboutModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.96) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .about-scroll::-webkit-scrollbar { width: 5px; }
        .about-scroll::-webkit-scrollbar-track { background: transparent; }
        .about-scroll::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.4); border-radius: 10px; }
      `}</style>

      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", zIndex: 9000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
      >
        <div
          onClick={e => e.stopPropagation()}
          className="about-scroll"
          style={{
            background: "linear-gradient(135deg, #0d0a28 0%, #120d35 100%)",
            border: "1px solid rgba(124,58,237,0.35)",
            borderRadius: "24px",
            width: "100%",
            maxWidth: "780px",
            maxHeight: "90vh",
            overflowY: "auto",
            animation: "modal-in 0.3s ease-out",
            boxShadow: "0 20px 80px rgba(0,0,0,0.7), 0 0 60px rgba(124,58,237,0.15)",
          }}
        >
          <div style={{ position: "sticky", top: 0, zIndex: 10, background: "rgba(13,10,40,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(124,58,237,0.2)", padding: "1.25rem 1.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 style={{ color: "white", fontWeight: 900, fontSize: "1.3rem", margin: 0, lineHeight: 1.2 }}>About Udaan AI</h2>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.8rem", margin: "0.2rem 0 0" }}>Turn your now into your next.</p>
            </div>
            <button
              onClick={onClose}
              style={{ width: "34px", height: "34px", borderRadius: "50%", border: "1px solid rgba(124,58,237,0.3)", background: "rgba(124,58,237,0.1)", color: "#a78bfa", cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}
            >✕</button>
          </div>

          <div style={{ padding: "1.75rem" }}>
            <div style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(147,51,234,0.08))", border: "1px solid rgba(124,58,237,0.25)", borderRadius: "16px", padding: "1.25rem 1.5rem", marginBottom: "2rem" }}>
              <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.7, margin: 0, fontSize: "0.95rem" }}>
                <strong style={{ color: "#c084fc" }}>Udaan AI</strong> is a comprehensive student growth ecosystem built for Indian tech students. We combine AI-powered skill assessment, personalized learning roadmaps, structured courses, and practice tools — all in one place — to help you land your dream tech job.
              </p>
            </div>

            <h3 style={{ color: "white", fontWeight: 800, fontSize: "1.05rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ padding: "0.2rem 0.7rem", background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)", borderRadius: "20px", fontSize: "0.75rem", color: "#a78bfa" }}>Features</span>
              Everything You Need
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.75rem", marginBottom: "2rem" }}>
              {FEATURES.map(f => (
                <div
                  key={f.title}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(124,58,237,0.15)",
                    borderRadius: "14px",
                    padding: "1rem",
                    transition: "border-color 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.15)")}
                >
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.4rem" }}>{f.icon}</div>
                  <h4 style={{ color: "white", fontWeight: 700, fontSize: "0.88rem", margin: "0 0 0.35rem" }}>{f.title}</h4>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", lineHeight: 1.5, margin: 0 }}>{f.desc}</p>
                </div>
              ))}
            </div>

            <h3 style={{ color: "white", fontWeight: 800, fontSize: "1.05rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ padding: "0.2rem 0.7rem", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.35)", borderRadius: "20px", fontSize: "0.75rem", color: "#34d399" }}>How It Works</span>
              5 Steps to Your Next
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem" }}>
              {STEPS.map((step, i) => (
                <div
                  key={step.num}
                  style={{ display: "flex", gap: "1rem", alignItems: "flex-start", padding: "1rem 1.25rem", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(124,58,237,0.12)", borderRadius: "14px" }}
                >
                  <div style={{ flexShrink: 0, width: "44px", height: "44px", borderRadius: "12px", background: `linear-gradient(135deg, ${i % 2 === 0 ? "#7c3aed, #9333ea" : "#0891b2, #7c3aed"})`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 900, fontSize: "0.9rem" }}>
                    {step.num}
                  </div>
                  <div>
                    <h4 style={{ color: "white", fontWeight: 700, fontSize: "0.9rem", margin: "0 0 0.25rem" }}>{step.title}</h4>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", lineHeight: 1.5, margin: 0 }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center", padding: "1.5rem", background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(245,158,11,0.08))", border: "1px solid rgba(124,58,237,0.25)", borderRadius: "16px" }}>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", marginBottom: "1rem" }}>
                Ready to start your journey?
              </p>
              <button
                onClick={onClose}
                style={{ padding: "0.875rem 2.5rem", background: "linear-gradient(135deg, #7c3aed, #9333ea)", border: "none", borderRadius: "50px", color: "white", fontWeight: 700, fontSize: "1rem", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", boxShadow: "0 0 20px rgba(124,58,237,0.4)" }}
              >
                Get Started →
              </button>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", marginTop: "0.75rem", margin: "0.75rem 0 0" }}>
                Turn your now into your next.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
