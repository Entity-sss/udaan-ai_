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
import { getConfirmedRoadmapProfile } from "@/lib/assessment-draft";
import { Storage } from "@/lib/storage";

function formatDuration(timePerDayMinutes: number): string {
  if (timePerDayMinutes <= 30) return "20-24 weeks";
  if (timePerDayMinutes <= 60) return "12-16 weeks";
  if (timePerDayMinutes <= 120) return "8-10 weeks";
  return "4-6 weeks";
}

function estimatePhases(timePerDayMinutes: number): number {
  if (timePerDayMinutes <= 30) return 8;
  if (timePerDayMinutes <= 60) return 6;
  if (timePerDayMinutes <= 120) return 5;
  return 4;
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const student = getStoredStudent();
  const confirmedRoadmap = getConfirmedRoadmapProfile();
  const storedRoadmap = Storage.getRoadmap();
  
  // Use confirmedRoadmap first, then fall back to storedRoadmap
  const roadmapData = confirmedRoadmap || storedRoadmap;

  const { data: dashboard, isLoading } = useGetStudentDashboard(student?.id || "", {
    query: {
      enabled: !!student?.id,
      queryKey: getGetStudentDashboardQueryKey(student?.id || ""),
    },
  });

  // Get overall progress from localStorage as fallback
  const storageProgress = Storage.getOverallProgress();

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

  // Count the number of skills in user's roadmap for Courses Enrolled
  const skillsCount = roadmapData 
    ? Array.from(new Set([...(roadmapData.interests || []), ...(roadmapData.extraSkills || [])])).length
    : dashboard?.coursesEnrolled || 0;

  // Use storage progress if dashboard data is not available
  const phasesCompleted = storageProgress.phasesCompleted || dashboard?.coursesCompleted || 0;
  const totalPoints = storageProgress.totalPoints || dashboard?.totalPoints || 0;

  const stats = [
    { label: "Courses Enrolled", value: skillsCount, color: "#7c3aed" },
    { label: "Completed", value: phasesCompleted, color: "#10b981" },
    { label: "Day Streak", value: dashboard?.streak || 0, color: "#f59e0b" },
    { label: "Total Points", value: totalPoints, color: "#06b6d4" },
    { label: "Certificates", value: dashboard?.certificates || 0, color: "#ec4899" },
  ];

  // Generate skill distribution data from actual confirmed roadmap skills
  const skillDistributionData = roadmapData 
    ? Array.from(new Set([...(roadmapData.interests || []), ...(roadmapData.extraSkills || [])])).map(skill => ({
        skill,
        level: Math.floor(Math.random() * 40) + 60, // Random level between 60-100 for demo
      }))
    : dashboard?.skillDistribution || [];

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

      {roadmapData && (
        <div style={{ ...cardStyle, marginBottom: "1.25rem" }}>
          <h3 style={{ color: "white", fontWeight: 700, marginBottom: "0.8rem", fontSize: "1rem" }}>
            Your Selected Skills
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.65rem", marginBottom: "0.9rem" }}>
            {Array.from(new Set([...(roadmapData.interests || []), ...(roadmapData.extraSkills || [])])).map(skill => (
              <div
                key={skill}
                style={{
                  background: "rgba(124,58,237,0.16)",
                  border: "1px solid rgba(124,58,237,0.35)",
                  borderRadius: "12px",
                  padding: "0.65rem 0.75rem",
                  color: "white",
                  fontWeight: 700,
                }}
              >
                ✨ {skill}
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.65rem" }}>
            <div style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: "10px", padding: "0.65rem" }}>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.55)", fontSize: "0.75rem" }}>Track</p>
              <p style={{ margin: "0.25rem 0 0", color: "white", fontWeight: 700 }}>{roadmapData.field || roadmapData.track || "General Tech"}</p>
            </div>
            <div style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: "10px", padding: "0.65rem" }}>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.55)", fontSize: "0.75rem" }}>Duration</p>
              <p style={{ margin: "0.25rem 0 0", color: "white", fontWeight: 700 }}>{formatDuration(roadmapData.timePerDayMinutes || 60)}</p>
            </div>
            <div style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: "10px", padding: "0.65rem" }}>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.55)", fontSize: "0.75rem" }}>Phases</p>
              <p style={{ margin: "0.25rem 0 0", color: "white", fontWeight: 700 }}>{estimatePhases(roadmapData.timePerDayMinutes || 60)}</p>
            </div>
          </div>
        </div>
      )}

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
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = `0 8px 25px ${stat.color}25`;
              e.currentTarget.style.borderTopColor = stat.color;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
            style={{
              ...cardStyle,
              textAlign: "center",
              borderTop: `3px solid ${stat.color}`,
              transition: "all 0.3s ease",
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

      <div style={{ ...cardStyle, marginBottom: "1.5rem" }}>
        <h3 style={{ color: "white", fontWeight: 700, marginBottom: "0.8rem", fontSize: "1rem" }}>
          Quick Access
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.7rem" }}>
          {[
            { label: "Skills", path: "/skills", icon: "🧩" },
            { label: "My Roadmap", path: "/roadmap", icon: "🗺️" },
            { label: "Courses", path: "/courses", icon: "📚" },
            { label: "Mock Test", path: "/mock-test", icon: "🧠" },
          ].map(item => (
            <button
              key={item.label}
              onClick={() => setLocation(item.path)}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(124,58,237,0.3)";
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(124,58,237,0.75), rgba(147,51,234,0.65))";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.background = "linear-gradient(135deg, rgba(124,58,237,0.6), rgba(147,51,234,0.55))";
              }}
              style={{
                background: "linear-gradient(135deg, rgba(124,58,237,0.6), rgba(147,51,234,0.55))",
                border: "1px solid rgba(124,58,237,0.45)",
                color: "white",
                borderRadius: "12px",
                padding: "0.75rem 0.85rem",
                fontWeight: 700,
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <span style={{ marginRight: "0.4rem" }}>{item.icon}</span>{item.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem", marginBottom: "1.5rem" }}>
        {[
          {
            title: "Mock Test",
            desc: "Test your knowledge with timed MCQs across Python, JS, ML, DSA & Web Dev",
            path: "/mock-test",
            gradient: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
            glow: "rgba(124,58,237,0.4)",
            badge: "10 Questions · Timed",
            icon: "✦",
          },
          {
            title: "Mock Interview",
            desc: "Simulate real technical interviews for Frontend, Backend, ML, Full Stack & Data Science roles",
            path: "/mock-interview",
            gradient: "linear-gradient(135deg, #0891b2 0%, #7c3aed 100%)",
            glow: "rgba(8,145,178,0.4)",
            badge: "5 Questions · Role-based",
            icon: "◈",
          },
          {
            title: "Resume Builder",
            desc: "Auto-generates your resume from courses, certificates & skills earned on the platform",
            path: "/resume",
            gradient: "linear-gradient(135deg, #059669 0%, #0891b2 100%)",
            glow: "rgba(5,150,105,0.4)",
            badge: "Auto-updated · Printable",
            icon: "✎",
          },
        ].map(item => (
          <div
            key={item.title}
            data-testid={`card-${item.title.toLowerCase().replace(" ", "-")}`}
            onClick={() => setLocation(item.path)}
            style={{
              background: "rgba(13,10,40,0.85)",
              border: "1px solid rgba(124,58,237,0.2)",
              borderRadius: "18px",
              padding: "1.5rem",
              cursor: "pointer",
              transition: "all 0.25s ease",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = `0 8px 30px ${item.glow}`;
              e.currentTarget.style.borderColor = "rgba(124,58,237,0.5)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "rgba(124,58,237,0.2)";
            }}
          >
            <div style={{ position: "absolute", top: 0, right: 0, width: "120px", height: "120px", background: item.gradient, opacity: 0.08, borderRadius: "0 18px 0 100%", pointerEvents: "none" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.875rem" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: item.gradient, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "1.25rem" }}>
                {item.icon}
              </div>
              <span style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", padding: "0.2rem 0.625rem", borderRadius: "20px", fontSize: "0.7rem", fontWeight: 600 }}>
                {item.badge}
              </span>
            </div>
            <h3 style={{ color: "white", fontWeight: 800, fontSize: "1.1rem", marginBottom: "0.4rem" }}>{item.title}</h3>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", lineHeight: 1.5, marginBottom: "1rem" }}>{item.desc}</p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.4rem 0.875rem", background: item.gradient, borderRadius: "8px", color: "white", fontWeight: 700, fontSize: "0.8rem", boxShadow: `0 0 12px ${item.glow}` }}>
              Start Now →
            </div>
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
            <RadarChart data={skillDistributionData}>
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
