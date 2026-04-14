export type GrowthQuizMode = "phase" | "level" | "final";

export function buildGrowthQuizUrl(params: {
  mode: GrowthQuizMode;
  skillId: string;
  skillName: string;
  levelId?: string;
  levelTitle?: string;
  phaseId?: string;
  phaseTitle?: string;
  topics?: string[];
}): string {
  const q = new URLSearchParams();
  q.set("mode", params.mode);
  q.set("skillId", params.skillId);
  q.set("skillName", params.skillName);
  if (params.levelId) q.set("levelId", params.levelId);
  if (params.levelTitle) q.set("levelTitle", params.levelTitle);
  if (params.phaseId) q.set("phaseId", params.phaseId);
  if (params.phaseTitle) q.set("phaseTitle", params.phaseTitle);
  if (params.topics?.length) q.set("topics", params.topics.join("|||"));
  return `/mock-test/run?${q.toString()}`;
}
