import { Router, type IRouter } from "express";
import { groq } from "@workspace/integrations-groq";

const router: IRouter = Router();

router.post("/resume/enhance", async (req, res) => {
  try {
    const { text, type } = req.body;

    if (!text || !type) {
      return res.status(400).json({ error: "Missing text or type" });
    }

    const typePrompts: Record<string, string> = {
      summary: "Enhance this professional summary for a tech resume. Make it impactful, action-oriented, and highlight a passion for learning and technology. Keep it under 4 sentences.",
      experience: "Enhance these work experience bullet points for a tech resume. Use strong action verbs resulting in measurable impact if possible. Keep them as bullet points starting with •. Do not add made up metrics, just improve the phrasing.",
      projects: "Enhance this technical project description for a resume. Make it concise, highlight the problem solved, and emphasize the technical stack used.",
    };

    const instruction = typePrompts[type] || "Enhance this resume text to sound more professional and impactful.";

    const prompt = `${instruction}\n\nOriginal Text:\n${text}\n\nReturn ONLY the enhanced text. Do not include markdown formatting, quotes, or conversational filler.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "system", content: "You are an expert resume writer for software engineers." }, { role: "user", content: prompt }],
      model: "llama3-8b-8192",
      temperature: 0.5,
    });

    const content = chatCompletion.choices[0]?.message?.content?.trim() || text;

    return res.json({ enhancedText: content });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
