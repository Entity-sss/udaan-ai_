import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { getStoredStudent } from "@/lib/auth";
import { getSkillsFromRoadmap, getSkillProgress, isProjectAvailable, recordProjectSubmitted } from "@/lib/skills-progress";
import { useToast } from "@/hooks/use-toast";

export default function SkillProject() {
  const { skillId } = useParams<{ skillId: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const student = getStoredStudent();
  const skills = getSkillsFromRoadmap();
  const skill = skills.find(s => s.id === skillId);
  const progress = getSkillProgress();
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const allowed = skill && isProjectAvailable(skill.id, progress);
  const alreadyDone = skill ? progress.projectSubmittedIds.includes(skill.id) : false;

  useEffect(() => {
    if (!student) setLocation("/signup");
  }, [student, setLocation]);

  if (!student) return null;

  if (skill && alreadyDone) {
    return (
      <div style={{ padding: "1.5rem", maxWidth: "720px" }}>
        <p style={{ color: "#86efac", fontWeight: 600 }}>You already submitted this project. Check Certificates.</p>
        <button
          type="button"
          onClick={() => setLocation("/certificates")}
          style={{
            marginTop: "1rem",
            padding: "0.65rem 1rem",
            borderRadius: "10px",
            border: "none",
            background: "linear-gradient(135deg, #4c35c8, #6d4fd6)",
            color: "white",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          View certificates
        </button>
      </div>
    );
  }

  if (!skill || !allowed) {
    return (
      <div style={{ padding: "1.5rem", maxWidth: "720px" }}>
        <p style={{ color: "rgba(255,255,255,0.7)" }}>
          Pass your final skill exam first to unlock the real-world project.
        </p>
        <button
          type="button"
          onClick={() => setLocation(skill ? `/skills/${skill.id}` : "/skills")}
          style={{
            marginTop: "1rem",
            padding: "0.6rem 1rem",
            borderRadius: "10px",
            border: "1px solid rgba(124,58,237,0.4)",
            background: "rgba(124,58,237,0.15)",
            color: "#e9d5ff",
            cursor: "pointer",
          }}
        >
          Back
        </button>
      </div>
    );
  }

  async function handleSubmit() {
    if (!student || !skill) return;
    if (!notes.trim()) {
      toast({ title: "Drop a short summary of what you built", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/certificates/skill-issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: student.id,
          skillId: skill.id,
          skillName: skill.name,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      recordProjectSubmitted(skill.id);
      toast({ title: "Project submitted!", description: "Your certificate is ready." });
      setLocation("/certificates");
    } catch (e) {
      toast({ title: "Submit failed", description: String((e as Error).message), variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ padding: "1.5rem", maxWidth: "800px" }}>
      <button
        type="button"
        onClick={() => setLocation(`/skills/${skill.id}`)}
        style={{
          marginBottom: "0.8rem",
          background: "transparent",
          border: "1px solid rgba(124,58,237,0.35)",
          color: "#c4b5fd",
          borderRadius: "9px",
          padding: "0.45rem 0.75rem",
          cursor: "pointer",
        }}
      >
        ← Back
      </button>
      <h1 style={{ color: "white", fontWeight: 800, fontSize: "1.6rem", marginBottom: "0.5rem" }}>
        {skill.icon} Industry project · {skill.name}
      </h1>
      <p style={{ color: "rgba(255,255,255,0.55)", marginBottom: "1.25rem", lineHeight: 1.55 }}>
        Build something you would actually ship: a small app, analysis notebook, or portfolio piece that uses what you learned.
        Paste repo links or describe what you did below — we keep it chill, just show your work.
      </p>

      <div
        style={{
          background: "rgba(13,10,40,0.85)",
          border: "1px solid rgba(124,58,237,0.28)",
          borderRadius: "16px",
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <h3 style={{ color: "white", marginTop: 0 }}>Suggested scope</h3>
        <ul style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.6, paddingLeft: "1.1rem", marginBottom: 0 }}>
          <li>One clear user problem or demo outcome</li>
          <li>Readable structure + short README mindset</li>
          <li>3–5 bullets on what you learned</li>
        </ul>
      </div>

      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Links, stack, what you built, hurdles you solved..."
        rows={10}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "0.9rem",
          borderRadius: "12px",
          border: "1px solid rgba(124,58,237,0.35)",
          background: "rgba(124,58,237,0.08)",
          color: "white",
          fontSize: "0.95rem",
          marginBottom: "1rem",
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      />

      <button
        type="button"
        disabled={submitting}
        onClick={handleSubmit}
        style={{
          width: "100%",
          padding: "0.9rem",
          border: "none",
          borderRadius: "12px",
          background: submitting ? "rgba(76,53,200,0.35)" : "linear-gradient(135deg, #4c35c8, #9333ea)",
          color: "white",
          fontWeight: 800,
          cursor: submitting ? "wait" : "pointer",
        }}
      >
        {submitting ? "Submitting…" : "Submit project & get certificate"}
      </button>
    </div>
  );
}
