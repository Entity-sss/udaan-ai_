import { Router, type IRouter } from "express";
import { groq } from "@workspace/integrations-groq";

const router: IRouter = Router();

router.post("/mock-interview/generate", async (req, res) => {
  try {
    const { role, level } = req.body;

    if (!role || !level) {
      return res.status(400).json({ error: "Missing role or level" });
    }

    const prompt = `Generate exactly 5 technical interview questions for a ${level} ${role}.
Output format: raw JSON array of objects.
Each object: { "id": "q1", "question": "The question", "hint": "A short hint", "sampleAnswer": "A good model answer", "category": "Core tech category" }
ONLY return JSON.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "system", content: "You are an expert technical interviewer. Output valid JSON array only." }, { role: "user", content: prompt }],
      model: "llama3-70b-8192",
      temperature: 0.6,
    });

    const content = chatCompletion.choices[0]?.message?.content || "[]";
    let questions;
    try {
      questions = JSON.parse(content.replace(/```json/g, "").replace(/```/g, ""));
    } catch {
      return res.status(500).json({ error: "Failed to parse questions" });
    }
    
    return res.json(questions);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/mock-interview/evaluate", async (req, res) => {
  try {
    const { question, answer } = req.body;
    
    if (!question || !answer) {
      return res.status(400).json({ error: "Missing question or answer" });
    }

    const prompt = `Evaluate the candidate's answer to this technical question:
Question: ${question}
Answer: ${answer}

Return a raw JSON object: { "feedback": "Brief feedback on what was good or missing", "score": number between 0 and 10 }
ONLY return JSON.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "system", content: "You are an expert technical interviewer. Output valid JSON object only." }, { role: "user", content: prompt }],
      model: "llama3-8b-8192",
      temperature: 0.3,
    });

    const content = chatCompletion.choices[0]?.message?.content || "{}";
    let evaluation;
    try {
      evaluation = JSON.parse(content.replace(/```json/g, "").replace(/```/g, ""));
    } catch {
      evaluation = { feedback: "No feedback available", score: 5 };
    }

    return res.json(evaluation);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
