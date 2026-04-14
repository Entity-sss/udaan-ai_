import { useMemo, useRef } from "react";
import { useLocation, useParams } from "wouter";
import { GrowthQuizRunner } from "@/components/GrowthQuizRunner";
import {
  getSkillsFromRoadmap,
  getSkillProgress,
  isFinalSkillTestAvailable,
  recordSkillFinalPassed,
} from "@/lib/skills-progress";

export default function FinalSkillQuizPage() {
  const [, setLocation] = useLocation();
  const { skillId } = useParams<{ skillId: string }>();
  const recorded = useRef(false);

  const skills = getSkillsFromRoadmap();
  const skill = skills.find(s => s.id === skillId);
  const progress = getSkillProgress();

  const allowed = useMemo(() => skill && isFinalSkillTestAvailable(skill, progress), [skill, progress]);

  if (!skill) {
    return <div style={{ padding: "1.5rem", color: "rgba(255,255,255,0.7)" }}>Not found.</div>;
  }

  if (progress.skillFinalPassedIds.includes(skill.id)) {
    return (
      <div style={{ padding: "1.5rem", color: "rgba(255,255,255,0.75)" }}>
        Final exam passed.{" "}
        <button type="button" style={{ color: "#c4b5fd" }} onClick={() => setLocation(`/skills/${skillId}/project`)}>
          Go to project
        </button>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div style={{ padding: "1.5rem", color: "rgba(255,255,255,0.7)" }}>
        Pass all three level tests to unlock the final combined exam.
      </div>
    );
  }

  const summary = skill.levels.map(l => l.title).join(" → ");

  return (
    <div style={{ padding: "0.5rem 0" }}>
      <button
        type="button"
        onClick={() => setLocation(`/skills/${skillId}`)}
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
        ← Back to levels
      </button>
      <h1 style={{ color: "white", fontWeight: 800, fontSize: "1.35rem", marginBottom: "0.5rem" }}>
        {skill.icon} Final exam · {skill.name}
      </h1>
      <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", marginBottom: "1rem" }}>
        Full skill check: {summary}
      </p>
      <GrowthQuizRunner
        mode="final"
        skillName={skill.name}
        topics={skill.levels.flatMap(l => l.phases.flatMap(p => p.topics))}
        materialSummary={`Complete skill: ${skill.name}. All levels.`}
        onPass={() => {
          if (recorded.current) return;
          recorded.current = true;
          recordSkillFinalPassed(skill.id);
        }}
        onFail={() => {}}
        onExit={() => setLocation(`/skills/${skillId}`)}
      />
    </div>
  );
}
