import { useMemo, useRef } from "react";
import { useLocation, useParams } from "wouter";
import {
  getSkillsFromRoadmap,
  getSkillProgress,
  isLevelUnlocked,
  isPhaseContentDone,
  isPhaseMockPassed,
  isPhaseUnlocked,
} from "@/lib/skills-progress";

const accent = "linear-gradient(135deg, #4c35c8, #6d4fd6)";

export default function SkillPhases() {
  const [, setLocation] = useLocation();
  const { skillId, levelId } = useParams<{ skillId: string; levelId: "beginner" | "intermediate" | "advanced" }>();
  const prevUnlockedRef = useRef(0);

  const skills = getSkillsFromRoadmap();
  const progress = getSkillProgress();
  const skill = skills.find(s => s.id === skillId);
  const levelIndex = skill?.levels.findIndex(l => l.id === levelId) ?? -1;
  const level = levelIndex >= 0 ? skill?.levels[levelIndex] : undefined;
  const levelUnlocked =
    skill && levelIndex >= 0 ? isLevelUnlocked(skill.levels, levelIndex, skill.id, progress) : false;

  const phases = useMemo(() => {
    if (!level) return [];
    return level.phases.map((phase, index) => {
      const unlocked = isPhaseUnlocked(level.phases, index, progress);
      const mockDone = isPhaseMockPassed(phase.id, progress);
      const contentDone = isPhaseContentDone(phase.id, progress);
      let status: string;
      if (mockDone) status = "Phase complete";
      else if (contentDone) status = "Quiz ready";
      else if (unlocked) status = "In progress";
      else status = "🔒 Locked";
      return { phase, index, unlocked, mockDone, contentDone, status };
    });
  }, [level, progress]);

  const unlockedCount = phases.filter(p => p.unlocked).length;
  const justUnlocked = unlockedCount > prevUnlockedRef.current;
  prevUnlockedRef.current = unlockedCount;

  if (!skill || !level || !levelUnlocked) {
    return (
      <div style={{ padding: "1.5rem" }}>
        <p style={{ color: "rgba(255,255,255,0.7)" }}>Level is locked or not found.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "1.5rem", maxWidth: "980px" }}>
      <button
        type="button"
        onClick={() => setLocation(`/skills/${skill.id}`)}
        style={{
          marginBottom: "0.8rem",
          background: "transparent",
          border: "1px solid rgba(76,53,200,0.4)",
          color: "#c4b5fd",
          borderRadius: "9px",
          padding: "0.45rem 0.75rem",
          cursor: "pointer",
        }}
      >
        ← Back to Levels
      </button>
      <h1 style={{ color: "white", fontWeight: 800, fontSize: "1.65rem", marginBottom: "0.35rem" }}>
        {skill.icon} {skill.name} · {level.title} Phases
      </h1>
      <p style={{ color: "rgba(255,255,255,0.56)", marginBottom: "1rem" }}>
        Finish content → pass phase quiz → unlock the next phase.
      </p>

      {justUnlocked && (
        <div
          style={{
            marginBottom: "0.9rem",
            borderRadius: "12px",
            padding: "0.7rem 0.85rem",
            color: "#d8b4fe",
            border: "1px solid rgba(76,53,200,0.45)",
            background: "rgba(76,53,200,0.15)",
            animation: "unlockPulse 640ms ease",
          }}
        >
          New phase unlocked 🎉
          <style>{`@keyframes unlockPulse { 0%{transform:scale(0.98);opacity:.5} 100%{transform:scale(1);opacity:1} }`}</style>
        </div>
      )}

      <div style={{ position: "relative", display: "grid", gap: "0.8rem", paddingLeft: "1rem" }}>
        <div
          style={{
            position: "absolute",
            left: "11px",
            top: "8px",
            bottom: "8px",
            width: "2px",
            background: "linear-gradient(180deg, rgba(76,53,200,0.55), rgba(76,53,200,0.08))",
          }}
        />
        {phases.map(({ phase, unlocked, mockDone, contentDone, status, index }) => (
          <div
            key={phase.id}
            style={{
              position: "relative",
              borderRadius: "14px",
              border: "1px solid rgba(76,53,200,0.32)",
              background: unlocked ? "rgba(13,11,30,0.92)" : "rgba(13,11,30,0.55)",
              padding: "0.95rem",
              opacity: unlocked ? 1 : 0.72,
              transition: "all 350ms ease",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "-1rem",
                top: "1rem",
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                border: "2px solid rgba(76,53,200,0.85)",
                background: mockDone
                  ? "linear-gradient(135deg, #10b981, #34d399)"
                  : unlocked
                    ? accent
                    : "rgba(76,53,200,0.2)",
                boxShadow: unlocked ? "0 0 12px rgba(76,53,200,0.45)" : "none",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.45rem" }}>
              <p style={{ margin: 0, color: "white", fontWeight: 800 }}>
                Phase {index + 1}: {phase.title.replace(/^Phase\s\d+:\s*/, "")}
              </p>
              <span
                style={{
                  color: mockDone ? "#34d399" : unlocked ? "#ddd6fe" : "#c4b5fd",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                }}
              >
                {status}
              </span>
            </div>
            <p style={{ margin: "0 0 0.35rem", color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>
              Duration: {phase.duration}
            </p>
            <p style={{ margin: "0 0 0.65rem", color: "rgba(255,255,255,0.78)", fontSize: "0.85rem" }}>
              Topics: {phase.topics.join(" • ")}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
              <button
                type="button"
                disabled={!unlocked}
                onClick={() => setLocation(`/skills/${skill.id}/${level.id}/${phase.id}`)}
                style={{
                  border: "none",
                  borderRadius: "10px",
                  padding: "0.62rem 0.82rem",
                  fontWeight: 700,
                  color: "white",
                  background: unlocked ? accent : "rgba(76,53,200,0.2)",
                  cursor: unlocked ? "pointer" : "not-allowed",
                }}
              >
                {unlocked ? (mockDone ? "Review phase" : contentDone ? "Open content" : "Start Phase") : "Locked"}
              </button>
              {unlocked && contentDone && !mockDone && (
                <button
                  type="button"
                  onClick={() => setLocation(`/skills/${skill.id}/${level.id}/${phase.id}/test`)}
                  style={{
                    border: "1px solid rgba(250,204,21,0.45)",
                    borderRadius: "10px",
                    padding: "0.62rem 0.82rem",
                    fontWeight: 700,
                    color: "#fef08a",
                    background: "rgba(250,204,21,0.12)",
                    cursor: "pointer",
                  }}
                >
                  Phase quiz
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
