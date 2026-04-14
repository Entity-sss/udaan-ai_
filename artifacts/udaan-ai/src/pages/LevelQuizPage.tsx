import { useMemo, useRef } from "react";
import { useLocation, useParams } from "wouter";
import { GrowthQuizRunner } from "@/components/GrowthQuizRunner";
import {
  allPhaseMocksPassedForLevel,
  getSkillsFromRoadmap,
  getSkillProgress,
  isLevelUnlocked,
  levelTestKey,
  recordLevelTestPassed,
  type SkillLevelId,
} from "@/lib/skills-progress";

export default function LevelQuizPage() {
  const [, setLocation] = useLocation();
  const { skillId, levelId } = useParams<{ skillId: string; levelId: SkillLevelId }>();
  const recorded = useRef(false);

  const skills = getSkillsFromRoadmap();
  const skill = skills.find(s => s.id === skillId);
  const progress = getSkillProgress();
  const levelIndex = skill?.levels.findIndex(l => l.id === levelId) ?? -1;
  const level = levelIndex >= 0 ? skill?.levels[levelIndex] : undefined;

  const allowed = useMemo(() => {
    if (!skill || !level) return false;
    if (!isLevelUnlocked(skill.levels, levelIndex, skill.id, progress)) return false;
    return allPhaseMocksPassedForLevel(level, progress);
  }, [skill, level, levelIndex, progress]);

  const ltKey = skill && level ? levelTestKey(skill.id, level.id) : "";

  if (!skill || !level) {
    return <div style={{ padding: "1.5rem", color: "rgba(255,255,255,0.7)" }}>Not found.</div>;
  }

  if (progress.levelTestPassedKeys.includes(ltKey)) {
    return (
      <div style={{ padding: "1.5rem", color: "rgba(255,255,255,0.75)" }}>
        Level test already passed.{" "}
        <button type="button" style={{ color: "#c4b5fd" }} onClick={() => setLocation(`/skills/${skillId}/${levelId}`)}>
          Back
        </button>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div style={{ padding: "1.5rem", color: "rgba(255,255,255,0.7)" }}>
        Finish all phase quizzes in this level first.
      </div>
    );
  }

  const summary = level.phases.map(p => p.title).join(" · ");

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
        ← Back to phases
      </button>
      <h1 style={{ color: "white", fontWeight: 800, fontSize: "1.35rem", marginBottom: "0.5rem" }}>
        {skill.icon} {level.title} level test
      </h1>
      <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", marginBottom: "1rem" }}>
        Covers everything in this level. Pass to unlock the next level.
      </p>
      <GrowthQuizRunner
        mode="level"
        skillName={skill.name}
        levelTitle={level.title}
        topics={level.phases.flatMap(p => p.topics)}
        materialSummary={summary}
        onPass={() => {
          if (recorded.current) return;
          recorded.current = true;
          recordLevelTestPassed(skill.id, level.id);
        }}
        onFail={() => {}}
        onExit={() => setLocation(`/skills/${skillId}/${levelId}`)}
      />
    </div>
  );
}
