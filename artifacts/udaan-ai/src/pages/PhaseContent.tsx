import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { StarField } from "@/components/StarField";
import logoPath from "/logo.png";
import { getStoredStudent } from "@/lib/auth";
import { getVideosForSkill } from "@/lib/skill-videos";
import { Storage } from "@/lib/storage";

type TabType = "videos" | "study" | "practice";

interface Video {
  id: string;
  title: string;
  duration: string;
  youtubeId: string;
  watched: boolean;
}

interface PracticeExercise {
  id: string;
  description: string;
  completed: boolean;
}

interface PhaseData {
  skillName: string;
  levelName: string;
  phaseName: string;
  phaseNumber: number;
  videos: Video[];
  studyMaterial: string;
  exercises: PracticeExercise[];
}

// Skill-specific phase content mapping
function getPhaseContent(skill: string, level: string, phase: number): PhaseData {
  // Use the new video mapping system
  const videoData = getVideosForSkill(skill, level, phase);

  // Generate generic study material based on skill
  const studyMaterial = `# ${skill} - Phase ${phase}\n\n## Introduction\nWelcome to Phase ${phase} of your ${skill} learning journey. This phase will help you build a strong foundation in ${skill}.\n\n## Learning Objectives\n- Understand the core concepts of ${skill}\n- Apply practical skills through hands-on exercises\n- Build confidence with real-world applications\n\n## Key Topics\n- Fundamentals and best practices\n- Practical implementation techniques\n- Industry-standard tools and workflows\n\n## Tips for Success\n- Practice regularly to reinforce learning\n- Don't hesitate to revisit concepts\n- Apply what you learn to real projects`;

  return {
    skillName: videoData.skillName,
    levelName: videoData.levelName,
    phaseName: videoData.phaseName,
    phaseNumber: videoData.phaseNumber,
    videos: videoData.videos,
    studyMaterial,
    exercises: videoData.exercises,
  };
}

// Sample data for Python - Beginner - Phase 1 (legacy, kept for reference)
const samplePhaseData: PhaseData = {
  skillName: "Python",
  levelName: "Beginner",
  phaseName: "Getting Started",
  phaseNumber: 1,
  videos: [
    { id: "1", title: "Python Introduction", duration: "15:30", youtubeId: "kqtD5dpn9C8", watched: false },
    { id: "2", title: "Variables and Data Types", duration: "12:45", youtubeId: "cQT33yu9pY8", watched: false },
    { id: "3", title: "Control Flow", duration: "18:20", youtubeId: "Zp5MuPOtsSY", watched: false },
  ],
  studyMaterial: "# Python Basics - Phase 1\n\n## Introduction to Python\nPython is a high-level, interpreted programming language known for its simplicity and readability. It's widely used in web development, data science, automation, and more.\n\n## Variables and Data Types\n\n### Variables\nVariables are containers for storing data values.\n\n### Data Types\nPython has several built-in data types:\n\n- String: Text data (e.g., Hello)\n- Integer: Whole numbers (e.g., 42)\n- Float: Decimal numbers (e.g., 3.14)\n- Boolean: True or False\n- List: Ordered collection of items\n\n## Control Flow\n\n### If Statements\nConditional execution of code based on conditions.\n\n### Loops\n- For Loop: Iterate over sequences\n- While Loop: Repeat while condition is true\n\n## Key Points to Remember\n- Python uses indentation to define code blocks\n- Variables are dynamically typed\n- Comments start with #\n- Print statements use print()",
  exercises: [
    { id: "1", description: "Write a Hello World program", completed: false },
    { id: "2", description: "Create variables of different types (string, int, float, boolean)", completed: false },
    { id: "3", description: "Write a simple if-else program to check if a number is positive or negative", completed: false },
  ],
};

export default function PhaseContent() {
  const { skillId, levelId, phaseId } = useParams<{ skillId: string; levelId: string; phaseId: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>("videos");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [phaseComplete, setPhaseComplete] = useState(false);

  // Get skill-specific phase content based on URL parameters
  const parsedPhaseId = parseInt(phaseId || "1");
  const validPhaseId = isNaN(parsedPhaseId) ? 1 : parsedPhaseId;
  
  // Debug: Log skillId from URL
  console.log('Skill ID from URL:', skillId);
  console.log('Level ID from URL:', levelId);
  console.log('Phase ID from URL:', phaseId);
  
  const initialPhaseData = getPhaseContent(
    skillId || "Python",
    levelId || "Beginner",
    validPhaseId
  );
  const [phaseData, setPhaseData] = useState<PhaseData>(initialPhaseData);

  const watchedCount = phaseData.videos.filter(v => v.watched).length;
  const completedExercises = phaseData.exercises.filter(e => e.completed).length;
  const totalProgress = Math.round(((watchedCount + completedExercises) / (phaseData.videos.length + phaseData.exercises.length)) * 100);

  function toggleWatched(videoId: string) {
    setPhaseData((prev: PhaseData) => ({
      ...prev,
      videos: prev.videos.map((v: Video) => v.id === videoId ? { ...v, watched: !v.watched } : v),
    }));
    toast({ title: "Video marked as watched" });
  }

  function toggleExercise(exerciseId: string) {
    setPhaseData((prev: PhaseData) => ({
      ...prev,
      exercises: prev.exercises.map((e: PracticeExercise) => e.id === exerciseId ? { ...e, completed: !e.completed } : e),
    }));
    toast({ title: "Exercise marked as complete" });
  }

  async function handlePhaseComplete() {
    if (totalProgress < 50) {
      toast({ title: "Please complete at least 50% of content first" });
      return;
    }

    const student = getStoredStudent();
    if (student && skillId && levelId) {
      try {
        // Initialize progress if not exists
        await fetch(`/api/skill-progress/initialize/${student.id}/${skillId}`, {
          method: "POST",
        });

        // Mark phase as completed
        await fetch(`/api/skill-progress/progress/${student.id}/${skillId}/${validPhaseId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "completed", level: levelId }),
        });
      } catch (error) {
        console.error("Failed to save phase progress:", error);
      }

      // Save to localStorage using Storage utility
      Storage.saveProgress(skillId, levelId, validPhaseId, {
        completed: true,
        completedAt: Date.now()
      });
      
      // Also mark phase as complete using the dedicated method
      Storage.savePhaseComplete(skillId, levelId, validPhaseId, totalProgress);
    }

    setPhaseComplete(true);
    toast({ title: "Phase completed! Starting phase test..." });
    setLocation(`/mock-test?skillId=${skillId}&levelId=${levelId}&phaseId=${validPhaseId}&testType=phase`);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0d0b1e", position: "relative", padding: "1.25rem" }}>
      <StarField />

      <div style={{ position: "relative", zIndex: 10, maxWidth: "1000px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span style={{ color: "#a78bfa", fontSize: "0.85rem" }}>{phaseData.skillName}</span>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>›</span>
            <span style={{ color: "#a78bfa", fontSize: "0.85rem" }}>{phaseData.levelName}</span>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>›</span>
            <span style={{ color: "#c4b5fd", fontSize: "0.85rem", fontWeight: 600 }}>Phase {phaseData.phaseNumber}</span>
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "white", marginBottom: "0.5rem" }}>{phaseData.phaseName}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ flex: 1, height: "8px", borderRadius: "999px", background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${totalProgress}%`, background: "linear-gradient(90deg, #4c35c8, #9333ea)", borderRadius: "999px", transition: "width 0.3s ease" }} />
            </div>
            <span style={{ color: "#a78bfa", fontSize: "0.85rem", fontWeight: 700 }}>{totalProgress}%</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "1px solid rgba(76,53,200,0.2)", paddingBottom: "0.5rem" }}>
          {[
            { id: "videos" as TabType, label: "📹 Videos" },
            { id: "study" as TabType, label: "📖 Study Material" },
            { id: "practice" as TabType, label: "💻 Practice" },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "0.75rem 1.5rem",
                border: "none",
                borderRadius: "12px",
                background: activeTab === tab.id ? "linear-gradient(135deg, rgba(76,53,200,0.7), rgba(147,51,234,0.55))" : "transparent",
                color: activeTab === tab.id ? "white" : "rgba(255,255,255,0.6)",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "0.95rem",
                transition: "all 0.2s ease",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ background: "rgba(13,10,40,0.85)", border: "1px solid rgba(76,53,200,0.28)", borderRadius: "18px", padding: "1.5rem", marginBottom: "2rem", minHeight: "400px" }}>
          {activeTab === "videos" && (
            <div>
              {selectedVideo ? (
                <div>
                  <button
                    type="button"
                    onClick={() => setSelectedVideo(null)}
                    style={{ padding: "0.5rem 1rem", border: "1px solid rgba(76,53,200,0.45)", borderRadius: "12px", background: "transparent", color: "white", fontWeight: 700, cursor: "pointer", marginBottom: "1rem" }}
                  >
                    ← Back to Videos
                  </button>
                  <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: "12px", overflow: "hidden" }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=0&rel=0&modestbranding=1`}
                      title={selectedVideo.title}
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ color: "white", fontSize: "1.2rem", fontWeight: 700 }}>{selectedVideo.title}</h3>
                    <button
                      type="button"
                      onClick={() => toggleWatched(selectedVideo.id)}
                      style={{
                        padding: "0.5rem 1rem",
                        border: selectedVideo.watched ? "1px solid #10b981" : "1px solid rgba(76,53,200,0.45)",
                        borderRadius: "12px",
                        background: selectedVideo.watched ? "rgba(16,185,129,0.2)" : "linear-gradient(135deg, rgba(76,53,200,0.7), rgba(147,51,234,0.55))",
                        color: selectedVideo.watched ? "#10b981" : "white",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {selectedVideo.watched ? "✓ Watched" : "Mark as Watched"}
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: "grid", gap: "1rem" }}>
                  {phaseData.videos.map(video => (
                    <div
                      key={video.id}
                      style={{
                        display: "flex",
                        gap: "1rem",
                        background: "rgba(76,53,200,0.08)",
                        border: "1px solid rgba(76,53,200,0.22)",
                        borderRadius: "12px",
                        padding: "1rem",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onClick={() => setSelectedVideo(video)}
                    >
                      <div style={{ width: "160px", height: "90px", borderRadius: "8px", background: "linear-gradient(135deg, rgba(76,53,200,0.3), rgba(147,51,234,0.2))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: "2rem" }}>▶️</span>
                      </div>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <h3 style={{ color: "white", fontSize: "1rem", fontWeight: 700, marginBottom: "0.25rem" }}>{video.title}</h3>
                        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>{video.duration}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {video.watched && <span style={{ color: "#10b981", fontSize: "1.5rem" }}>✓</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "study" && (
            <div style={{ color: "rgba(255,255,255,0.9)", lineHeight: 1.8, fontSize: "0.95rem" }}>
              <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0 }}>
                {phaseData.studyMaterial}
              </pre>
            </div>
          )}

          {activeTab === "practice" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              {phaseData.exercises.map(exercise => (
                <div
                  key={exercise.id}
                  style={{
                    background: exercise.completed ? "rgba(16,185,129,0.08)" : "rgba(76,53,200,0.08)",
                    border: exercise.completed ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(76,53,200,0.22)",
                    borderRadius: "12px",
                    padding: "1rem",
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={exercise.completed}
                    onChange={() => toggleExercise(exercise.id)}
                    style={{ width: "20px", height: "20px", cursor: "pointer" }}
                  />
                  <span style={{ color: exercise.completed ? "#10b981" : "white", fontSize: "0.95rem", flex: 1, fontWeight: exercise.completed ? 600 : 400 }}>
                    {exercise.description}
                  </span>
                  {exercise.completed && <span style={{ color: "#10b981", fontSize: "1.2rem" }}>✓</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Progress and Complete Button */}
        <div style={{ background: "rgba(13,10,40,0.85)", border: "1px solid rgba(76,53,200,0.28)", borderRadius: "18px", padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <span style={{ color: "white", fontSize: "1.1rem", fontWeight: 700 }}>Phase Progress</span>
            <span style={{ color: "#a78bfa", fontSize: "1.1rem", fontWeight: 700 }}>{totalProgress}%</span>
          </div>
          <div style={{ height: "12px", borderRadius: "999px", background: "rgba(255,255,255,0.1)", overflow: "hidden", marginBottom: "1rem" }}>
            <div style={{ height: "100%", width: `${totalProgress}%`, background: "linear-gradient(90deg, #4c35c8, #9333ea)", borderRadius: "999px", transition: "width 0.3s ease" }} />
          </div>
          <button
            type="button"
            onClick={handlePhaseComplete}
            disabled={totalProgress < 50 || phaseComplete}
            style={{
              width: "100%",
              padding: "1rem",
              border: "none",
              borderRadius: "12px",
              background: totalProgress >= 50 && !phaseComplete ? "linear-gradient(135deg, #4c35c8, #9333ea)" : "rgba(76,53,200,0.3)",
              color: totalProgress >= 50 && !phaseComplete ? "white" : "rgba(255,255,255,0.4)",
              fontWeight: 800,
              fontSize: "1.1rem",
              cursor: totalProgress >= 50 && !phaseComplete ? "pointer" : "not-allowed",
              transition: "all 0.2s ease",
            }}
          >
            {phaseComplete ? "✓ Phase Completed" : "Mark Phase as Complete"}
          </button>
        </div>
      </div>
    </div>
  );
}
