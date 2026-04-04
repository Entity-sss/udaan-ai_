import { useParams, useLocation } from "wouter";
import {
  useGetCourse,
  getGetCourseQueryKey,
  useUpdateCourseProgress,
} from "@workspace/api-client-react";
import { getStoredStudent } from "@/lib/auth";
import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useToast } from "@/hooks/use-toast";

export default function CourseDetail() {
  const params = useParams<{ courseId: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const student = getStoredStudent();
  const [activeTab, setActiveTab] = useState<"lectures" | "notes" | "progress">("lectures");

  const { data: courseData, isLoading, refetch } = useGetCourse(params.courseId, {
    query: {
      enabled: !!params.courseId,
      queryKey: getGetCourseQueryKey(params.courseId),
    },
  });

  const updateProgress = useUpdateCourseProgress();

  async function handleMarkComplete(lectureId: string) {
    if (!student) return;
    try {
      await updateProgress.mutateAsync({
        studentId: student.id,
        courseId: params.courseId,
        data: { lectureId, completed: true },
      });
      toast({ title: "Lecture marked as complete!" });
      refetch();
    } catch {
      toast({ title: "Failed to update progress", variant: "destructive" });
    }
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

  if (!courseData) {
    return (
      <div style={{ padding: "2rem" }}>
        <button
          onClick={() => setLocation("/courses")}
          style={{
            background: "transparent",
            border: "1px solid rgba(124,58,237,0.3)",
            color: "#a78bfa",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            cursor: "pointer",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          Back to Courses
        </button>
        <p style={{ color: "rgba(255,255,255,0.5)", marginTop: "1rem" }}>Course not found</p>
      </div>
    );
  }

  const { course, lectures, notes, progressChart } = courseData;

  const difficultyColors: Record<string, string> = {
    beginner: "#10b981",
    intermediate: "#f59e0b",
    advanced: "#ef4444",
  };

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: "0.6rem 1.5rem",
    border: "none",
    background: active ? "rgba(124,58,237,0.25)" : "transparent",
    borderBottom: active ? "2px solid #7c3aed" : "2px solid transparent",
    color: active ? "#c084fc" : "rgba(255,255,255,0.5)",
    cursor: "pointer",
    fontWeight: active ? 600 : 400,
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "0.9rem",
    transition: "all 0.2s",
  });

  return (
    <div style={{ padding: "1.5rem", maxWidth: "900px" }}>
      <button
        onClick={() => setLocation("/courses")}
        style={{
          background: "transparent",
          border: "1px solid rgba(124,58,237,0.2)",
          color: "#a78bfa",
          padding: "0.4rem 0.875rem",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "0.8rem",
          fontFamily: "'Space Grotesk', sans-serif",
          marginBottom: "1.5rem",
        }}
      >
        Back to Courses
      </button>

      <div
        style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(13,10,40,0.9))",
          border: "1px solid rgba(124,58,237,0.25)",
          borderRadius: "20px",
          padding: "2rem",
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
          <span
            style={{
              padding: "0.25rem 0.75rem",
              borderRadius: "6px",
              fontSize: "0.75rem",
              fontWeight: 700,
              color: difficultyColors[course.difficulty] || "white",
              background: `${difficultyColors[course.difficulty]}20`,
              border: `1px solid ${difficultyColors[course.difficulty]}40`,
              textTransform: "capitalize",
            }}
          >
            {course.difficulty}
          </span>
          <span
            style={{
              padding: "0.25rem 0.75rem",
              borderRadius: "6px",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "#a78bfa",
              background: "rgba(124,58,237,0.15)",
              border: "1px solid rgba(124,58,237,0.3)",
            }}
          >
            {course.category}
          </span>
        </div>

        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "white", marginBottom: "0.75rem" }}>
          {course.title}
        </h1>
        <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.6, marginBottom: "1rem" }}>
          {course.description}
        </p>

        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>
            {course.totalLectures} lectures
          </span>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>
            {course.duration}
          </span>
          {course.instructor && (
            <span style={{ color: "#a78bfa", fontSize: "0.85rem" }}>
              by {course.instructor}
            </span>
          )}
          <span style={{ color: "#f59e0b", fontSize: "0.85rem" }}>
            {course.rating?.toFixed(1) || "4.5"} Rating
          </span>
        </div>
      </div>

      <div
        style={{
          background: "rgba(13,10,40,0.8)",
          border: "1px solid rgba(124,58,237,0.2)",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", borderBottom: "1px solid rgba(124,58,237,0.15)" }}>
          <button style={tabStyle(activeTab === "lectures")} onClick={() => setActiveTab("lectures")}>
            Lectures ({lectures.length})
          </button>
          <button style={tabStyle(activeTab === "notes")} onClick={() => setActiveTab("notes")}>
            Notes ({notes.length})
          </button>
          <button style={tabStyle(activeTab === "progress")} onClick={() => setActiveTab("progress")}>
            Progress
          </button>
        </div>

        <div style={{ padding: "1.5rem" }}>
          {activeTab === "lectures" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {lectures.map((lecture, idx) => (
                <div
                  key={lecture.id}
                  data-testid={`lecture-${lecture.id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem 1.25rem",
                    background: lecture.isCompleted ? "rgba(16,185,129,0.05)" : "rgba(124,58,237,0.05)",
                    border: `1px solid ${lecture.isCompleted ? "rgba(16,185,129,0.2)" : "rgba(124,58,237,0.15)"}`,
                    borderRadius: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: lecture.isCompleted
                        ? "rgba(16,185,129,0.2)"
                        : "rgba(124,58,237,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: lecture.isCompleted ? "#34d399" : "#a78bfa",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      flexShrink: 0,
                    }}
                  >
                    {lecture.isCompleted ? "✓" : idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: "white", fontWeight: 600, fontSize: "0.9rem" }}>
                      {lecture.title}
                    </p>
                    {lecture.description && (
                      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem" }}>
                        {lecture.description}
                      </p>
                    )}
                    <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.75rem" }}>
                      {lecture.duration}
                    </p>
                  </div>
                  {!lecture.isCompleted && student && (
                    <button
                      data-testid={`button-complete-${lecture.id}`}
                      onClick={() => handleMarkComplete(lecture.id)}
                      disabled={updateProgress.isPending}
                      style={{
                        padding: "0.4rem 0.875rem",
                        background: "rgba(124,58,237,0.15)",
                        border: "1px solid rgba(124,58,237,0.3)",
                        borderRadius: "8px",
                        color: "#a78bfa",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        fontFamily: "'Space Grotesk', sans-serif",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              ))}

              {lectures.length === 0 && (
                <p style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "2rem" }}>
                  No lectures available yet
                </p>
              )}
            </div>
          )}

          {activeTab === "notes" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {notes.map(note => (
                <div
                  key={note.id}
                  data-testid={`note-${note.id}`}
                  style={{
                    padding: "1.25rem",
                    background: "rgba(124,58,237,0.07)",
                    border: "1px solid rgba(124,58,237,0.15)",
                    borderRadius: "12px",
                    borderLeft: "3px solid #7c3aed",
                  }}
                >
                  <h4 style={{ color: "#c084fc", fontWeight: 700, marginBottom: "0.5rem", fontSize: "0.95rem" }}>
                    {note.title}
                  </h4>
                  <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.7, fontSize: "0.875rem" }}>
                    {note.content}
                  </p>
                </div>
              ))}
              {notes.length === 0 && (
                <p style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "2rem" }}>
                  No notes available for this course
                </p>
              )}
            </div>
          )}

          {activeTab === "progress" && (
            <div>
              <h3 style={{ color: "white", fontWeight: 600, marginBottom: "1.25rem" }}>
                Your Progress Over Time
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={progressChart || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.1)" />
                  <XAxis dataKey="week" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(13,10,40,0.95)",
                      border: "1px solid rgba(124,58,237,0.3)",
                      borderRadius: "10px",
                      color: "white",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="percentage"
                    stroke="#7c3aed"
                    strokeWidth={3}
                    dot={{ fill: "#7c3aed", r: 5 }}
                    activeDot={{ r: 7, fill: "#a78bfa" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
