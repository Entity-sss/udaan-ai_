import { useMemo, useState } from "react";
import { useLocation, useParams } from "wouter";
import {
  getSkillsFromRoadmap,
  getSkillProgress,
  isLevelUnlocked,
  isPhaseContentDone,
  isPhaseMockPassed,
  isPhaseUnlocked,
  markPhaseContentComplete,
} from "@/lib/skills-progress";

function ConfettiBurst() {
  const pieces = new Array(24).fill(null);
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 40 }}>
      {pieces.map((_, i) => {
        const left = 10 + (i * 3.5) % 80;
        const delay = (i % 8) * 40;
        const color = ["#c084fc", "#4c35c8", "#f59e0b", "#34d399"][i % 4];
        return (
          <span
            key={i}
            style={{
              position: "absolute",
              top: "-10px",
              left: `${left}%`,
              width: "8px",
              height: "12px",
              background: color,
              borderRadius: "3px",
              opacity: 0.95,
              animation: `fall 1200ms ease-in ${delay}ms forwards`,
            }}
          />
        );
      })}
      <style>
        {`@keyframes fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(700deg); opacity: 0; }
        }`}
      </style>
    </div>
  );
}

export default function PhaseContent() {
  const [, setLocation] = useLocation();
  const { skillId, levelId, phaseId } = useParams<{ skillId: string; levelId: "beginner" | "intermediate" | "advanced"; phaseId: string }>();
  const [showConfetti, setShowConfetti] = useState(false);
  const [, bump] = useState(0);

  const skills = getSkillsFromRoadmap();
  const skill = skills.find(s => s.id === skillId);
  const progress = getSkillProgress();

  const levelIndex = skill?.levels.findIndex(l => l.id === levelId) ?? -1;
  const level = levelIndex >= 0 ? skill?.levels[levelIndex] : undefined;
  const levelUnlocked = skill && levelIndex >= 0 ? isLevelUnlocked(skill.levels, levelIndex, skill.id, progress) : false;
  const phaseIndex = level?.phases.findIndex(p => p.id === phaseId) ?? -1;
  const phase = phaseIndex >= 0 ? level?.phases[phaseIndex] : undefined;
  const phaseUnlocked = level && phaseIndex >= 0 ? isPhaseUnlocked(level.phases, phaseIndex, progress) : false;

  const contentDone = Boolean(phase && isPhaseContentDone(phase.id, progress));
  const mockPassed = Boolean(phase && isPhaseMockPassed(phase.id, progress));

  const phaseToUse = phase;
  const nextPhaseId = useMemo(() => {
    if (!level || phaseIndex < 0) return null;
    return level.phases[phaseIndex + 1]?.id ?? null;
  }, [level, phaseIndex]);

  if (!skill || !level || !phase || !levelUnlocked || !phaseUnlocked) {
    return (
      <div style={{ padding: "1.5rem" }}>
        <p style={{ color: "rgba(255,255,255,0.7)" }}>Phase is locked or not found.</p>
      </div>
    );
  }

  const sk = skill;
  const lv = level;

  function handleMarkContentComplete() {
    if (contentDone || !phaseToUse) return;
    markPhaseContentComplete(phaseToUse.id);
    bump(n => n + 1);
    setShowConfetti(true);
    const sid = sk.id;
    const lid = lv.id;
    const pid = phaseToUse.id;
    setTimeout(() => setShowConfetti(false), 1400);
    setTimeout(() => setLocation(`/skills/${sid}/${lid}/${pid}/test`), 700);
  }

  return (
    <div style={{ padding: "1.5rem", maxWidth: "940px", position: "relative" }}>
      {showConfetti && <ConfettiBurst />}
      <button
        type="button"
        onClick={() => setLocation(`/skills/${sk.id}/${lv.id}`)}
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
        ← Back to Phases
      </button>

      <h1 style={{ color: "white", fontWeight: 800, fontSize: "1.65rem", marginBottom: "0.35rem" }}>
        {skill.icon} {phase.title}
      </h1>
      <p style={{ color: "rgba(255,255,255,0.56)", marginBottom: "1rem" }}>
        {skill.name} · {level.title} · {phase.duration}
      </p>

      {mockPassed && (
        <div
          style={{
            marginBottom: "1rem",
            borderRadius: "12px",
            padding: "0.65rem 0.85rem",
            color: "#bbf7d0",
            border: "1px solid rgba(16,185,129,0.45)",
            background: "rgba(16,185,129,0.12)",
          }}
        >
          Phase quiz passed. {nextPhaseId ? "Next phase is unlocked." : "All phases done here — take the level test if ready."}
        </div>
      )}

      <div style={{ borderRadius: "14px", border: "1px solid rgba(76,53,200,0.3)", background: "rgba(13,11,30,0.9)", padding: "0.95rem", marginBottom: "0.8rem" }}>
        <h3 style={{ color: "white", marginTop: 0 }}>Video</h3>
        <p style={{ color: "rgba(255,255,255,0.72)", marginBottom: 0 }}>
          Watch concept videos on: {phase.topics.join(", ")}.
        </p>
      </div>

      <div style={{ borderRadius: "14px", border: "1px solid rgba(76,53,200,0.3)", background: "rgba(13,11,30,0.9)", padding: "0.95rem", marginBottom: "0.8rem" }}>
        <h3 style={{ color: "white", marginTop: 0 }}>Reading & examples</h3>
        <p style={{ color: "rgba(255,255,255,0.72)", marginBottom: 0 }}>
          Curated notes and worked examples for this phase.
        </p>
      </div>

      <div style={{ borderRadius: "14px", border: "1px solid rgba(76,53,200,0.3)", background: "rgba(13,11,30,0.9)", padding: "0.95rem", marginBottom: "1rem" }}>
        <h3 style={{ color: "white", marginTop: 0 }}>Practice</h3>
        <p style={{ color: "rgba(255,255,255,0.72)", marginBottom: 0 }}>
          Guided tasks and a mini challenge — then you’ll unlock the phase quiz.
        </p>
      </div>

      {!mockPassed && (
        <button
          type="button"
          onClick={handleMarkContentComplete}
          disabled={contentDone}
          style={{
            width: "100%",
            border: "none",
            borderRadius: "12px",
            color: "white",
            fontWeight: 800,
            padding: "0.9rem 1rem",
            background: contentDone ? "rgba(76,53,200,0.35)" : "linear-gradient(135deg, #4c35c8, #6d4fd6)",
            cursor: contentDone ? "default" : "pointer",
            boxShadow: contentDone ? "none" : "0 0 22px rgba(76,53,200,0.3)",
            transition: "all 300ms ease",
          }}
        >
          {contentDone ? "Starting phase quiz…" : "Mark as Complete"}
        </button>
      )}

      {contentDone && !mockPassed && (
        <button
          type="button"
          onClick={() => setLocation(`/skills/${sk.id}/${lv.id}/${phase.id}/test`)}
          style={{
            marginTop: "0.65rem",
            width: "100%",
            border: "1px solid rgba(76,53,200,0.5)",
            borderRadius: "12px",
            color: "#e9d5ff",
            fontWeight: 800,
            padding: "0.85rem 1rem",
            background: "rgba(76,53,200,0.2)",
            cursor: "pointer",
          }}
        >
          Open phase quiz
        </button>
      )}
    </div>
  );
}
