import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { StarField } from "@/components/StarField";
import { useToast } from "@/hooks/use-toast";
import { Storage } from "@/lib/storage";
import { getStoredStudent, setStoredStudent } from "@/lib/auth";
import {
  clearAssessmentSnapshot,
  getAssessmentSnapshot,
  setConfirmedRoadmapProfile,
  type AssessmentDraft,
  type DraftProfile,
} from "@/lib/assessment-draft";

function formatDuration(profile: DraftProfile): string {
  // Calculate duration based on daily time
  const minutes = profile.timePerDayMinutes || 60;
  if (minutes <= 30) return "20-24 weeks";
  if (minutes <= 60) return "12-16 weeks";
  if (minutes <= 120) return "8-10 weeks";
  return "4-6 weeks";
}

function estimatePhases(profile: DraftProfile): number {
  // Calculate phases based on daily time
  const minutes = profile.timePerDayMinutes || 60;
  if (minutes <= 30) return 8;
  if (minutes <= 60) return 6;
  if (minutes <= 120) return 5;
  return 4;
}

function mergeDraftProfile(base: DraftProfile, patch: Record<string, unknown>): DraftProfile {
  const sl = patch.skillLevel;
  const skillLevel =
    sl === "beginner" || sl === "intermediate" || sl === "advanced" ? sl : base.skillLevel;
  return {
    goal: typeof patch.goal === "string" ? patch.goal : base.goal,
    field: typeof patch.field === "string" ? patch.field : base.field,
    skillLevel,
    timePerDayMinutes:
      typeof patch.timePerDayMinutes === "number" ? patch.timePerDayMinutes : base.timePerDayMinutes,
    timelineWeeks: typeof patch.timelineWeeks === "number" ? patch.timelineWeeks : base.timelineWeeks,
    extraSkills: Array.isArray(patch.extraSkills)
      ? [...new Set((patch.extraSkills as string[]).map(s => s.trim()).filter(Boolean))]
      : base.extraSkills,
    interests: Array.isArray(patch.interests)
      ? [...new Set((patch.interests as string[]).map(s => s.trim()).filter(Boolean))]
      : base.interests,
  };
}

export default function AssessmentConfirm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const student = getStoredStudent();
  const snapshot = getAssessmentSnapshot();

  const [draft, setDraft] = useState<AssessmentDraft | null>(snapshot?.draft ?? null);
  const [chatInput, setChatInput] = useState("");
  const [chatLines, setChatLines] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [refining, setRefining] = useState(false);
  const [confirming, setConfirming] = useState(false);

  if (!student) {
    setLocation("/signup");
    return null;
  }

  if (!snapshot || !draft) {
    setLocation("/assessment");
    return null;
  }

  const currentStudent = student;
  const currentDraft = draft;

  const identifiedSkills = useMemo(() => {
    const fromInterests = currentDraft.profile.interests ?? [];
    const fromExtra = currentDraft.profile.extraSkills ?? [];
    return Array.from(new Set([...fromInterests, ...fromExtra].map(s => s.trim()).filter(Boolean)));
  }, [currentDraft]);

  const skillIconMap: Record<string, string> = {
    "Web Development": "🌐",
    "App Development": "📱",
    "Mobile App Development": "📱",
    "Data Science": "📊",
    "AI/ML": "🤖",
    "AI & Machine Learning": "🤖",
    Cybersecurity: "🛡️",
    Design: "🎨",
    "UI/UX Design": "🎨",
    "Graphic Design": "✏️",
    "Soft Skills": "💬",
    "Soft Skills (Communication)": "💬",
    "Soft Skills (Leadership)": "👥",
    "Public Speaking": "🎤",
    "Digital Marketing": "📢",
    Python: "🐍",
    Excel: "📗",
    "Excel & Data Analysis": "📈",
  };

  const summaryBullets = useMemo(() => {
    const raw = currentDraft.draftSummary ?? "";
    return raw
      .split(/\n+/)
      .map(l => l.replace(/^•\s*/, "").trim())
      .filter(Boolean);
  }, [currentDraft.draftSummary]);

  async function sendRefinement() {
    const msg = chatInput.trim();
    if (!msg) return;
    setRefining(true);
    setChatInput("");
    setChatLines(c => [...c, { role: "user", text: msg }]);
    try {
      const res = await fetch("/api/assessment/refine-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: currentDraft.profile,
          draftSummary: currentDraft.draftSummary,
          message: msg,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Refine failed");

      const nextProfile = mergeDraftProfile(currentDraft.profile, (data.profile ?? {}) as Record<string, unknown>);
      setDraft({
        ...currentDraft,
        profile: nextProfile,
        draftSummary: typeof data.draftSummary === "string" ? data.draftSummary : currentDraft.draftSummary,
        hasEnoughInfo: true,
      });
      const reply = typeof data.assistantMessage === "string" ? data.assistantMessage : "Updated your roadmap.";
      setChatLines(c => [...c, { role: "assistant", text: reply }]);
    } catch (e: unknown) {
      // Fallback to mock roadmap refinement if API is not available
      console.log("API not available, using mock roadmap refinement");
      
      // Simple mock refinement logic with proper remove/add detection
      let updatedProfile = { ...currentDraft.profile };
      let reply = "I've updated your roadmap based on your preferences.";
      
      const lowerMsg = msg.toLowerCase();
      const isRemove = lowerMsg.includes("remove") || lowerMsg.includes("delete") || lowerMsg.includes("don't want") || lowerMsg.includes("not interested in") || lowerMsg.includes("dont want");
      const isAdd = lowerMsg.includes("add") || lowerMsg.includes("include") || lowerMsg.includes("also add") || lowerMsg.includes("want to learn");
      
      // Extract skill name from message
      const skillMap: Record<string, string> = {
        "python": "Python",
        "javascript": "JavaScript",
        "js": "JavaScript",
        "react": "React",
        "web development": "Web Development",
        "web dev": "Web Development",
        "data science": "Data Science",
        "ai": "AI/ML",
        "ml": "AI/ML",
        "machine learning": "AI/ML",
        "ui/ux": "UI/UX Design",
        "graphic design": "Graphic Design",
        "digital marketing": "Digital Marketing",
        "app development": "App Development",
        "mobile": "App Development",
        "cybersecurity": "Cybersecurity",
        "soft skills": "Soft Skills - Communication",
        "communication": "Soft Skills - Communication",
        "leadership": "Soft Skills - Leadership",
        "public speaking": "Public Speaking",
        "excel": "Excel & Data Analysis",
      };
      
      let targetSkill: string | null = null;
      for (const [key, value] of Object.entries(skillMap)) {
        if (lowerMsg.includes(key)) {
          targetSkill = value;
          break;
        }
      }
      
      if (targetSkill) {
        if (isRemove) {
          // Remove skill from both interests and extraSkills
          updatedProfile.interests = (updatedProfile.interests || []).filter(s => s !== targetSkill);
          updatedProfile.extraSkills = (updatedProfile.extraSkills || []).filter(s => s !== targetSkill);
          reply = `Removed ${targetSkill} from your learning path.`;
        } else if (isAdd) {
          // Add skill to interests if not already present
          const allSkills = [...(updatedProfile.interests || []), ...(updatedProfile.extraSkills || [])];
          if (!allSkills.includes(targetSkill)) {
            updatedProfile.interests = [...(updatedProfile.interests || []), targetSkill];
            reply = `Added ${targetSkill} to your learning path.`;
          } else {
            reply = `${targetSkill} is already in your learning path.`;
          }
        } else {
          // Default to add if no explicit remove/add keyword but skill is mentioned
          const allSkills = [...(updatedProfile.interests || []), ...(updatedProfile.extraSkills || [])];
          if (!allSkills.includes(targetSkill)) {
            updatedProfile.interests = [...(updatedProfile.interests || []), targetSkill];
            reply = `Added ${targetSkill} to your learning path.`;
          } else {
            reply = `${targetSkill} is already in your learning path.`;
          }
        }
      } else if (lowerMsg.includes("timeline") || lowerMsg.includes("faster")) {
        updatedProfile.timelineWeeks = Math.max(4, (updatedProfile.timelineWeeks || 8) - 2);
        reply = "Shortened your learning timeline by 2 weeks!";
      } else if (lowerMsg.includes("more time") || lowerMsg.includes("slower")) {
        updatedProfile.timelineWeeks = (updatedProfile.timelineWeeks || 8) + 2;
        reply = "Extended your learning timeline by 2 weeks!";
      } else if (lowerMsg.includes("beginner")) {
        updatedProfile.skillLevel = "beginner";
        reply = "Set your skill level to beginner with foundational topics.";
      } else if (lowerMsg.includes("advanced")) {
        updatedProfile.skillLevel = "advanced";
        reply = "Set your skill level to advanced with challenging topics.";
      }
      
      setDraft({
        ...currentDraft,
        profile: updatedProfile,
        draftSummary: "Demo roadmap updated based on your feedback",
        hasEnoughInfo: true,
      });
      setChatLines(c => [...c, { role: "assistant", text: reply }]);
    } finally {
      setRefining(false);
    }
  }

  async function confirmRoadmap() {
    setConfirming(true);
    try {
      // Prepare roadmap data
      const roadmapData = {
        goal: currentDraft.profile.goal || "Get a Job",
        field: currentDraft.profile.field || "General Tech",
        skillLevel: currentDraft.profile.skillLevel || "beginner",
        timePerDayMinutes: currentDraft.profile.timePerDayMinutes || 60,
        interests: currentDraft.profile.interests || [],
        extraSkills: currentDraft.profile.extraSkills || [],
        timelineWeeks: currentDraft.profile.timelineWeeks || 24,
        phases: estimatePhases(currentDraft.profile),
        track: currentDraft.profile.field || currentDraft.profile.interests?.[0] || "General Tech",
        generatedAt: Date.now(),
      };

      // Save to localStorage using Storage utility
      Storage.saveRoadmap(roadmapData);
      Storage.saveAssessmentAnswers(currentDraft.profile);

      // Try real API first
      const res = await fetch("/api/assessment/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: currentStudent.id, profile: currentDraft.profile }),
      });
      if (!res.ok) throw new Error(await res.text());

      setConfirmedRoadmapProfile(roadmapData);
      setStoredStudent({ ...currentStudent, assessmentCompleted: true });
      clearAssessmentSnapshot();
      toast({ title: "Roadmap generated!", description: "Opening your dashboard." });
      setLocation("/dashboard");
    } catch (err: unknown) {
      // Fallback to mock roadmap confirmation if API is not available
      console.log("API not available, using mock roadmap confirmation");

      const roadmapData = {
        goal: currentDraft.profile.goal || "Get a Job",
        field: currentDraft.profile.field || "General Tech",
        skillLevel: currentDraft.profile.skillLevel || "beginner",
        timePerDayMinutes: currentDraft.profile.timePerDayMinutes || 60,
        interests: currentDraft.profile.interests || [],
        extraSkills: currentDraft.profile.extraSkills || [],
        timelineWeeks: currentDraft.profile.timelineWeeks || 24,
        phases: estimatePhases(currentDraft.profile),
        track: currentDraft.profile.field || currentDraft.profile.interests?.[0] || "General Tech",
        generatedAt: Date.now(),
      };

      // Save to localStorage using Storage utility
      Storage.saveRoadmap(roadmapData);
      Storage.saveAssessmentAnswers(currentDraft.profile);

      setConfirmedRoadmapProfile(roadmapData);
      setStoredStudent({ ...currentStudent, assessmentCompleted: true });
      clearAssessmentSnapshot();
      toast({ title: "Demo Roadmap Generated!", description: "Opening your dashboard." });
      setLocation("/dashboard");
    } finally {
      setConfirming(false);
    }
  }

  const pageBg = "linear-gradient(135deg, #0d0b1e 0%, #151030 60%, #0d0b1e 100%)";
  const cardBg = "rgba(13,11,30,0.92)";
  const phases = estimatePhases(currentDraft.profile);
  const mainField = currentDraft.profile.field || currentDraft.profile.interests?.[0] || "General Tech";

  return (
    <div style={{ minHeight: "100vh", background: pageBg, position: "relative", padding: "1.5rem" }}>
      <StarField />
      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "920px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "1.2rem" }}>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "white", marginBottom: "0.2rem" }}>Rough Roadmap</h2>
          <p style={{ color: "rgba(255,255,255,0.58)", fontSize: "0.92rem" }}>
            Tweak with chat (e.g. “add Python”) — then generate.
          </p>
        </div>

        <div
          style={{
            background: cardBg,
            border: "1px solid rgba(76,53,200,0.28)",
            borderRadius: "20px",
            padding: "1rem",
            boxShadow: "0 0 40px rgba(76,53,200,0.1)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "0.75rem",
              marginBottom: "1rem",
            }}
          >
            <div style={{ background: "rgba(76,53,200,0.12)", border: "1px solid rgba(76,53,200,0.3)", borderRadius: "12px", padding: "0.75rem" }}>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.55)", fontSize: "0.75rem" }}>Focus</p>
              <p style={{ margin: "0.3rem 0 0", color: "white", fontWeight: 800 }}>{mainField}</p>
            </div>
            <div style={{ background: "rgba(76,53,200,0.12)", border: "1px solid rgba(76,53,200,0.3)", borderRadius: "12px", padding: "0.75rem" }}>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.55)", fontSize: "0.75rem" }}>Duration</p>
              <p style={{ margin: "0.3rem 0 0", color: "white", fontWeight: 800 }}>{formatDuration(currentDraft.profile)}</p>
            </div>
            <div style={{ background: "rgba(76,53,200,0.12)", border: "1px solid rgba(76,53,200,0.3)", borderRadius: "12px", padding: "0.75rem" }}>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.55)", fontSize: "0.75rem" }}>Phases</p>
              <p style={{ margin: "0.3rem 0 0", color: "white", fontWeight: 800 }}>{phases} phases</p>
            </div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <p style={{ margin: "0 0 0.45rem", color: "white", fontWeight: 700 }}>Skills</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.55rem" }}>
              {identifiedSkills.length === 0 ? (
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem" }}>Add skills via chat below.</span>
              ) : (
                identifiedSkills.map(skill => (
                  <div
                    key={skill}
                    style={{
                      fontSize: "0.86rem",
                      color: "white",
                      border: "1px solid rgba(76,53,200,0.35)",
                      background: "rgba(76,53,200,0.14)",
                      padding: "0.55rem 0.7rem",
                      borderRadius: "12px",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.45rem",
                    }}
                  >
                    <span>{skillIconMap[skill] || "✨"}</span>
                    {skill}
                  </div>
                ))
              )}
            </div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <p style={{ margin: "0 0 0.45rem", color: "white", fontWeight: 700 }}>Plan highlights</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
              {(summaryBullets.length ? summaryBullets : ["Your personalized steps will appear here."]).map((line, i) => (
                <div
                  key={i}
                  style={{
                    borderRadius: "12px",
                    border: "1px solid rgba(76,53,200,0.22)",
                    background: "rgba(76,53,200,0.08)",
                    padding: "0.65rem 0.75rem",
                    color: "rgba(255,255,255,0.88)",
                    fontSize: "0.88rem",
                    lineHeight: 1.45,
                  }}
                >
                  • {line}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              marginBottom: "1rem",
              borderRadius: "14px",
              border: "1px solid rgba(76,53,200,0.25)",
              background: "rgba(0,0,0,0.2)",
              padding: "0.75rem",
              maxHeight: "200px",
              overflowY: "auto",
            }}
          >
            {chatLines.length === 0 && (
              <p style={{ margin: 0, color: "rgba(255,255,255,0.45)", fontSize: "0.85rem" }}>
                Try: “add Excel”, “remove design”, “I only have 30 min daily”…
              </p>
            )}
            {chatLines.map((c, i) => (
              <p
                key={i}
                style={{
                  margin: "0 0 0.45rem",
                  color: c.role === "user" ? "#e9d5ff" : "rgba(255,255,255,0.75)",
                  fontSize: "0.86rem",
                }}
              >
                <strong>{c.role === "user" ? "You" : "Udaan"}:</strong> {c.text}
              </p>
            ))}
          </div>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && (e.preventDefault(), void sendRefinement())}
              placeholder="Ask to change your roadmap…"
              disabled={refining}
              style={{
                flex: 1,
                minWidth: "200px",
                padding: "0.7rem 0.85rem",
                borderRadius: "12px",
                border: "1px solid rgba(76,53,200,0.35)",
                background: "rgba(76,53,200,0.08)",
                color: "white",
                fontSize: "0.9rem",
                outline: "none",
              }}
            />
            <button
              type="button"
              disabled={refining || !chatInput.trim()}
              onClick={() => void sendRefinement()}
              style={{
                padding: "0.7rem 1rem",
                borderRadius: "12px",
                border: "none",
                fontWeight: 700,
                color: "white",
                background: refining ? "rgba(76,53,200,0.3)" : "linear-gradient(135deg, #4c35c8, #6d4fd6)",
                cursor: refining ? "wait" : "pointer",
              }}
            >
              {refining ? "…" : "Update"}
            </button>
          </div>

          <button
            type="button"
            onClick={() => void confirmRoadmap()}
            disabled={confirming}
            style={{
              width: "100%",
              border: "none",
              borderRadius: "12px",
              color: "white",
              fontWeight: 800,
              padding: "0.9rem 1rem",
              background: confirming ? "rgba(76,53,200,0.25)" : "linear-gradient(135deg, #4c35c8, #6d4fd6)",
              cursor: confirming ? "not-allowed" : "pointer",
              boxShadow: "0 0 22px rgba(76,53,200,0.3)",
            }}
          >
            {confirming ? "Generating…" : "Generate My Roadmap"}
          </button>
        </div>
      </div>
    </div>
  );
}
