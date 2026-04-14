import { useMemo } from "react";
import { useLocation } from "wouter";
import {
  getSkillsFromRoadmap,
  getSkillProgress,
  getSkillOverallPercent,
  isFinalSkillTestAvailable,
} from "@/lib/skills-progress";

export default function Skills() {
  const [, setLocation] = useLocation();
  const skills = getSkillsFromRoadmap();
  const progress = getSkillProgress();

  const cards = useMemo(
    () =>
      skills.map(skill => {
        const percent = getSkillOverallPercent(skill, progress);
        let status: string;
        if (progress.projectSubmittedIds.includes(skill.id)) status = "Certificate earned";
        else if (progress.skillFinalPassedIds.includes(skill.id)) status = "Project & cert";
        else if (isFinalSkillTestAvailable(skill, progress)) status = "Final exam ready";
        else if (percent > 0) status = "In progress";
        else status = "Not started";
        return { skill, percent, status };
      }),
    [skills, progress],
  );

  const cardStyle: React.CSSProperties = {
    background: "rgba(13,10,40,0.85)",
    border: "1px solid rgba(124,58,237,0.22)",
    borderRadius: "16px",
    padding: "1rem",
  };

  return (
    <div style={{ padding: "1.5rem", maxWidth: "1100px" }}>
      <h1 style={{ color: "white", fontSize: "1.7rem", fontWeight: 800, marginBottom: "0.35rem" }}>
        Skills
      </h1>
      <p style={{ color: "rgba(255,255,255,0.55)", marginBottom: "1.2rem" }}>
        Pick a skill and grow level by level.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "0.85rem" }}>
        {cards.map(({ skill, percent, status }) => (
          <div
            key={skill.id}
            style={{
              ...cardStyle,
              transition: "transform 260ms ease, box-shadow 260ms ease, border-color 260ms ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(124,58,237,0.25)";
              e.currentTarget.style.borderColor = "rgba(124,58,237,0.45)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "rgba(124,58,237,0.22)";
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.55rem" }}>
              <div style={{ color: "white", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.45rem" }}>
                <span>{skill.icon}</span> {skill.name}
              </div>
              <span
                style={{
                  fontSize: "0.72rem",
                  color: "#ddd6fe",
                  border: "1px solid rgba(124,58,237,0.35)",
                  background: "rgba(124,58,237,0.14)",
                  borderRadius: "999px",
                  padding: "0.2rem 0.55rem",
                  fontWeight: 700,
                }}
              >
                {skill.difficulty}
              </span>
            </div>

            <div style={{ height: "8px", borderRadius: "99px", background: "rgba(255,255,255,0.08)", overflow: "hidden", marginBottom: "0.45rem" }}>
              <div
                style={{
                  width: `${percent}%`,
                  height: "100%",
                  borderRadius: "99px",
                  background: "linear-gradient(135deg, #7c3aed, #9333ea)",
                  transition: "width 450ms ease",
                }}
              />
            </div>
            <p style={{ margin: "0 0 0.35rem", color: "rgba(255,255,255,0.6)", fontSize: "0.8rem" }}>
              Progress: {percent}%
            </p>
            <p style={{ margin: "0 0 0.75rem", color: "rgba(196,181,253,0.9)", fontSize: "0.75rem", fontWeight: 600 }}>{status}</p>

            <button
              onClick={() => setLocation(`/skills/${skill.id}`)}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(124,58,237,0.4)";
                e.currentTarget.style.background = "linear-gradient(135deg, #8b5cf6, #a855f7)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.background = "linear-gradient(135deg, #7c3aed, #9333ea)";
              }}
              style={{
                width: "100%",
                border: "none",
                borderRadius: "10px",
                color: "white",
                fontWeight: 700,
                padding: "0.65rem 0.8rem",
                background: "linear-gradient(135deg, #7c3aed, #9333ea)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Start Learning
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
