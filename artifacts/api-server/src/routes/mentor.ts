import { Router } from "express";

const router = Router();
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

function toLoggableError(err: unknown) {
  if (!err || typeof err !== "object") return { message: String(err) };
  const anyErr = err as any;
  return {
    name: anyErr.name,
    message: anyErr.message,
    status: anyErr.status,
    code: anyErr.code ?? anyErr.error?.error?.code,
    type: anyErr.type ?? anyErr.error?.error?.type,
    apiMessage: anyErr.error?.error?.message,
  };
}

interface MentorMessage {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `You are an expert AI Mentor for Udaan AI, a student growth ecosystem for Indian tech students. Your role is to:

1. Help students understand the skills assessment questions they're currently answering
2. Explain tech concepts clearly and concisely in a beginner-friendly way
3. Motivate students and guide them toward the right career paths
4. Give practical, actionable advice for Indian tech students (keeping in mind the local job market, popular platforms like GeeksforGeeks, LeetCode, Coursera, etc.)
5. Answer questions about programming languages (Python, JavaScript, etc.), ML/AI, Web Development, Data Structures, and career guidance

Tone: Encouraging, clear, and friendly. Use simple language. Keep responses concise (2-4 paragraphs max). When relevant, suggest what the student should focus on next.

Context: The student is currently taking a skills assessment that will personalize their learning roadmap. Questions cover experience level, programming languages, interests, career goals, and technical fundamentals.

Always end with a motivating sentence and the Udaan AI tagline "Turn your now into your next." when wrapping up a topic.`;

router.post("/mentor", async (req, res) => {
  try {
    const groqApiKey = process.env.GROQ_API_KEY?.trim();
    if (!groqApiKey) {
      return res.status(503).json({
        error: "Mentor AI is not configured. Set GROQ_API_KEY in .env to enable it.",
      });
    }

    const { messages, context } = req.body as {
      messages: MentorMessage[];
      context?: { currentQuestion?: string; studentName?: string };
    };

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    const systemWithContext = context?.currentQuestion
      ? `${SYSTEM_PROMPT}\n\nCurrent assessment question the student is viewing: "${context.currentQuestion}"${context.studentName ? `\nStudent name: ${context.studentName}` : ""}`
      : SYSTEM_PROMPT;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");

    const { groq } = await import("@workspace/integrations-groq");

    const stream = await groq.chat.completions.create({
      model: GROQ_MODEL,
      max_tokens: 8192,
      stream: true,
      messages: [
        { role: "system", content: systemWithContext },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
    });

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content;
      if (text) {
        res.write(`data: ${JSON.stringify({ content: text })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
    return;
  } catch (err) {
    req.log.error(
      {
        err,
        errorDetails: toLoggableError(err),
        groqModel: GROQ_MODEL,
        hasGroqApiKey: Boolean(process.env.GROQ_API_KEY?.trim()),
      },
      "Mentor AI error",
    );
    if (!res.headersSent) {
      return res.status(500).json({ error: "Mentor AI failed" });
    }
    res.write(`data: ${JSON.stringify({ error: "Stream error", done: true })}\n\n`);
    res.end();
    return;
  }
});

export default router;
