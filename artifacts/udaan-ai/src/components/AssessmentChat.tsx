import { useState } from "react";
import { useLocation } from "wouter";
import { StarField } from "@/components/StarField";
import { getStoredStudent } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { setAssessmentSnapshot, type AssessmentDraft, type ChatMessage } from "@/lib/assessment-draft";
import logoPath from "/logo.png";

const GOAL_Q = "Hey! What's your main goal right now?";
const GOAL_OPTIONS = ["Get a Job", "Freelancing", "Start a Business", "Upskilling"] as const;

function normalizeDraft(raw: unknown): AssessmentDraft | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;
  const profile = d.profile as Record<string, unknown> | undefined;
  if (!profile) return null;
  const skillLevel = profile.skillLevel;
  const sl =
    skillLevel === "beginner" || skillLevel === "intermediate" || skillLevel === "advanced" ? skillLevel : null;
  return {
    hasEnoughInfo: Boolean(d.hasEnoughInfo),
    profile: {
      goal: typeof profile.goal === "string" ? profile.goal : null,
      field: typeof profile.field === "string" ? profile.field : null,
      skillLevel: sl,
      timePerDayMinutes: typeof profile.timePerDayMinutes === "number" ? profile.timePerDayMinutes : null,
      timelineWeeks: typeof profile.timelineWeeks === "number" ? profile.timelineWeeks : null,
      extraSkills: Array.isArray(profile.extraSkills) ? (profile.extraSkills as string[]).filter(Boolean) : [],
      interests: Array.isArray(profile.interests) ? (profile.interests as string[]).filter(Boolean) : [],
    },
    draftSummary: typeof d.draftSummary === "string" ? d.draftSummary : null,
  };
}

export function AssessmentChat() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const student = getStoredStudent();

  const [history, setHistory] = useState<{ question: string; answer: string }[]>([]);
  const [step, setStep] = useState<"goal" | "more" | "final">("goal");
  const [currentQuestion, setCurrentQuestion] = useState<string>(GOAL_Q);
  const [options, setOptions] = useState<string[]>([...GOAL_OPTIONS]);
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);

  if (!student) {
    setLocation("/signup");
    return null;
  }

  const answeredCount = history.length;
  const atQuestionDisplay = step === "goal" ? 1 : answeredCount + 1;
  // Dynamic progress: moves slower as it goes, caps at 95% until final step
  const progressPct = step === "final" ? 100 : Math.min(95, Math.round((atQuestionDisplay / 10) * 100));


  async function callNextQuestion(nextHistory: { question: string; answer: string }[]) {
    setLoading(true);
    try {
      const currentAnswer = nextHistory[nextHistory.length - 1].answer;
      const conversationHistory = nextHistory.slice(0, -1);
      
      const res = await fetch("/api/assessment/next-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationHistory, currentAnswer }),
      });
      if (!res.ok) throw new Error((await res.text()) || "Assessment API error");
      const data = (await res.json()) as {
        question: string;
        options: string[];
        isLastQuestion: boolean;
        questionNumber: number;
      };

      if (data.isLastQuestion) {
        setStep("final");
        setCurrentQuestion(data.question || "Any specific skills you want to add to your roadmap?");
        setOptions(data.options || ["No, I'm good"]);
      } else {
        setCurrentQuestion(data.question?.trim() || "Could you tell me more?");
        setOptions(Array.isArray(data.options) && data.options.length > 0 ? data.options : ["Surprise me", "I'm not sure"]);
        setStep("more");
      }
    } catch (e) {
      toast({ title: "Failed to load next question. Please try again." });
      setLoading(false);
      setCustom("");
      return;
    } finally {
      setLoading(false);
      setCustom("");
    }
  }

  async function callExtractDraft(finalHistory: { question: string; answer: string }[]) {
    setLoading(true);
    try {
      const res = await fetch("/api/assessment/extract-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationHistory: finalHistory }),
      });
      if (!res.ok) throw new Error((await res.text()) || "API error");
      const data = await res.json();
      
      const draft = normalizeDraft(data.draft);
      if (!draft) throw new Error("Invalid draft");
      
      const messages: ChatMessage[] = [];
      for (const h of finalHistory) {
        messages.push({ role: "assistant", content: h.question });
        messages.push({ role: "user", content: h.answer });
      }
      setAssessmentSnapshot({ messages, draft, updatedAt: Date.now() });
      toast({ title: "Nice — let's confirm your roadmap" });
      setLocation("/assessment/confirm");
    } catch (error) {
       console.log("Fallback draft logic");
       const mockDraft: AssessmentDraft = {
          hasEnoughInfo: true,
          profile: {
            goal: finalHistory[0]?.answer || "Get a Job",
            field: "General Tech",
            skillLevel: "intermediate",
            timePerDayMinutes: 60,
            timelineWeeks: 12,
            extraSkills: [],
            interests: ["JavaScript", "TypeScript"]
          },
          draftSummary: "Demo assessment completed successfully"
        };
        const messages: ChatMessage[] = [];
        for (const h of finalHistory) {
          messages.push({ role: "assistant", content: h.question });
          messages.push({ role: "user", content: h.answer });
        }
        setAssessmentSnapshot({ messages, draft: mockDraft, updatedAt: Date.now() });
        toast({ title: "Demo assessment completed - let's confirm your roadmap" });
        setLocation("/assessment/confirm");
    } finally {
      setLoading(false);
      setCustom("");
    }
  }

  function submitAnswer(text: string) {
    const trimmed = text.trim();
    if (!trimmed) {
      toast({ title: "Pick a button or type your answer" });
      return;
    }
    const qText = currentQuestion;
    const next = [...history, { question: qText, answer: trimmed }];
    setHistory(next);

    if (step === "final") {
      void callExtractDraft(next);
      return;
    }
    void callNextQuestion(next);
  }

  const pageBg = "linear-gradient(135deg, #050511 0%, #0d0d2b 60%, #050511 100%)";
  const cardBg = "rgba(13,10,40,0.85)";

  return (
    <div style={{ minHeight: "100vh", background: "#0d0b1e", position: "relative", padding: "1.25rem" }}>
      <StarField />

      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "720px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <img
            src={logoPath}
            alt="Udaan AI"
            style={{
              width: "48px",
              height: "48px",
              objectFit: "contain",
              filter: "brightness(0) invert(1) drop-shadow(0 0 6px rgba(245,158,11,0.5))",
              marginBottom: "0.5rem",
            }}
          />
          <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "white", marginBottom: "0.2rem" }}>AI Assessment</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.88rem" }}>Chill vibes — tap answers or type your own.</p>
        </div>

        <div
          style={{
            background: cardBg,
            border: "1px solid rgba(76,53,200,0.28)",
            borderRadius: "18px",
            padding: "0.85rem 1rem",
            marginBottom: "1rem",
            boxShadow: "0 0 40px rgba(76,53,200,0.12)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
            <span style={{ color: "#c4b5fd", fontSize: "0.78rem", fontWeight: 700 }}>
              {step === "final" ? "Finalizing Roadmap" : `Question ${atQuestionDisplay}`}
            </span>

            <span style={{ color: "#a78bfa", fontSize: "0.78rem", fontWeight: 700 }}>{progressPct}%</span>
          </div>
          <div style={{ height: "6px", borderRadius: "999px", background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${progressPct}%`,
                borderRadius: "999px",
                background: "linear-gradient(90deg, #4c35c8, #9333ea)",
                transition: "width 0.35s ease",
              }}
            />
          </div>
        </div>

        {history.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", marginBottom: "1rem" }}>
            {history.map((h, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "0.35rem",
                  background: "rgba(76,53,200,0.08)",
                  border: "1px solid rgba(76,53,200,0.22)",
                  borderRadius: "14px",
                  padding: "0.65rem 0.75rem",
                }}
              >
                <p style={{ margin: 0, color: "rgba(255,255,255,0.45)", fontSize: "0.72rem", fontWeight: 700 }}>Q{i + 1}</p>
                <p style={{ margin: 0, color: "white", fontSize: "0.9rem", fontWeight: 600 }}>{h.question}</p>
                <p style={{ margin: 0, color: "#ddd6fe", fontSize: "0.88rem" }}>{h.answer}</p>
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            background: cardBg,
            border: "1px solid rgba(76,53,200,0.28)",
            borderRadius: "18px",
            padding: "1rem",
            boxShadow: "0 0 40px rgba(76,53,200,0.1)",
          }}
        >
          <p style={{ color: "white", fontWeight: 800, fontSize: "1.02rem", lineHeight: 1.5, marginTop: 0 }}>{currentQuestion}</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.5rem", marginBottom: "0.75rem" }}>
            {options.map(option => (
              <button
                key={option}
                type="button"
                disabled={loading}
                onClick={() => submitAnswer(option)}
                style={{
                  border: "1px solid rgba(76,53,200,0.45)",
                  borderRadius: "12px",
                  padding: "0.65rem 0.7rem",
                  color: "white",
                  fontWeight: 700,
                  background: "linear-gradient(135deg, rgba(76,53,200,0.7), rgba(147,51,234,0.55))",
                  cursor: loading ? "wait" : "pointer",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "0.86rem",
                }}
              >
                {option}
              </button>
            ))}
          </div>

          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem", margin: "0 0 0.35rem" }}>Or type your own answer</p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <input
              value={custom}
              onChange={e => setCustom(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submitAnswer(custom)}
              placeholder="Your words, your way…"
              disabled={loading}
              style={{
                flex: "1 1 200px",
                padding: "0.7rem 0.85rem",
                background: "rgba(76,53,200,0.1)",
                border: "1px solid rgba(76,53,200,0.35)",
                borderRadius: "12px",
                color: "white",
                fontSize: "0.9rem",
                outline: "none",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            />
            <button
              type="button"
              disabled={loading}
              onClick={() => submitAnswer(custom)}
              style={{
                padding: "0.7rem 1rem",
                border: "none",
                borderRadius: "12px",
                background: loading ? "rgba(76,53,200,0.35)" : "linear-gradient(135deg, #4c35c8, #9333ea)",
                color: "white",
                fontWeight: 800,
                cursor: loading ? "wait" : "pointer",
              }}
            >
              {loading ? "Thinking…" : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
