import { randomUUID } from "crypto";

type Id = string;

export type DevStudent = {
  id: Id;
  studentId: string;
  name: string;
  mobile: string;
  email: string | null;
  avatar?: string | null;
  branch?: string | null;
  semester?: number | null;
  college?: string | null;
  assessmentCompleted: boolean;
  skillLevel?: string | null;
  interests?: string[] | null;
  totalPoints?: number | null;
  streak?: number | null;
  joinedAt?: Date | null;
};

export type DevOtp = {
  id: Id;
  mobile: string;
  otp: string;
  used: boolean;
  expiresAt: Date;
  createdAt: Date;
};

export type DevCourse = {
  id: Id;
  title: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  totalLectures: number;
  duration?: string | null;
  description?: string | null;
  thumbnail?: string | null;
};

export type DevLecture = {
  id: Id;
  courseId: Id;
  title: string;
  order: number;
  duration?: string | null;
  videoUrl?: string | null;
};

export type DevNote = {
  id: Id;
  courseId: Id;
  title: string;
  content: string;
};

export type DevRoadmap = {
  id: Id;
  studentId: Id;
  title: string;
  description: string | null;
  phases: any[];
  estimatedDuration: string | null;
  createdAt: Date;
};

export type DevProgress = {
  id: Id;
  studentId: Id;
  courseId: Id;
  lectureId: Id;
  completed: boolean;
  progress: number;
  updatedAt: Date;
};

export type DevCertificate = {
  id: Id;
  studentId: Id;
  courseId: Id;
  certCode: string;
  issuedAt: Date;
  skillName?: string | null;
};

export type DevQuizSession = {
  questions: {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
  }[];
  createdAt: number;
};

function generateStudentId(): string {
  const year = new Date().getFullYear();
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `UDN-${year}-${num}`;
}

export const devStore = {
  studentsById: new Map<Id, DevStudent>(),
  studentsByMobile: new Map<string, Id>(),
  otpsByMobile: new Map<string, DevOtp[]>(),
  roadmapsByStudentId: new Map<Id, DevRoadmap>(),
  progress: [] as DevProgress[],
  certificates: [] as DevCertificate[],
  courses: [] as DevCourse[],
  lectures: [] as DevLecture[],
  notes: [] as DevNote[],
  quizSessions: new Map<string, DevQuizSession>(),
};

export function ensureDevSeedData(): void {
  if (devStore.courses.length > 0) return;

  const courses: DevCourse[] = [
    { id: "c1", title: "Python Foundations", category: "Programming", difficulty: "beginner", totalLectures: 18, duration: "3 weeks", description: "Basics of Python + practice for beginners." },
    { id: "c2", title: "Data Structures (Beginner)", category: "DSA", difficulty: "beginner", totalLectures: 22, duration: "4 weeks", description: "Core DS concepts with simple problems." },
    { id: "c3", title: "Web Dev Starter (React)", category: "Web Development", difficulty: "intermediate", totalLectures: 16, duration: "3 weeks", description: "Build a modern UI with React + TypeScript." },
    { id: "c4", title: "ML Basics with scikit-learn", category: "AI/ML", difficulty: "intermediate", totalLectures: 20, duration: "4 weeks", description: "Supervised learning + model evaluation." },
    { id: "c5", title: "System Design Intro", category: "Backend", difficulty: "advanced", totalLectures: 12, duration: "2 weeks", description: "Design fundamentals and tradeoffs." },
    { id: "c6", title: "Deep Learning Starter", category: "AI/ML", difficulty: "advanced", totalLectures: 14, duration: "3 weeks", description: "Neural nets basics + hands-on." },
  ];

  devStore.courses.push(...courses);

  for (const course of courses) {
    for (let i = 1; i <= Math.max(6, Math.min(course.totalLectures, 10)); i++) {
      devStore.lectures.push({
        id: `${course.id}-l${i}`,
        courseId: course.id,
        title: `Lecture ${i}: ${course.title}`,
        order: i,
        duration: `${10 + i} min`,
        videoUrl: null,
      });
    }

    devStore.notes.push({
      id: `${course.id}-n1`,
      courseId: course.id,
      title: `${course.title} — Quick Notes`,
      content: `Notes for ${course.title}.\n\nThis is local-dev seed content.`,
    });
  }
}

export function devRegisterStudent(input: { name: string; mobile: string; email?: string | null }): DevStudent {
  ensureDevSeedData();

  const existingId = devStore.studentsByMobile.get(input.mobile);
  if (existingId) {
    const existing = devStore.studentsById.get(existingId);
    if (existing) return existing;
  }

  const id = randomUUID();
  const student: DevStudent = {
    id,
    studentId: generateStudentId(),
    name: input.name,
    mobile: input.mobile,
    email: input.email ?? null,
    assessmentCompleted: false,
    joinedAt: new Date(),
    streak: 0,
    totalPoints: 0,
    interests: [],
    skillLevel: "beginner",
  };

  devStore.studentsById.set(id, student);
  devStore.studentsByMobile.set(input.mobile, id);
  return student;
}

export function devUpsertStudent(studentId: Id, patch: Partial<DevStudent>): DevStudent | null {
  const current = devStore.studentsById.get(studentId);
  if (!current) return null;
  const updated: DevStudent = { ...current, ...patch };
  devStore.studentsById.set(studentId, updated);
  return updated;
}

export function devGetStudent(studentId: Id): DevStudent | null {
  return devStore.studentsById.get(studentId) ?? null;
}

export function devCreateOtp(mobile: string, otp: string, expiresAt: Date): DevOtp {
  const record: DevOtp = {
    id: randomUUID(),
    mobile,
    otp,
    used: false,
    expiresAt,
    createdAt: new Date(),
  };
  const list = devStore.otpsByMobile.get(mobile) ?? [];
  list.push(record);
  devStore.otpsByMobile.set(mobile, list.slice(-10));
  return record;
}

export function devVerifyOtp(mobile: string, otp: string): boolean {
  const list = devStore.otpsByMobile.get(mobile) ?? [];
  const now = new Date();
  const match = list.find(r => r.otp === otp && !r.used && now < r.expiresAt);
  if (!match) return false;
  match.used = true;
  return true;
}

