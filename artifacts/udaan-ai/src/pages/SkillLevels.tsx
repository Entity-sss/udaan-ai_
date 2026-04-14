import { useMemo, useRef } from "react";
import { useLocation, useParams } from "wouter";
import {
  allPhaseMocksPassedForLevel,
  getLevelProgressPercent,
  getSkillsFromRoadmap,
  getSkillProgress,
  isFinalSkillTestAvailable,
  isLevelUnlocked,
  levelTestKey,
} from "@/lib/skills-progress";

const accent = "linear-gradient(135deg, #4c35c8, #6d4fd6)";

export default function SkillLevels() {
  const [, setLocation] = useLocation();
  const { skillId } = useParams<{ skillId: string }>();
  const prevUnlockedRef = useRef(0);

  const skills = getSkillsFromRoadmap();
  const skill = skills.find(s => s.id === skillId);
  const progress = getSkillProgress();

  const levels = useMemo(() => {
    if (!skill) return [];
    return skill.levels.map((level, index) => {
      const unlocked = isLevelUnlocked(skill.levels, index, skill.id, progress);
      const percent = getLevelProgressPercent(level, progress);
      const ltKey = levelTestKey(skill.id, level.id);
      const levelTestDone = progress.levelTestPassedKeys.includes(ltKey);
      const canLevelTest = unlocked && allPhaseMocksPassedForLevel(level, progress) && !levelTestDone;
      return { level, index, unlocked, percent, levelTestDone, canLevelTest, ltKey };
    });
  }, [skill, progress]);

  const unlockedCount = levels.filter(l => l.unlocked).length;
  const justUnlocked = unlockedCount > prevUnlockedRef.current;
  prevUnlockedRef.current = unlockedCount;

  const finalReady = skill ? isFinalSkillTestAvailable(skill, progress) : false;
  const finalDone = skill ? progress.skillFinalPassedIds.includes(skill.id) : false;
  const projectDone = skill ? progress.projectSubmittedIds.includes(skill.id) : false;

  if (!skill) {
    return (
      <div style={{ padding: "1.5rem" }}>
        <p style={{ color: "rgba(255,255,255,0.7)" }}>Skill not found.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "1.5rem", maxWidth: "980px" }}>
      <button
        type="button"
        onClick={() => setLocation("/skills")}
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
        ← Back to Skills
      </button>
      <h1 style={{ color: "white", fontWeight: 800, fontSize: "1.65rem", marginBottom: "0.35rem" }}>
        {skill.icon} {skill.name} Levels
      </h1>
      <p style={{ color: "rgba(255,255,255,0.56)", marginBottom: "1rem" }}>
        Beginner → Intermediate → Advanced · pass phase quizzes, then the level test
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
            animation: "unlockFlash 600ms ease",
          }}
        >
          New level unlocked 🎉
          <style>{`@keyframes unlockFlash { 0%{transform:scale(0.98);opacity:.5} 100%{transform:scale(1);opacity:1} }`}</style>
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
        {levels.map(({ level, index, unlocked, percent, levelTestDone, canLevelTest }) => (
          <div
            key={level.id}
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
                background: unlocked ? accent : "rgba(76,53,200,0.2)",
                boxShadow: unlocked ? "0 0 12px rgba(76,53,200,0.45)" : "none",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.7rem", marginBottom: "0.5rem" }}>
              <p style={{ margin: 0, color: "white", fontWeight: 800 }}>
                Level {index + 1}: {level.title}
              </p>
              {!unlocked && <span style={{ color: "#c4b5fd" }}>🔒 Locked</span>}
            </div>
            <div style={{ height: "8px", borderRadius: "999px", background: "rgba(255,255,255,0.08)", overflow: "hidden", marginBottom: "0.45rem" }}>
              <div style={{ height: "100%", width: `${percent}%`, background: accent, transition: "width 450ms ease" }} />
            </div>
            <p style={{ margin: "0 0 0.55rem", color: "rgba(255,255,255,0.6)", fontSize: "0.82rem" }}>
              {percent}% phase quizzes done
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <button
                type="button"
                disabled={!unlocked}
                onClick={() => setLocation(`/skills/${skill.id}/${level.id}`)}
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
                {unlocked ? "Open phases" : "Locked"}
              </button>
              {canLevelTest && (
                <button
                  type="button"
                  onClick={() => setLocation(`/skills/${skill.id}/${level.id}/level-test`)}
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
                  Take level test
                </button>
              )}
              {levelTestDone && (
                <span style={{ color: "#86efac", fontWeight: 700, fontSize: "0.82rem", alignSelf: "center" }}>Level test ✓</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {finalReady && !finalDone && (
        <div style={{ marginTop: "1.25rem", padding: "1rem", borderRadius: "14px", border: "1px solid rgba(76,53,200,0.35)", background: "rgba(13,11,30,0.9)" }}>
          <p style={{ color: "white", fontWeight: 800, marginTop: 0 }}>Final combined exam</p>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.88rem" }}>You cleared every level test. One last ride.</p>
          <button
            type="button"
            onClick={() => setLocation(`/skills/${skill.id}/skill-final`)}
            style={{
              marginTop: "0.65rem",
              border: "none",
              borderRadius: "10px",
              padding: "0.7rem 1rem",
              fontWeight: 800,
              color: "white",
              background: accent,
              cursor: "pointer",
            }}
          >
            Start final exam
          </button>
        </div>
      )}

      {finalDone && !projectDone && (
        <div style={{ marginTop: "1rem" }}>
          <button
            type="button"
            onClick={() => setLocation(`/skills/${skill.id}/project`)}
            style={{
              border: "none",
              borderRadius: "12px",
              padding: "0.85rem 1rem",
              fontWeight: 800,
              color: "white",
              background: "linear-gradient(135deg, #059669, #4c35c8)",
              cursor: "pointer",
            }}
          >
            Real-world project & certificate
          </button>
        </div>
      )}

      {projectDone && (
        <p style={{ marginTop: "1rem", color: "#86efac", fontWeight: 600 }}>Project submitted — view certificate in Certificates.</p>
      )}
    </div>
  );
}
