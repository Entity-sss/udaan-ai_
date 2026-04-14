type Role = "user" | "assistant";

export type ChatMessage = {
  role: Role;
  content: string;
};

export type DraftProfile = {
  goal: string | null;
  field: string | null;
  skillLevel: "beginner" | "intermediate" | "advanced" | null;
  timePerDayMinutes: number | null;
  timelineWeeks: number | null;
  extraSkills: string[];
  interests: string[];
};

export type AssessmentDraft = {
  hasEnoughInfo: boolean;
  profile: DraftProfile;
  draftSummary: string | null;
};

export type AssessmentSnapshot = {
  messages: ChatMessage[];
  draft: AssessmentDraft;
  updatedAt: number;
};

export type ConfirmedRoadmapProfile = {
  goal: string;
  field: string;
  skillLevel: "beginner" | "intermediate" | "advanced";
  timePerDayMinutes: number;
  interests: string[];
  extraSkills: string[];
  timelineWeeks: number;
  phases: number;
};

const STORAGE_KEY = "udaan_assessment_snapshot";
const ROADMAP_PROFILE_KEY = "udaan_confirmed_roadmap_profile";

export function setAssessmentSnapshot(data: AssessmentSnapshot): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getAssessmentSnapshot(): AssessmentSnapshot | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AssessmentSnapshot;
  } catch {
    return null;
  }
}

export function clearAssessmentSnapshot(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function setConfirmedRoadmapProfile(profile: ConfirmedRoadmapProfile): void {
  localStorage.setItem(ROADMAP_PROFILE_KEY, JSON.stringify(profile));
}

export function getConfirmedRoadmapProfile(): ConfirmedRoadmapProfile | null {
  try {
    const raw = localStorage.getItem(ROADMAP_PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ConfirmedRoadmapProfile;
  } catch {
    return null;
  }
}
