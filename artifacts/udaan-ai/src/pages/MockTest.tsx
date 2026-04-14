import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import type { Question } from "@/data/mockTestQuestions";

type Screen = "setup" | "test" | "results";

const CATEGORIES = ["Python", "JavaScript", "Data Structures", "ML/AI", "Web Dev"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const DURATIONS = [10, 20, 30];

export default function MockTest() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [screen, setScreen] = useState<Screen>("setup");
  const [category, setCategory] = useState("Python");
  const [difficulty, setDifficulty] = useState("Medium");
  const [duration, setDuration] = useState(20);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback((finalAnswers: Record<string, number>, qs: Question[]) => {
    setAnswers(finalAnswers);
    setScreen("results");
    setShowReview(false);
  }, []);

  useEffect(() => {
    if (screen !== "test") return;
    setTimeLeft(duration * 60);
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          toast({ title: "Time's up! Submitting your test." });
          handleSubmit(answers, questions);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [screen]);

  async function startTest() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/mock-test/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, difficulty }),
      });
      if (!res.ok) throw new Error("Failed to generate test");
      const qs = await res.json();
      
      if (!qs || qs.length === 0) {
        toast({ title: "No questions available. Try another.", variant: "destructive" });
        return;
      }
      setQuestions(qs.slice(0, 10)); // enforce 10 questions
      setCurrentIdx(0);
      setAnswers({});
      setSelected(null);
      setScreen("test");
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to generate AI test", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  function handleNext() {
    if (selected === null) {
      toast({ title: "Please select an answer" });
      return;
    }
    const newAnswers = { ...answers, [questions[currentIdx].id]: selected };
    setAnswers(newAnswers);
    setSelected(null);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      handleSubmit(newAnswers, questions);
    }
  }

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const score = questions.filter(q => answers[q.id] === q.correct).length;
  const pct = questions.length ? Math.round((score / questions.length) * 100) : 0;
  const grade = pct >= 90 ? "A+" : pct >= 80 ? "A" : pct >= 70 ? "B+" : pct >= 60 ? "B" : pct >= 50 ? "C" : "F";
  const gradeColor = pct >= 80 ? "#10b981" : pct >= 60 ? "#f59e0b" : "#ef4444";

  const btnBase: React.CSSProperties = {
    padding: "0.75rem 1.5rem",
    borderRadius: "10px",
    cursor: "pointer",
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 600,
    fontSize: "0.9rem",
    transition: "all 0.2s",
    border: "none",
  };

  const cardStyle: React.CSSProperties = {
    background: "rgba(13,10,40,0.85)",
    border: "1px solid rgba(124,58,237,0.25)",
    borderRadius: "20px",
    padding: "2rem",
  };

  if (screen === "setup") return (
    <div style={{ padding: "1.5rem", maxWidth: "640px" }}>
      <button
        onClick={() => setLocation("/dashboard")}
        style={{ ...btnBase, background: "transparent", border: "1px solid rgba(124,58,237,0.3)", color: "#a78bfa", marginBottom: "1.5rem", padding: "0.4rem 0.875rem", fontSize: "0.8rem" }}
      >
        ← Back to Dashboard
      </button>

      <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "white", marginBottom: "0.25rem" }}>Mock Test</h1>
      <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "2rem" }}>Test your knowledge with timed MCQs</p>

      <div style={cardStyle}>
        <div style={{ marginBottom: "1.75rem" }}>
          <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Select Category
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {CATEGORIES.map(c => (
              <button
                key={c}
                data-testid={`category-${c}`}
                onClick={() => setCategory(c)}
                style={{
                  ...btnBase,
                  padding: "0.5rem 1rem",
                  fontSize: "0.85rem",
                  background: category === c ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${category === c ? "rgba(124,58,237,0.7)" : "rgba(255,255,255,0.1)"}`,
                  color: category === c ? "#c084fc" : "rgba(255,255,255,0.6)",
                }}
              >{c}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "1.75rem" }}>
          <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Difficulty
          </label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {DIFFICULTIES.map(d => {
              const col = d === "Easy" ? "#10b981" : d === "Medium" ? "#f59e0b" : "#ef4444";
              return (
                <button
                  key={d}
                  data-testid={`difficulty-${d}`}
                  onClick={() => setDifficulty(d)}
                  style={{
                    ...btnBase,
                    flex: 1,
                    padding: "0.6rem",
                    background: difficulty === d ? `${col}20` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${difficulty === d ? col : "rgba(255,255,255,0.1)"}`,
                    color: difficulty === d ? col : "rgba(255,255,255,0.5)",
                  }}
                >{d}</button>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Duration
          </label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {DURATIONS.map(d => (
              <button
                key={d}
                data-testid={`duration-${d}`}
                onClick={() => setDuration(d)}
                style={{
                  ...btnBase,
                  flex: 1,
                  padding: "0.6rem",
                  background: duration === d ? "rgba(6,182,212,0.15)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${duration === d ? "rgba(6,182,212,0.6)" : "rgba(255,255,255,0.1)"}`,
                  color: duration === d ? "#67e8f9" : "rgba(255,255,255,0.5)",
                }}
              >{d} min</button>
            ))}
          </div>
        </div>

        <div style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "12px", padding: "1rem", marginBottom: "1.5rem", display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          {[
            { label: "Questions", value: "10 MCQs" },
            { label: "Category", value: category },
            { label: "Difficulty", value: difficulty },
            { label: "Time", value: `${duration} min` },
          ].map(item => (
            <div key={item.label}>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>{item.label}</p>
              <p style={{ color: "white", fontWeight: 700, fontSize: "0.95rem" }}>{item.value}</p>
            </div>
          ))}
        </div>

        <button
          data-testid="button-start-test"
          onClick={startTest}
          disabled={isLoading}
          style={{ ...btnBase, width: "100%", padding: "1rem", background: isLoading ? "rgba(124,58,237,0.3)" : "linear-gradient(135deg, #7c3aed, #9333ea)", color: "white", fontSize: "1rem", boxShadow: isLoading ? "none" : "0 0 20px rgba(124,58,237,0.35)", cursor: isLoading ? "wait" : "pointer" }}
        >
          {isLoading ? "Generating with AI..." : "Start Test"}
        </button>
      </div>
    </div>
  );

  if (screen === "test") {
    const q = questions[currentIdx];
    const progress = ((currentIdx) / questions.length) * 100;
    const isWarning = timeLeft <= 120;

    return (
      <div style={{ padding: "1.5rem", maxWidth: "680px" }}>
        <style>{`@keyframes pulse-red { 0%,100%{color:#ef4444} 50%{color:#fca5a5} }`}</style>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <span style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)", color: "#a78bfa", padding: "0.2rem 0.75rem", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 600 }}>
              {category} · {difficulty}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.4rem 1rem",
              background: isWarning ? "rgba(239,68,68,0.15)" : "rgba(6,182,212,0.1)",
              border: `1px solid ${isWarning ? "rgba(239,68,68,0.4)" : "rgba(6,182,212,0.3)"}`,
              borderRadius: "20px",
              animation: isWarning ? "pulse-red 1s ease-in-out infinite" : "none",
            }}
          >
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: isWarning ? "#ef4444" : "#67e8f9", fontVariantNumeric: "tabular-nums", letterSpacing: "0.05em" }}>
              ⏱ {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
            <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.8rem" }}>Question {currentIdx + 1} / {questions.length}</span>
            <span style={{ color: "#a78bfa", fontSize: "0.8rem", fontWeight: 600 }}>{Math.round(progress)}% done</span>
          </div>
          <div style={{ height: "5px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #7c3aed, #9333ea)", transition: "width 0.4s ease" }} />
          </div>
        </div>

        <div style={cardStyle}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Q{currentIdx + 1}
          </p>
          <h3 style={{ color: "white", fontWeight: 700, fontSize: "1.1rem", lineHeight: 1.5, marginBottom: "1.5rem" }}>
            {q.question}
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "1.5rem" }}>
            {q.options.map((opt, i) => (
              <button
                key={i}
                data-testid={`option-${i}`}
                onClick={() => setSelected(i)}
                style={{
                  ...btnBase,
                  padding: "0.875rem 1.25rem",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.875rem",
                  background: selected === i ? "rgba(124,58,237,0.25)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${selected === i ? "rgba(124,58,237,0.7)" : "rgba(255,255,255,0.09)"}`,
                  color: selected === i ? "#c084fc" : "rgba(255,255,255,0.75)",
                  fontWeight: selected === i ? 600 : 400,
                }}
              >
                <div style={{
                  width: "24px", height: "24px", borderRadius: "50%", flexShrink: 0,
                  border: `2px solid ${selected === i ? "#7c3aed" : "rgba(255,255,255,0.2)"}`,
                  background: selected === i ? "rgba(124,58,237,0.3)" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {selected === i && <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#a78bfa" }} />}
                </div>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.3)", minWidth: "1rem" }}>{String.fromCharCode(65 + i)}.</span>
                {opt}
              </button>
            ))}
          </div>

          <button
            data-testid="button-next-question"
            onClick={handleNext}
            style={{ ...btnBase, width: "100%", padding: "0.875rem", background: "linear-gradient(135deg, #7c3aed, #9333ea)", color: "white" }}
          >
            {currentIdx === questions.length - 1 ? "Submit Test" : "Next Question →"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "1.5rem", maxWidth: "720px" }}>
      <div style={{ ...cardStyle, textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: "3.5rem", fontWeight: 900, color: gradeColor, marginBottom: "0.25rem" }}>{grade}</div>
        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "white", marginBottom: "0.5rem" }}>
          {score} / {questions.length} Correct
        </div>
        <div style={{ display: "inline-block", padding: "0.3rem 1.25rem", background: `${gradeColor}20`, border: `1px solid ${gradeColor}60`, borderRadius: "20px", color: gradeColor, fontWeight: 700, fontSize: "1.1rem" }}>
          {pct}%
        </div>
        <p style={{ color: "rgba(255,255,255,0.5)", marginTop: "0.75rem", fontSize: "0.9rem" }}>
          {pct >= 80 ? "Excellent work! You're well prepared." : pct >= 60 ? "Good effort! Review the missed questions below." : "Keep practicing — you'll get there. Review the explanations below."}
        </p>

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "1.25rem", flexWrap: "wrap" }}>
          <button
            data-testid="button-review-answers"
            onClick={() => setShowReview(!showReview)}
            style={{ ...btnBase, background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)", color: "#c084fc" }}
          >
            {showReview ? "Hide" : "Review"} Answers
          </button>
          <button
            data-testid="button-retake"
            onClick={() => setScreen("setup")}
            style={{ ...btnBase, background: "linear-gradient(135deg, #7c3aed, #9333ea)", color: "white" }}
          >
            Retake Test
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.75rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Correct", value: score, color: "#10b981" },
          { label: "Wrong", value: questions.length - score, color: "#ef4444" },
          { label: "Accuracy", value: `${pct}%`, color: "#7c3aed" },
          { label: "Category", value: category, color: "#f59e0b" },
        ].map(s => (
          <div key={s.label} style={{ ...cardStyle, padding: "1rem", textAlign: "center", borderTop: `3px solid ${s.color}` }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {showReview && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h3 style={{ color: "white", fontWeight: 700, marginBottom: "0.25rem" }}>Answer Review</h3>
          {questions.map((q, idx) => {
            const userAns = answers[q.id];
            const isCorrect = userAns === q.correct;
            return (
              <div
                key={q.id}
                data-testid={`review-${q.id}`}
                style={{
                  ...cardStyle,
                  padding: "1.25rem",
                  borderLeft: `4px solid ${isCorrect ? "#10b981" : "#ef4444"}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.6rem" }}>
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem" }}>Q{idx + 1}</span>
                  <span style={{ color: isCorrect ? "#10b981" : "#ef4444", fontWeight: 700, fontSize: "0.8rem" }}>
                    {isCorrect ? "✓ Correct" : "✗ Wrong"}
                  </span>
                </div>
                <p style={{ color: "white", fontWeight: 600, marginBottom: "0.75rem", lineHeight: 1.4 }}>{q.question}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", marginBottom: "0.75rem" }}>
                  {q.options.map((opt, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "0.4rem 0.75rem",
                        borderRadius: "8px",
                        fontSize: "0.85rem",
                        background: i === q.correct ? "rgba(16,185,129,0.1)" : i === userAns && !isCorrect ? "rgba(239,68,68,0.1)" : "transparent",
                        color: i === q.correct ? "#34d399" : i === userAns && !isCorrect ? "#fca5a5" : "rgba(255,255,255,0.5)",
                        fontWeight: i === q.correct ? 600 : 400,
                        border: `1px solid ${i === q.correct ? "rgba(16,185,129,0.25)" : "transparent"}`,
                      }}
                    >
                      {String.fromCharCode(65 + i)}. {opt}
                      {i === q.correct && " ✓"}
                      {i === userAns && !isCorrect && " (Your answer)"}
                    </div>
                  ))}
                </div>
                <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "8px", padding: "0.625rem 0.875rem" }}>
                  <span style={{ color: "#f59e0b", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Explanation </span>
                  <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.85rem" }}>{q.explanation}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
