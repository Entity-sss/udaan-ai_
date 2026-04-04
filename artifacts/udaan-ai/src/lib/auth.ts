export interface StoredStudent {
  id: string;
  studentId: string;
  name: string;
  mobile: string;
  assessmentCompleted: boolean;
}

export function getStoredStudent(): StoredStudent | null {
  try {
    const raw = localStorage.getItem("udaan_student");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredStudent(student: StoredStudent): void {
  localStorage.setItem("udaan_student", JSON.stringify(student));
}

export function clearStoredStudent(): void {
  localStorage.removeItem("udaan_student");
  localStorage.removeItem("udaan_token");
}

export function getStoredToken(): string | null {
  return localStorage.getItem("udaan_token");
}

export function setStoredToken(token: string): void {
  localStorage.setItem("udaan_token", token);
}
