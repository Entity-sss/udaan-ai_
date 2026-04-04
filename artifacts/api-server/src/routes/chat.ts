import { Router } from "express";

const router = Router();

const responses: Record<string, string[]> = {
  python: [
    "Python is a great choice for ML! Start with basics: variables, loops, functions, then move to NumPy and Pandas.",
    "For Python in data science, I recommend: Python basics -> NumPy -> Pandas -> Matplotlib -> Scikit-learn.",
  ],
  ml: [
    "Machine Learning journey: Math foundations (Linear Algebra, Stats) -> Python -> Scikit-learn -> Deep Learning with TensorFlow/PyTorch.",
    "Start ML with supervised learning: linear regression, decision trees. Then explore neural networks!",
  ],
  roadmap: [
    "Your personalized roadmap is based on your assessment. Check the Roadmap page to see your learning phases and recommended courses!",
    "Complete each phase in order. Don't rush - mastery matters more than speed.",
  ],
  course: [
    "Each course has video lectures, notes, and quizzes. Complete at least 80% of lectures to earn your certificate!",
    "Focus on one course at a time for better retention. Your roadmap shows the best sequence.",
  ],
  default: [
    "That's a great question! Focus on your current roadmap phase. Consistent daily practice is the key to mastering tech skills.",
    "I'm here to help guide your learning journey. What specific topic would you like to explore?",
    "Keep going! Every expert was once a beginner. Your Udaan AI roadmap is designed specifically for your growth.",
    "Tech learning is a marathon, not a sprint. Focus on understanding concepts deeply, not just finishing courses.",
  ],
};

function getResponse(message: string): { reply: string; suggestions: string[] } {
  const lower = message.toLowerCase();
  let replyPool = responses.default;

  if (lower.includes("python")) replyPool = responses.python;
  else if (lower.includes("ml") || lower.includes("machine learning") || lower.includes("ai")) replyPool = responses.ml;
  else if (lower.includes("roadmap") || lower.includes("path") || lower.includes("plan")) replyPool = responses.roadmap;
  else if (lower.includes("course") || lower.includes("lecture") || lower.includes("learn")) replyPool = responses.course;

  const reply = replyPool[Math.floor(Math.random() * replyPool.length)];

  const suggestions = [
    "How do I start with Python?",
    "What is Machine Learning?",
    "Show my roadmap progress",
    "Best resources for AI?",
  ];

  return { reply, suggestions };
}

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    await new Promise(resolve => setTimeout(resolve, 500));
    const response = getResponse(message);
    return res.json(response);
  } catch (err) {
    req.log.error({ err }, "Chat error");
    return res.status(500).json({ error: "Chat failed" });
  }
});

export default router;
