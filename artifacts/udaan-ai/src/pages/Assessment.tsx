import { useState } from "react";
import { useLocation } from "wouter";
import { StarField } from "@/components/StarField";
import {
  useGetAssessmentQuestions,
  getGetAssessmentQuestionsQueryKey,
  useSubmitAssessment,
} from "@workspace/api-client-react";
import { getStoredStudent, setStoredStudent } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import logoPath from "/logo.png";

export default function Assessment() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const student = getStoredStudent();

  const { data: questions, isLoading } = useGetAssessmentQuestions({
    query: { queryKey: getGetAssessmentQuestionsQueryKey() },
  });

  const submitAssessment = useSubmitAssessment();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);

  if (!student) {
    setLocation("/signup");
    return null;
  }

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #050511 0%, #0d0d2b 60%, #050511 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <StarField />
        <div style={{ position: "relative", zIndex: 10, textAlign: "center" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              border: "3px solid rgba(124,58,237,0.3)",
              borderTop: "3px solid #7c3aed",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 1rem",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: "rgba(255,255,255,0.6)" }}>Loading your assessment...</p>
        </div>
      </div>
    );
  }

  const questionList = questions || [];
  const currentQ = questionList[currentIndex];
  const progress = questionList.length > 0 ? ((currentIndex) / questionList.length) * 100 : 0;

  function handleSelect(option: string) {
    setSelected(option);
  }

  function handleNext() {
    if (!selected) {
      toast({ title: "Please select an answer to continue" });
      return;
    }
    const newAnswers = { ...answers, [currentQ.id]: selected };
    setAnswers(newAnswers);
    setSelected(null);

    if (currentIndex < questionList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleSubmit(newAnswers);
    }
  }

  async function handleSubmit(finalAnswers: Record<string, string>) {
    try {
      const answerList = Object.entries(finalAnswers).map(([questionId, answer]) => ({
        questionId,
        answer,
      }));
      await submitAssessment.mutateAsync({
        data: { studentId: student!.id, answers: answerList },
      });
      setStoredStudent({ ...student!, assessmentCompleted: true });
      toast({ title: "Assessment complete! Your roadmap is ready." });
      setLocation("/roadmap");
    } catch {
      toast({ title: "Failed to submit assessment", variant: "destructive" });
    }
  }

  const categoryLabels: Record<string, string> = {
    experience: "Experience Level",
    languages: "Languages Known",
    interest: "Area of Interest",
    ml_knowledge: "ML Knowledge",
    career: "Career Goals",
    time: "Learning Schedule",
    fundamentals: "Tech Fundamentals",
    projects: "Project Preference",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #050511 0%, #0d0d2b 60%, #050511 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: "1.5rem",
      }}
    >
      <StarField />
      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "600px" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <img
            src={logoPath}
            alt="Udaan AI"
            style={{
              width: "45px",
              height: "45px",
              objectFit: "contain",
              filter: "brightness(0) invert(1) drop-shadow(0 0 6px rgba(245,158,11,0.5))",
              marginBottom: "0.75rem",
            }}
          />
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "white",
              marginBottom: "0.25rem",
            }}
          >
            Skills Assessment
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>
            Help us understand you better to craft your perfect roadmap
          </p>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>
              Question {currentIndex + 1} of {questionList.length}
            </span>
            <span
              style={{
                fontSize: "0.8rem",
                color: "#a78bfa",
                background: "rgba(124,58,237,0.2)",
                padding: "0.15rem 0.6rem",
                borderRadius: "20px",
                border: "1px solid rgba(124,58,237,0.3)",
              }}
            >
              {categoryLabels[currentQ?.category] || currentQ?.category}
            </span>
          </div>
          <div
            style={{
              height: "4px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(90deg, #7c3aed, #9333ea)",
                borderRadius: "2px",
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>

        {currentQ && (
          <div
            style={{
              background: "rgba(13,10,40,0.85)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(124,58,237,0.25)",
              borderRadius: "20px",
              padding: "2rem",
              boxShadow: "0 0 40px rgba(124,58,237,0.1)",
            }}
          >
            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: 600,
                color: "white",
                marginBottom: "1.5rem",
                lineHeight: 1.5,
              }}
            >
              {currentQ.question}
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {(currentQ.options || []).map((option, idx) => (
                <button
                  key={idx}
                  data-testid={`button-option-${idx}`}
                  onClick={() => handleSelect(option)}
                  style={{
                    padding: "0.875rem 1.25rem",
                    textAlign: "left",
                    background:
                      selected === option
                        ? "rgba(124,58,237,0.3)"
                        : "rgba(255,255,255,0.04)",
                    border:
                      selected === option
                        ? "1px solid rgba(124,58,237,0.7)"
                        : "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: selected === option ? "#c084fc" : "rgba(255,255,255,0.8)",
                    cursor: "pointer",
                    fontSize: "0.95rem",
                    fontFamily: "'Space Grotesk', sans-serif",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      border: selected === option ? "2px solid #7c3aed" : "2px solid rgba(255,255,255,0.2)",
                      background: selected === option ? "rgba(124,58,237,0.4)" : "transparent",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {selected === option && (
                      <div
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          background: "#a78bfa",
                        }}
                      />
                    )}
                  </div>
                  {option}
                </button>
              ))}
            </div>

            <button
              data-testid="button-next"
              onClick={handleNext}
              disabled={submitAssessment.isPending}
              style={{
                width: "100%",
                marginTop: "1.5rem",
                padding: "1rem",
                background: "linear-gradient(135deg, #7c3aed, #9333ea)",
                border: "none",
                borderRadius: "12px",
                color: "white",
                fontWeight: 700,
                fontSize: "1rem",
                cursor: "pointer",
                boxShadow: "0 0 20px rgba(124,58,237,0.3)",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {submitAssessment.isPending
                ? "Creating your roadmap..."
                : currentIndex === questionList.length - 1
                  ? "Complete Assessment"
                  : "Next Question"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
