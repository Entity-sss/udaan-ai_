import { useLocation } from "wouter";
import { getStoredStudent, setStoredStudent } from "@/lib/auth";
import { AssessmentChat } from "@/components/AssessmentChat";

export default function Assessment() {
  const [, setLocation] = useLocation();
  const student = getStoredStudent();

  if (!student) {
    setLocation("/signup");
    return null;
  }

  // Ensure old MCQ completion flag doesn't block chat flow
  if (student.assessmentCompleted) {
    return <AssessmentChat />;
  }

  return <AssessmentChat />;
}
