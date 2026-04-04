import {
  useGetProgress,
  getGetProgressQueryKey,
} from "@workspace/api-client-react";
import { getStoredStudent } from "@/lib/auth";
import { useLocation } from "wouter";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from "recharts";

export default function Progress() {
  const [, setLocation] = useLocation();
  const student = getStoredStudent();

  const { data: progressData, isLoading } = useGetProgress(student?.id || "", {
    query: {
      enabled: !!student?.id,
      queryKey: getGetProgressQueryKey(student?.id || ""),
    },
  });

  if (!student) {
    setLocation("/signup");
    return null;
  }

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", display: "flex", alignItems: "center", justifyContent: "center", height: "70vh" }}>
        <div
          style={{
            width: "50px",
            height: "50px",
            border: "3px solid rgba(124,58,237,0.3)",
            borderTop: "3px solid #7c3aed",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const cardStyle: React.CSSProperties = {
    background: "rgba(13,10,40,0.8)",
    border: "1px solid rgba(124,58,237,0.2)",
    borderRadius: "16px",
    padding: "1.5rem",
  };

  return (
    <div style={{ padding: "1.5rem", maxWidth: "1000px" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "white", marginBottom: "0.5rem" }}>
        Progress Tracker
      </h1>
      <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "2rem" }}>
        Turn your now into your next — every step forward counts
      </p>

      <div
        style={{
          ...cardStyle,
          marginBottom: "1.5rem",
          textAlign: "center",
          background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(13,10,40,0.9))",
        }}
      >
        <p style={{ fontSize: "3.5rem", fontWeight: 900, color: "#a78bfa", marginBottom: "0.25rem" }}>
          {progressData?.overallProgress || 0}%
        </p>
        <p style={{ color: "rgba(255,255,255,0.5)" }}>Overall Progress</p>
        <div
          style={{
            height: "8px",
            background: "rgba(255,255,255,0.08)",
            borderRadius: "4px",
            overflow: "hidden",
            margin: "1rem auto 0",
            maxWidth: "400px",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progressData?.overallProgress || 0}%`,
              background: "linear-gradient(90deg, #7c3aed, #9333ea)",
              borderRadius: "4px",
              transition: "width 1s ease",
            }}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
        <div style={cardStyle}>
          <h3 style={{ color: "white", fontWeight: 600, marginBottom: "1rem", fontSize: "1rem" }}>
            Monthly Study Hours
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={progressData?.monthlyData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.1)" />
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "rgba(13,10,40,0.95)",
                  border: "1px solid rgba(124,58,237,0.3)",
                  borderRadius: "10px",
                  color: "white",
                }}
              />
              <Bar dataKey="hoursStudied" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Hours" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={cardStyle}>
          <h3 style={{ color: "white", fontWeight: 600, marginBottom: "1rem", fontSize: "1rem" }}>
            Lectures Completed per Month
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={progressData?.monthlyData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.1)" />
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "rgba(13,10,40,0.95)",
                  border: "1px solid rgba(124,58,237,0.3)",
                  borderRadius: "10px",
                  color: "white",
                }}
              />
              <Line type="monotone" dataKey="lecturesCompleted" stroke="#f59e0b" strokeWidth={3} dot={{ fill: "#f59e0b", r: 5 }} name="Lectures" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={{ color: "white", fontWeight: 600, marginBottom: "1.25rem", fontSize: "1rem" }}>
          Course-wise Progress
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {(progressData?.courseProgress || []).map(cp => (
            <div key={cp.courseId} data-testid={`progress-${cp.courseId}`}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.875rem", fontWeight: 500 }}>
                  {cp.courseName}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>
                    {cp.completedLectures}/{cp.totalLectures} lectures
                  </span>
                  <span style={{ color: "#a78bfa", fontWeight: 700, fontSize: "0.875rem" }}>
                    {cp.progress}%
                  </span>
                </div>
              </div>
              <div
                style={{
                  height: "8px",
                  background: "rgba(255,255,255,0.07)",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${cp.progress}%`,
                    background:
                      cp.progress >= 100
                        ? "linear-gradient(90deg, #10b981, #34d399)"
                        : cp.progress >= 50
                          ? "linear-gradient(90deg, #7c3aed, #9333ea)"
                          : "linear-gradient(90deg, #f59e0b, #fbbf24)",
                    borderRadius: "4px",
                    transition: "width 0.8s ease",
                  }}
                />
              </div>
            </div>
          ))}

          {(progressData?.courseProgress || []).length === 0 && (
            <p style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "2rem" }}>
              No course progress yet. Start learning from your roadmap!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
