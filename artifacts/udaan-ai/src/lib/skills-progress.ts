import { getConfirmedRoadmapProfile } from "@/lib/assessment-draft";

export type SkillLevelId = "beginner" | "intermediate" | "advanced";

export type SkillPhase = {
  id: string;
  title: string;
  topics: string[];
  duration: string;
};

export type SkillLevel = {
  id: SkillLevelId;
  title: string;
  phases: SkillPhase[];
};

export type SkillItem = {
  id: string;
  name: string;
  icon: string;
  difficulty: "Easy" | "Medium" | "Hard";
  levels: SkillLevel[];
};

/** v2: content → phase mock → level test → final → project → cert */
export type SkillProgressState = {
  phaseContentDoneIds: string[];
  phaseMockPassedIds: string[];
  levelTestPassedKeys: string[];
  skillFinalPassedIds: string[];
  projectSubmittedIds: string[];
};

const STORAGE_KEY = "udaan_skill_progress_v2";
const LEGACY_KEY = "udaan_skill_progress_v1";

const DEFAULT_SKILLS = [
  { id: "python", name: "Python", icon: "🐍", difficulty: "Easy" as const },
  { id: "web-dev", name: "Web Development", icon: "🌐", difficulty: "Medium" as const },
  { id: "data-science", name: "Data Science", icon: "📊", difficulty: "Medium" as const },
  { id: "ai-ml", name: "AI/ML", icon: "🤖", difficulty: "Hard" as const },
  { id: "excel", name: "Excel", icon: "📗", difficulty: "Easy" as const },
  { id: "soft-skills", name: "Soft Skills", icon: "💬", difficulty: "Medium" as const },
  { id: "app-dev", name: "App Development", icon: "📱", difficulty: "Medium" as const },
  { id: "cybersecurity", name: "Cybersecurity", icon: "🛡️", difficulty: "Hard" as const },
];

function normalizeToSkillName(raw: string): string {
  const map: Record<string, string> = {
    "Web Dev": "Web Development",
    "App Dev": "App Development",
    "AI/ML": "AI/ML",
  };
  return map[raw] || raw;
}

function slugify(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function makePhases(skillId: string, levelId: SkillLevelId): SkillPhase[] {
  return [
    {
      id: `${skillId}-${levelId}-phase-1`,
      title: "Phase 1: Foundations",
      topics: ["Core concepts", "Setup and tooling", "Starter exercises"],
      duration: "1-2 weeks",
    },
    {
      id: `${skillId}-${levelId}-phase-2`,
      title: "Phase 2: Build & Practice",
      topics: ["Hands-on mini project", "Guided practice", "Debugging basics"],
      duration: "2-3 weeks",
    },
    {
      id: `${skillId}-${levelId}-phase-3`,
      title: "Phase 3: Real-world Application",
      topics: ["Portfolio task", "Interview-style questions", "Revision checklist"],
      duration: "2 weeks",
    },
    {
      id: `${skillId}-${levelId}-phase-4`,
      title: "Phase 4: Consolidation",
      topics: ["Capstone recap", "Best practices", "Next steps preview"],
      duration: "1 week",
    },
  ];
}

function makeLevels(skillId: string): SkillLevel[] {
  return [
    { id: "beginner", title: "Beginner", phases: makePhases(skillId, "beginner") },
    { id: "intermediate", title: "Intermediate", phases: makePhases(skillId, "intermediate") },
    { id: "advanced", title: "Advanced", phases: makePhases(skillId, "advanced") },
  ];
}

export function getSkillsFromRoadmap(): SkillItem[] {
  const confirmed = getConfirmedRoadmapProfile();
  const source = confirmed
    ? Array.from(new Set([...confirmed.interests, ...confirmed.extraSkills].map(normalizeToSkillName)))
    : DEFAULT_SKILLS.map(s => s.name);

  const names = source.length > 0 ? source : ["Python", "Web Development", "AI/ML"];

  return names.map(name => {
    const matched = DEFAULT_SKILLS.find(s => s.name.toLowerCase() === name.toLowerCase());
    const id = matched?.id || slugify(name);
    const icon = matched?.icon || "✨";
    const difficulty =
      matched?.difficulty ||
      (name.toLowerCase().includes("ai") || name.toLowerCase().includes("cyber") ? "Hard" : "Medium");

    return {
      id,
      name,
      icon,
      difficulty,
      levels: makeLevels(id),
    };
  });
}

function emptyProgress(): SkillProgressState {
  return {
    phaseContentDoneIds: [],
    phaseMockPassedIds: [],
    levelTestPassedKeys: [],
    skillFinalPassedIds: [],
    projectSubmittedIds: [],
  };
}

function migrateLegacy(): SkillProgressState {
  try {
    const raw = localStorage.getItem(LEGACY_KEY);
    if (!raw) return emptyProgress();
    const old = JSON.parse(raw) as { completedPhaseIds?: string[] };
    const ids = old.completedPhaseIds ?? [];
    return {
      phaseContentDoneIds: [...ids],
      phaseMockPassedIds: [...ids],
      levelTestPassedKeys: [],
      skillFinalPassedIds: [],
      projectSubmittedIds: [],
    };
  } catch {
    return emptyProgress();
  }
}

export function getSkillProgress(): SkillProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const migrated = migrateLegacy();
      saveSkillProgress(migrated);
      return migrated;
    }
    const p = JSON.parse(raw) as SkillProgressState;
    return {
      phaseContentDoneIds: p.phaseContentDoneIds ?? [],
      phaseMockPassedIds: p.phaseMockPassedIds ?? [],
      levelTestPassedKeys: p.levelTestPassedKeys ?? [],
      skillFinalPassedIds: p.skillFinalPassedIds ?? [],
      projectSubmittedIds: p.projectSubmittedIds ?? [],
    };
  } catch {
    return emptyProgress();
  }
}

export function saveSkillProgress(progress: SkillProgressState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function levelTestKey(skillId: string, levelId: SkillLevelId): string {
  return `${skillId}:${levelId}`;
}

/** Phase list view: phase 0 always; phase i needs previous phase mock passed */
export function isPhaseUnlocked(phases: SkillPhase[], index: number, progress: SkillProgressState): boolean {
  if (index === 0) return true;
  return progress.phaseMockPassedIds.includes(phases[index - 1].id);
}

/** Level list: level 0 always; level k needs level k-1 test passed */
export function isLevelUnlocked(levels: SkillLevel[], index: number, skillId: string, progress: SkillProgressState): boolean {
  if (index === 0) return true;
  const prev = levels[index - 1];
  return progress.levelTestPassedKeys.includes(levelTestKey(skillId, prev.id));
}

export function allPhaseMocksPassedForLevel(level: SkillLevel, progress: SkillProgressState): boolean {
  return level.phases.every(ph => progress.phaseMockPassedIds.includes(ph.id));
}

export function isLevelTestAvailable(skill: SkillItem, level: SkillLevel, progress: SkillProgressState): boolean {
  return allPhaseMocksPassedForLevel(level, progress);
}

export function isFinalSkillTestAvailable(skill: SkillItem, progress: SkillProgressState): boolean {
  return skill.levels.every(lv => progress.levelTestPassedKeys.includes(levelTestKey(skill.id, lv.id)));
}

export function isProjectAvailable(skillId: string, progress: SkillProgressState): boolean {
  return progress.skillFinalPassedIds.includes(skillId);
}

export function markPhaseContentComplete(phaseId: string): SkillProgressState {
  const p = getSkillProgress();
  if (p.phaseContentDoneIds.includes(phaseId)) return p;
  const next = { ...p, phaseContentDoneIds: [...p.phaseContentDoneIds, phaseId] };
  saveSkillProgress(next);
  return next;
}

export function recordPhaseMockPassed(phaseId: string): SkillProgressState {
  const p = getSkillProgress();
  if (p.phaseMockPassedIds.includes(phaseId)) return p;
  const next = { ...p, phaseMockPassedIds: [...p.phaseMockPassedIds, phaseId] };
  saveSkillProgress(next);
  return next;
}

export function recordLevelTestPassed(skillId: string, levelId: SkillLevelId): SkillProgressState {
  const p = getSkillProgress();
  const key = levelTestKey(skillId, levelId);
  if (p.levelTestPassedKeys.includes(key)) return p;
  const next = { ...p, levelTestPassedKeys: [...p.levelTestPassedKeys, key] };
  saveSkillProgress(next);
  return next;
}

export function recordSkillFinalPassed(skillId: string): SkillProgressState {
  const p = getSkillProgress();
  if (p.skillFinalPassedIds.includes(skillId)) return p;
  const next = { ...p, skillFinalPassedIds: [...p.skillFinalPassedIds, skillId] };
  saveSkillProgress(next);
  return next;
}

export function recordProjectSubmitted(skillId: string): SkillProgressState {
  const p = getSkillProgress();
  if (p.projectSubmittedIds.includes(skillId)) return p;
  const next = { ...p, projectSubmittedIds: [...p.projectSubmittedIds, skillId] };
  saveSkillProgress(next);
  return next;
}

export function isPhaseContentDone(phaseId: string, progress: SkillProgressState): boolean {
  return progress.phaseContentDoneIds.includes(phaseId);
}

export function isPhaseMockPassed(phaseId: string, progress: SkillProgressState): boolean {
  return progress.phaseMockPassedIds.includes(phaseId);
}

export function canStartPhaseMockTest(phaseId: string, progress: SkillProgressState): boolean {
  return isPhaseContentDone(phaseId, progress) && !isPhaseMockPassed(phaseId, progress);
}

export function getSkillOverallPercent(skill: SkillItem, progress: SkillProgressState): number {
  const allPhaseIds = skill.levels.flatMap(l => l.phases.map(ph => ph.id));
  if (allPhaseIds.length === 0) return 0;
  const done = allPhaseIds.filter(id => progress.phaseMockPassedIds.includes(id)).length;
  return Math.round((done / allPhaseIds.length) * 100);
}

export function getLevelProgressPercent(level: SkillLevel, progress: SkillProgressState): number {
  const ids = level.phases.map(p => p.id);
  if (ids.length === 0) return 0;
  const done = ids.filter(id => progress.phaseMockPassedIds.includes(id)).length;
  return Math.round((done / ids.length) * 100);
}

/** @deprecated use getSkillProgress + phase mock ids */
export function getCompletionPercent(phaseIds: string[], completedPhaseIds: string[]): number {
  if (phaseIds.length === 0) return 0;
  const done = phaseIds.filter(id => completedPhaseIds.includes(id)).length;
  return Math.round((done / phaseIds.length) * 100);
}
