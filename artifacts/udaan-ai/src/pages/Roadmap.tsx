import {
  useGetRoadmap,
  getGetRoadmapQueryKey,
} from "@workspace/api-client-react";
import { getStoredStudent } from "@/lib/auth";
import { useLocation } from "wouter";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const mockProgressData = [
  { week: "W1", progress: 5 },
  { week: "W2", progress: 15 },
  { week: "W3", progress: 28 },
  { week: "W4", progress: 38 },
  { week: "W5", progress: 50 },
  { week: "W6", progress: 63 },
  { week: "W7", progress: 72 },
  { week: "W8", progress: 85 },
];

export default function Roadmap() {
  const [, setLocation] = useLocation();
  const student = getStoredStudent();

  const { data: roadmap, isLoading, error } = useGetRoadmap(student?.id || "", {
    query: {
      enabled: !!student?.id,
      queryKey: getGetRoadmapQueryKey(student?.id || ""),
    },
  });

  if (!student) {
    setLocation("/signup");
    return null;
  }

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", display: "flex", alignItems: "center", justifyContent: "center", height: "70vh" }}>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "3px solid rgba(124,58,237,0.3)",
              borderTop: "3px solid #7c3aed",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 1rem",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: "rgba(255,255,255,0.6)" }}>Loading your roadmap...</p>
        </div>
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div style={{ padding: "2rem" }}>
        <div
          style={{
            background: "rgba(13,10,40,0.8)",
            border: "1px solid rgba(124,58,237,0.2)",
            borderRadius: "16px",
            padding: "3rem",
            textAlign: "center",
          }}
        >
          <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "1rem" }}>
            No roadmap found. Please complete your assessment first.
          </p>
          <button
            onClick={() => setLocation("/assessment")}
            style={{
              padding: "0.75rem 2rem",
              background: "linear-gradient(135deg, #7c3aed, #9333ea)",
              border: "none",
              borderRadius: "10px",
              color: "white",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Start Assessment
          </button>
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    active: "#7c3aed",
    completed: "#10b981",
    locked: "rgba(255,255,255,0.2)",
  };

  const statusBgColors: Record<string, string> = {
    active: "rgba(124,58,237,0.15)",
    completed: "rgba(16,185,129,0.1)",
    locked: "rgba(255,255,255,0.04)",
  };

  const cardStyle: React.CSSProperties = {
    background: "rgba(13,10,40,0.8)",
    border: "1px solid rgba(124,58,237,0.2)",
    borderRadius: "16px",
    padding: "1.5rem",
    marginBottom: "1.5rem",
  };

  return (
    <div style={{ padding: "1.5rem", maxWidth: "1000px" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "white", marginBottom: "0.5rem" }}>
        Your Learning Roadmap
      </h1>
      <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "2rem" }}>
        {roadmap.description || `Turn your now into your next — your personalized path to mastery`}
      </p>

      <div style={{ ...cardStyle, marginBottom: "2rem" }}>
        <h3 style={{ color: "white", fontWeight: 600, marginBottom: "1rem", fontSize: "1rem" }}>
          Progress Overview
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={mockProgressData}>
            <defs>
              <linearGradient id="progressGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.1)" />
            <XAxis dataKey="week" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "rgba(13,10,40,0.95)",
                border: "1px solid rgba(124,58,237,0.3)",
                borderRadius: "10px",
                color: "white",
              }}
            />
            <Area type="monotone" dataKey="progress" stroke="#7c3aed" strokeWidth={2} fill="url(#progressGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ position: "relative" }}>
        {(roadmap.phases as any[] || []).map((phase: any, idx: number) => (
          <div
            key={phase.phase}
            style={{ display: "flex", gap: "1.5rem", marginBottom: "2rem" }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: statusColors[phase.status],
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: 800,
                  fontSize: "1.1rem",
                  flexShrink: 0,
                  boxShadow: phase.status === "active" ? `0 0 20px rgba(124,58,237,0.5)` : "none",
                  border: `2px solid ${statusColors[phase.status]}`,
                }}
              >
                {phase.status === "completed" ? "✓" : phase.phase}
              </div>
              {idx < (roadmap.phases as any[]).length - 1 && (
                <div
                  style={{
                    width: "2px",
                    flex: 1,
                    minHeight: "60px",
                    background: `linear-gradient(to bottom, ${statusColors[phase.status]}, rgba(124,58,237,0.1))`,
                    marginTop: "0.5rem",
                  }}
                />
              )}
            </div>

            <div
              style={{
                flex: 1,
                background: statusBgColors[phase.status],
                border: `1px solid ${statusColors[phase.status]}30`,
                borderRadius: "16px",
                padding: "1.5rem",
                opacity: phase.status === "locked" ? 0.5 : 1,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: statusColors[phase.status],
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Phase {phase.phase}
                  </span>
                  <h3 style={{ color: "white", fontWeight: 700, fontSize: "1.1rem", margin: "0.25rem 0" }}>
                    {phase.title}
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>{phase.description}</p>
                </div>
                <span
                  style={{
                    padding: "0.25rem 0.875rem",
                    borderRadius: "20px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    background: `${statusColors[phase.status]}20`,
                    border: `1px solid ${statusColors[phase.status]}40`,
                    color: statusColors[phase.status],
                    textTransform: "capitalize",
                  }}
                >
                  {phase.status}
                </span>
              </div>

              {phase.status !== "locked" && (
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                    <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem" }}>Progress</span>
                    <span style={{ color: statusColors[phase.status], fontSize: "0.75rem", fontWeight: 600 }}>
                      {phase.completionPercentage || 0}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: "6px",
                      background: "rgba(255,255,255,0.08)",
                      borderRadius: "3px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${phase.completionPercentage || 0}%`,
                        background: `linear-gradient(90deg, ${statusColors[phase.status]}, ${statusColors[phase.status]}88)`,
                        borderRadius: "3px",
                      }}
                    />
                  </div>
                </div>
              )}

              {(phase.courses || []).length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {(phase.courses as any[]).map((course: any) => (
                    <button
                      key={course.id}
                      data-testid={`button-course-${course.id}`}
                      onClick={() => phase.status !== "locked" && setLocation(`/courses/${course.id}`)}
                      style={{
                        padding: "0.4rem 0.875rem",
                        background: phase.status === "locked" ? "rgba(255,255,255,0.05)" : "rgba(124,58,237,0.15)",
                        border: `1px solid ${phase.status === "locked" ? "rgba(255,255,255,0.1)" : "rgba(124,58,237,0.3)"}`,
                        borderRadius: "8px",
                        color: phase.status === "locked" ? "rgba(255,255,255,0.35)" : "#c084fc",
                        fontSize: "0.8rem",
                        cursor: phase.status === "locked" ? "not-allowed" : "pointer",
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 500,
                      }}
                    >
                      {course.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
