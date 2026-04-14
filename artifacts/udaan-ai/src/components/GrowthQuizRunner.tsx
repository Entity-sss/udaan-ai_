import { useCallback, useEffect, useRef, useState } from "react";

const accent = "linear-gradient(135deg, #4c35c8, #6d4fd6)";

export type QuizQuestion = { id: string; question: string; options: string[] };

type Props = {
  mode: "phase" | "level" | "final";
  skillName: string;
  levelTitle?: string;
  phaseTitle?: string;
  topics?: string[];
  materialSummary?: string;
  onPass: () => void;
  onFail: () => void;
  onExit: () => void;
};

export function GrowthQuizRunner({
  mode,
  skillName,
  levelTitle,
  phaseTitle,
  topics,
  materialSummary,
  onPass,
  onFail,
  onExit,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [timeLimitSec, setTimeLimitSec] = useState(300);
  const [passPercent, setPassPercent] = useState(60);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [secondsLeft, setSecondsLeft] = useState(300);
  const [phase, setPhase] = useState<"quiz" | "result">("quiz");
  const [result, setResult] = useState<{ scorePercent: number; passed: boolean; correct: number; total: number } | null>(
    null,
  );
  const answersRef = useRef(answers);
  const submittedRef = useRef(false);
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const startQuiz = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPhase("quiz");
    setResult(null);
    setIdx(0);
    setAnswers({});
    submittedRef.current = false;
    try {
      const res = await fetch("/api/growth/quiz/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          skillName,
          levelTitle,
          phaseTitle,
          topics,
          materialSummary,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start quiz");
      setSessionId(data.sessionId);
      setQuestions(data.questions || []);
      setTimeLimitSec(data.timeLimitSec ?? 300);
      setSecondsLeft(data.timeLimitSec ?? 300);
      setPassPercent(data.passPercent ?? 60);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [mode, skillName, levelTitle, phaseTitle, topics, materialSummary]);

  useEffect(() => {
    startQuiz();
  }, [startQuiz]);

  const submitQuiz = useCallback(
    async (timeUp = false) => {
      if (!sessionId || questions.length === 0 || submittedRef.current) return;
      submittedRef.current = true;
      const snap = answersRef.current;
    const payload = {
      sessionId,
      answers: questions.map(q => ({
        questionId: q.id,
        selectedIndex: snap[q.id] ?? -1,
      })),
    };
    try {
      const res = await fetch("/api/growth/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submit failed");
      setResult({
        scorePercent: data.scorePercent,
        passed: data.passed,
        correct: data.correct,
        total: data.total,
      });
      setPhase("result");
      if (data.passed) onPass();
      else if (!timeUp) onFail();
    } catch (e: unknown) {
      submittedRef.current = false;
      setError(e instanceof Error ? e.message : "Submit failed");
    }
    },
    [sessionId, questions, onPass, onFail],
  );

  useEffect(() => {
    if (phase !== "quiz" || loading || !sessionId) return;
    const t = window.setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          window.clearInterval(t);
          void submitQuiz(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(t);
  }, [phase, loading, sessionId, submitQuiz]);

  const current = questions[idx];
  const isLast = idx >= questions.length - 1;

  function selectOption(optionIndex: number) {
    if (!current) return;
    setAnswers(a => ({ ...a, [current.id]: optionIndex }));
  }

  function next() {
    if (!current || answers[current.id] === undefined) return;
    if (isLast) void submitQuiz();
    else setIdx(i => i + 1);
  }

  if (loading) {
    return (
      <div style={{ padding: "2rem", color: "rgba(255,255,255,0.7)", textAlign: "center" }}>
        Generating your quiz with AI…
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "1.5rem", maxWidth: "520px" }}>
        <p style={{ color: "#fca5a5" }}>{error}</p>
        <button
          type="button"
          onClick={() => startQuiz()}
          style={{
            marginTop: "0.75rem",
            padding: "0.65rem 1rem",
            borderRadius: "10px",
            border: "none",
            background: accent,
            color: "white",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (phase === "result" && result) {
    return (
      <div style={{ padding: "1.5rem", maxWidth: "560px" }}>
        <h2 style={{ color: "white", fontWeight: 800, marginTop: 0 }}>{result.passed ? "You passed!" : "Not quite yet"}</h2>
        <p style={{ color: "rgba(255,255,255,0.7)" }}>
          Score: {result.correct}/{result.total} ({result.scorePercent}%). Pass at {passPercent}%.
        </p>
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginTop: "1rem" }}>
          {!result.passed && (
            <button
              type="button"
              onClick={() => startQuiz()}
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "10px",
                border: "none",
                background: accent,
                color: "white",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Try new questions
            </button>
          )}
          <button
            type="button"
            onClick={onExit}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "10px",
              border: "1px solid rgba(76,53,200,0.5)",
              color: "#c4b5fd",
              fontWeight: 700,
              cursor: "pointer",
              background: "transparent",
            }}
          >
            {result.passed ? "Continue" : "Back"}
          </button>
        </div>
      </div>
    );
  }

  if (!current) return null;

  const mm = Math.floor(secondsLeft / 60);
  const ss = secondsLeft % 60;

  return (
    <div style={{ padding: "1.5rem", maxWidth: "640px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.85rem" }}>
          Question {idx + 1} / {questions.length}
        </span>
        <span
          style={{
            color: secondsLeft < 30 ? "#fca5a5" : "#c4b5fd",
            fontWeight: 800,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {mm}:{ss.toString().padStart(2, "0")}
        </span>
      </div>
      <h2 style={{ color: "white", fontWeight: 800, fontSize: "1.2rem", lineHeight: 1.4 }}>{current.question}</h2>
      <div style={{ display: "grid", gap: "0.55rem", marginTop: "1rem" }}>
        {current.options.map((opt, i) => {
          const selected = answers[current.id] === i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => selectOption(i)}
              style={{
                textAlign: "left",
                padding: "0.85rem 1rem",
                borderRadius: "12px",
                border: selected ? "2px solid #4c35c8" : "1px solid rgba(76,53,200,0.35)",
                background: selected ? "rgba(76,53,200,0.25)" : "rgba(13,11,30,0.85)",
                color: "white",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        disabled={answers[current.id] === undefined}
        onClick={() => next()}
        style={{
          marginTop: "1.25rem",
          width: "100%",
          padding: "0.9rem",
          borderRadius: "12px",
          border: "none",
          background: answers[current.id] === undefined ? "rgba(76,53,200,0.2)" : accent,
          color: "white",
          fontWeight: 800,
          cursor: answers[current.id] === undefined ? "not-allowed" : "pointer",
        }}
      >
        {isLast ? "Submit answers" : "Next"}
      </button>
    </div>
  );
}
