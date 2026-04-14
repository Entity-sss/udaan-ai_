import { useMemo, useRef } from "react";
import { useLocation, useParams } from "wouter";
import { GrowthQuizRunner } from "@/components/GrowthQuizRunner";
import {
  getSkillsFromRoadmap,
  getSkillProgress,
  isLevelUnlocked,
  isPhaseContentDone,
  isPhaseMockPassed,
  isPhaseUnlocked,
  recordPhaseMockPassed,
} from "@/lib/skills-progress";

export default function PhaseQuizPage() {
  const [, setLocation] = useLocation();
  const { skillId, levelId, phaseId } = useParams<{
    skillId: string;
    levelId: "beginner" | "intermediate" | "advanced";
    phaseId: string;
  }>();
  const recorded = useRef(false);

  const skills = getSkillsFromRoadmap();
  const skill = skills.find(s => s.id === skillId);
  const progress = getSkillProgress();
  const levelIndex = skill?.levels.findIndex(l => l.id === levelId) ?? -1;
  const level = levelIndex >= 0 ? skill?.levels[levelIndex] : undefined;
  const phaseIndex = level?.phases.findIndex(p => p.id === phaseId) ?? -1;
  const phase = phaseIndex >= 0 ? level?.phases[phaseIndex] : undefined;

  const allowed = useMemo(() => {
    if (!skill || !level || !phase) return false;
    const levelOk = isLevelUnlocked(skill.levels, levelIndex, skill.id, progress);
    const phaseOk = isPhaseUnlocked(level.phases, phaseIndex, progress);
    const contentOk = isPhaseContentDone(phase.id, progress);
    const notPassed = !isPhaseMockPassed(phase.id, progress);
    return levelOk && phaseOk && contentOk && notPassed;
  }, [skill, level, phase, levelIndex, phaseIndex, progress]);

  if (!skill || !level || !phase) {
    return <div style={{ padding: "1.5rem", color: "rgba(255,255,255,0.7)" }}>Not found.</div>;
  }

  if (isPhaseMockPassed(phase.id, progress)) {
    return (
      <div style={{ padding: "1.5rem", color: "rgba(255,255,255,0.75)" }}>
        You already passed this phase quiz.{" "}
        <button type="button" style={{ color: "#c4b5fd" }} onClick={() => setLocation(`/skills/${skillId}/${levelId}`)}>
          Back to phases
        </button>
      </div>
    );
  }

  if (!isPhaseContentDone(phase.id, progress)) {
    return (
      <div style={{ padding: "1.5rem", color: "rgba(255,255,255,0.75)" }}>
        Mark the phase content complete first, then come back for the quiz.
      </div>
    );
  }

  if (!allowed) {
    return (
      <div style={{ padding: "1.5rem", color: "rgba(255,255,255,0.7)" }}>
        Quiz not available or phase is locked.
      </div>
    );
  }

  return (
    <div style={{ padding: "0.5rem 0" }}>
      <button
        type="button"
        onClick={() => setLocation(`/skills/${skillId}/${levelId}`)}
        style={{
          marginBottom: "0.75rem",
          background: "transparent",
          border: "1px solid rgba(76,53,200,0.45)",
          color: "#c4b5fd",
          borderRadius: "9px",
          padding: "0.45rem 0.75rem",
          cursor: "pointer",
        }}
      >
        ← Back
      </button>
      <GrowthQuizRunner
        mode="phase"
        skillName={skill.name}
        levelTitle={level.title}
        phaseTitle={phase.title}
        topics={phase.topics}
        materialSummary={`Topics: ${phase.topics.join(", ")}. ${phase.title}.`}
        onPass={() => {
          if (recorded.current) return;
          recorded.current = true;
          recordPhaseMockPassed(phase.id);
        }}
        onFail={() => {}}
        onExit={() => setLocation(`/skills/${skillId}/${levelId}`)}
      />
    </div>
  );
}
