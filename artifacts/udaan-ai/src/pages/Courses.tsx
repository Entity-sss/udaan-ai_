import { useState } from "react";
import { useLocation } from "wouter";
import {
  useGetCourses,
  getGetCoursesQueryKey,
} from "@workspace/api-client-react";

export default function Courses() {
  const [, setLocation] = useLocation();
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const { data: courses, isLoading } = useGetCourses({
    query: { queryKey: getGetCoursesQueryKey() },
  });

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

  const difficulties = ["all", "beginner", "intermediate", "advanced"];
  const categories = ["all", ...Array.from(new Set((courses || []).map(c => c.category)))];

  const filtered = (courses || []).filter(c => {
    if (filterDifficulty !== "all" && c.difficulty !== filterDifficulty) return false;
    if (filterCategory !== "all" && c.category !== filterCategory) return false;
    return true;
  });

  const difficultyColors: Record<string, string> = {
    beginner: "#10b981",
    intermediate: "#f59e0b",
    advanced: "#ef4444",
  };

  const categoryGradients: Record<string, string> = {
    "AI/ML": "linear-gradient(135deg, #7c3aed, #4f46e5)",
    "Web Development": "linear-gradient(135deg, #0891b2, #0e7490)",
    "Data Science": "linear-gradient(135deg, #9333ea, #7c3aed)",
    "DevOps": "linear-gradient(135deg, #f59e0b, #d97706)",
    "Mobile Dev": "linear-gradient(135deg, #ec4899, #be185d)",
  };

  return (
    <div style={{ padding: "1.5rem", maxWidth: "1100px" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "white", marginBottom: "0.5rem" }}>
        Courses
      </h1>
      <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "2rem" }}>
        Turn your now into your next — explore courses built for your journey
      </p>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {difficulties.map(d => (
            <button
              key={d}
              data-testid={`filter-difficulty-${d}`}
              onClick={() => setFilterDifficulty(d)}
              style={{
                padding: "0.4rem 0.875rem",
                borderRadius: "20px",
                border: filterDifficulty === d ? "1px solid rgba(124,58,237,0.6)" : "1px solid rgba(255,255,255,0.1)",
                background: filterDifficulty === d ? "rgba(124,58,237,0.2)" : "transparent",
                color: filterDifficulty === d ? "#c084fc" : "rgba(255,255,255,0.5)",
                cursor: "pointer",
                fontSize: "0.8rem",
                fontWeight: 500,
                textTransform: "capitalize",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {d}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {categories.map(c => (
            <button
              key={c}
              data-testid={`filter-category-${c}`}
              onClick={() => setFilterCategory(c)}
              style={{
                padding: "0.4rem 0.875rem",
                borderRadius: "20px",
                border: filterCategory === c ? "1px solid rgba(245,158,11,0.6)" : "1px solid rgba(255,255,255,0.1)",
                background: filterCategory === c ? "rgba(245,158,11,0.15)" : "transparent",
                color: filterCategory === c ? "#f59e0b" : "rgba(255,255,255,0.5)",
                cursor: "pointer",
                fontSize: "0.8rem",
                fontWeight: 500,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {filtered.map(course => (
          <div
            key={course.id}
            data-testid={`card-course-${course.id}`}
            onClick={() => setLocation(`/courses/${course.id}`)}
            style={{
              background: "rgba(13,10,40,0.85)",
              border: "1px solid rgba(124,58,237,0.2)",
              borderRadius: "16px",
              overflow: "hidden",
              cursor: "pointer",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.borderColor = "rgba(124,58,237,0.5)";
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(124,58,237,0.2)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "rgba(124,58,237,0.2)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              style={{
                height: "120px",
                background: categoryGradients[course.category] || "linear-gradient(135deg, #7c3aed, #9333ea)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.5rem",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
                  {course.category}
                </span>
              </div>
            </div>

            <div style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                <span
                  style={{
                    padding: "0.2rem 0.6rem",
                    borderRadius: "6px",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: difficultyColors[course.difficulty] || "white",
                    background: `${difficultyColors[course.difficulty]}20`,
                    textTransform: "capitalize",
                    border: `1px solid ${difficultyColors[course.difficulty]}40`,
                  }}
                >
                  {course.difficulty}
                </span>
              </div>

              <h3
                style={{
                  color: "white",
                  fontWeight: 700,
                  fontSize: "1rem",
                  marginBottom: "0.5rem",
                  lineHeight: 1.4,
                }}
              >
                {course.title}
              </h3>
              <p
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "0.8rem",
                  lineHeight: 1.5,
                  marginBottom: "1rem",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {course.description}
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: "0.75rem",
                  borderTop: "1px solid rgba(124,58,237,0.1)",
                }}
              >
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>
                  {course.totalLectures} lectures • {course.duration}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <span style={{ color: "#f59e0b", fontSize: "0.75rem" }}>
                    {"★".repeat(Math.round(course.rating || 4.5))}
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>
                    {course.rating || "4.5"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          No courses found for the selected filters
        </div>
      )}
    </div>
  );
}
