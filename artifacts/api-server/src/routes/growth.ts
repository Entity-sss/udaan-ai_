import { Router, type IRouter } from "express";
import { randomUUID } from "crypto";
import { groq } from "@workspace/integrations-groq";
import { parseGroqJson } from "../lib/groq-json";
import { devStore } from "../lib/dev-store";

const router: IRouter = Router();

const GROQ_MODEL = process.env.GROQ_MODEL?.trim() || "llama-3.3-70b-versatile";

type StoredQuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
};

function pruneQuizSessions() {
  const map = devStore.quizSessions;
  const cutoff = Date.now() - 2 * 60 * 60 * 1000;
  for (const [id, s] of map) {
    if (s.createdAt < cutoff) map.delete(id);
  }
}

router.post("/growth/quiz/start", async (req, res) => {
  try {
    const groqApiKey = process.env.GROQ_API_KEY?.trim();
    if (!groqApiKey) {
      return res.status(503).json({ error: "GROQ_API_KEY is not configured." });
    }

    const body = req.body as {
      mode: "phase" | "level" | "final";
      skillName: string;
      levelTitle?: string;
      phaseTitle?: string;
      topics?: string[];
      materialSummary?: string;
    };

    if (!body.mode || !body.skillName) {
      return res.status(400).json({ error: "mode and skillName are required" });
    }

    const count =
      body.mode === "phase" ? 5 : body.mode === "level" ? 8 : 10;

    const context =
      body.mode === "phase"
        ? `Phase: ${body.phaseTitle ?? "phase"}. Topics: ${(body.topics ?? []).join(", ") || "general"}. Material focus: ${body.materialSummary ?? "study content"}.`
        : body.mode === "level"
          ? `Level: ${body.levelTitle ?? "level"} for ${body.skillName}. Cover all key ideas from this level.`
          : `Final exam for entire skill "${body.skillName}". Mix beginner→advanced.`;

    const prompt = `You write short multiple-choice quizzes for learners. ${context}
Create exactly ${count} questions. Each must have exactly 4 options (A-D style short phrases).
Return ONLY valid JSON (no markdown) with this shape:
{"questions":[{"id":"q1","question":"...","options":["...","...","...","..."],"correctIndex":0}]}
correctIndex is 0-3 (index into options). Questions should be fair for someone who studied the material. Friendly, clear wording.`;

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      temperature: 0.45,
      max_tokens: 2800,
      messages: [
        { role: "system", content: "Output only valid JSON. No markdown fences." },
        { role: "user", content: prompt },
      ],
    });

    const text = completion.choices[0]?.message?.content ?? "";
    const parsed = parseGroqJson<{ questions: StoredQuizQuestion[] }>(text, { questions: [] });
    let questions = (parsed.questions ?? []).filter(
      q =>
        q &&
        typeof q.question === "string" &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        typeof q.correctIndex === "number" &&
        q.correctIndex >= 0 &&
        q.correctIndex <= 3,
    );

    if (questions.length < Math.min(3, count)) {
      return res.status(500).json({ error: "AI returned too few valid questions. Retry." });
    }

    questions = questions.slice(0, count).map((q, i) => ({
      ...q,
      id: q.id || `q${i + 1}`,
    }));

    pruneQuizSessions();
    const sessionId = randomUUID();
    devStore.quizSessions.set(sessionId, { questions, createdAt: Date.now() });

    const clientQuestions = questions.map(({ correctIndex: _c, ...rest }) => rest);

    return res.json({
      sessionId,
      timeLimitSec: body.mode === "phase" ? 300 : body.mode === "level" ? 480 : 600,
      passPercent: 60,
      questions: clientQuestions,
    });
  } catch (err) {
    req.log.error({ err }, "growth quiz start");
    return res.status(500).json({ error: "Failed to start quiz" });
  }
});

router.post("/growth/quiz/submit", async (req, res) => {
  try {
    const { sessionId, answers } = req.body as {
      sessionId: string;
      answers: { questionId: string; selectedIndex: number }[];
    };

    if (!sessionId || !Array.isArray(answers)) {
      return res.status(400).json({ error: "sessionId and answers required" });
    }

    const session = devStore.quizSessions.get(sessionId);
    if (!session) {
      return res.status(400).json({ error: "Session expired or invalid. Start again." });
    }

    const byId = new Map(session.questions.map(q => [q.id, q]));
    let correct = 0;
    for (const a of answers) {
      const q = byId.get(a.questionId);
      if (!q) continue;
      if (a.selectedIndex === q.correctIndex) correct += 1;
    }

    const total = session.questions.length;
    const scorePercent = total > 0 ? Math.round((correct / total) * 100) : 0;
    const passed = scorePercent >= 60;

    devStore.quizSessions.delete(sessionId);

    return res.json({
      correct,
      total,
      scorePercent,
      passed,
    });
  } catch (err) {
    req.log.error({ err }, "growth quiz submit");
    return res.status(500).json({ error: "Failed to grade quiz" });
  }
});

export default router;
