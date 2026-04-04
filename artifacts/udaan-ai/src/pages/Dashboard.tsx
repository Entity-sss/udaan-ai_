import { useLocation } from "wouter";
import {
  useGetStudentDashboard,
  getGetStudentDashboardQueryKey,
} from "@workspace/api-client-react";
import { getStoredStudent } from "@/lib/auth";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, RadialBar, RadialBarChart, Legend,
} from "recharts";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const student = getStoredStudent();

  const { data: dashboard, isLoading } = useGetStudentDashboard(student?.id || "", {
    query: {
      enabled: !!student?.id,
      queryKey: getGetStudentDashboardQueryKey(student?.id || ""),
    },
  });

  if (!student) {
    setLocation("/signup");
    return null;
  }

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", display: "flex", alignItems: "center", justifyContent: "center", height: "80vh" }}>
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

  const stats = [
    { label: "Courses Enrolled", value: dashboard?.coursesEnrolled || 0, color: "#7c3aed" },
    { label: "Completed", value: dashboard?.coursesCompleted || 0, color: "#10b981" },
    { label: "Day Streak", value: dashboard?.streak || 0, color: "#f59e0b" },
    { label: "Total Points", value: dashboard?.totalPoints || 0, color: "#06b6d4" },
    { label: "Certificates", value: dashboard?.certificates || 0, color: "#ec4899" },
  ];

  const cardStyle: React.CSSProperties = {
    background: "rgba(13,10,40,0.8)",
    border: "1px solid rgba(124,58,237,0.2)",
    borderRadius: "16px",
    padding: "1.5rem",
  };

  return (
    <div style={{ padding: "1.5rem", maxWidth: "1100px" }}>
      <h1
        style={{
          fontSize: "1.75rem",
          fontWeight: 700,
          color: "white",
          marginBottom: "0.5rem",
        }}
      >
        Dashboard
      </h1>
      <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "2rem" }}>
        Welcome back, {dashboard?.student?.name || student.name}
      </p>

      <div style={{ ...cardStyle, marginBottom: "1.5rem", display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #7c3aed, #9333ea)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 800,
            fontSize: "1.8rem",
            flexShrink: 0,
          }}
        >
          {(dashboard?.student?.name || student.name)?.[0]?.toUpperCase() || "S"}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ color: "white", fontWeight: 700, fontSize: "1.25rem", marginBottom: "0.25rem" }}>
            {dashboard?.student?.name || student.name}
          </h2>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <span
              style={{
                background: "rgba(124,58,237,0.2)",
                border: "1px solid rgba(124,58,237,0.35)",
                color: "#a78bfa",
                padding: "0.2rem 0.75rem",
                borderRadius: "20px",
                fontSize: "0.8rem",
                fontWeight: 600,
              }}
            >
              {dashboard?.student?.studentId || student.studentId}
            </span>
            {dashboard?.student?.branch && (
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem" }}>
                {dashboard.student.branch}
              </span>
            )}
            {dashboard?.student?.college && (
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem" }}>
                {dashboard.student.college}
              </span>
            )}
            {dashboard?.student?.semester && (
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem" }}>
                Semester {dashboard.student.semester}
              </span>
            )}
          </div>
          <div style={{ marginTop: "0.5rem" }}>
            <span
              style={{
                background: "rgba(16,185,129,0.15)",
                border: "1px solid rgba(16,185,129,0.3)",
                color: "#34d399",
                padding: "0.15rem 0.6rem",
                borderRadius: "20px",
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            >
              {dashboard?.student?.skillLevel || "Beginner"} Level
            </span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ color: "#f59e0b", fontSize: "1.5rem", fontWeight: 800 }}>
            {dashboard?.overallProgress || 0}%
          </p>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem" }}>Overall Progress</p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {stats.map(stat => (
          <div
            key={stat.label}
            data-testid={`stat-${stat.label.toLowerCase().replace(" ", "-")}`}
            style={{
              ...cardStyle,
              textAlign: "center",
              borderTop: `3px solid ${stat.color}`,
            }}
          >
            <p
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                color: stat.color,
                marginBottom: "0.25rem",
              }}
            >
              {stat.value}
            </p>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.8rem" }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <div style={cardStyle}>
          <h3 style={{ color: "white", fontWeight: 600, marginBottom: "1rem", fontSize: "1rem" }}>
            Weekly Study Activity
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dashboard?.weeklyProgressData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.1)" />
              <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "rgba(13,10,40,0.95)",
                  border: "1px solid rgba(124,58,237,0.3)",
                  borderRadius: "10px",
                  color: "white",
                }}
              />
              <Bar dataKey="hours" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              <Bar dataKey="lectures" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={cardStyle}>
          <h3 style={{ color: "white", fontWeight: 600, marginBottom: "1rem", fontSize: "1rem" }}>
            Skill Distribution
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={dashboard?.skillDistribution || []}>
              <PolarGrid stroke="rgba(124,58,237,0.15)" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} />
              <Radar name="Level" dataKey="level" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.25} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={{ color: "white", fontWeight: 600, marginBottom: "1rem", fontSize: "1rem" }}>
          Recent Activity
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {(dashboard?.recentActivity || []).map((activity, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.75rem",
                background: "rgba(124,58,237,0.05)",
                border: "1px solid rgba(124,58,237,0.1)",
                borderRadius: "12px",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background:
                    activity.type === "lecture"
                      ? "rgba(124,58,237,0.2)"
                      : activity.type === "quiz"
                        ? "rgba(245,158,11,0.2)"
                        : "rgba(16,185,129,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color:
                    activity.type === "lecture" ? "#a78bfa" : activity.type === "quiz" ? "#f59e0b" : "#34d399",
                  flexShrink: 0,
                }}
              >
                {activity.type === "lecture" ? "L" : activity.type === "quiz" ? "Q" : "C"}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.875rem" }}>
                  {activity.description}
                </p>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>
                  {new Date(activity.timestamp).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {activity.points && (
                <span
                  style={{
                    color: "#f59e0b",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                  }}
                >
                  +{activity.points} pts
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
