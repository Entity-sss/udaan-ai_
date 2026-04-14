import { Router, type IRouter } from "express";

const router: IRouter = Router();
const GROQ_MODEL = process.env.GROQ_MODEL?.trim() || "llama-3.3-70b-versatile";

// Lazy load groq client to handle initialization errors
let groq: any = null;
function getGroqClient() {
  if (!groq) {
    try {
      const { groq: g } = require("@workspace/integrations-groq");
      groq = g;
    } catch (e) {
      console.log("Groq client not available, using fallback mode");
      return null;
    }
  }
  return groq;
}

router.post("/mock-test/generate", async (req, res) => {
  try {
    const { category, difficulty } = req.body;

    if (!category || !difficulty) {
      return res.status(400).json({ error: "Missing category or difficulty" });
    }

    // Try Groq API first if available
    const groqClient = getGroqClient();
    if (groqClient) {
      try {
        const prompt = `Generate 10 multiple choice questions about ${category} at a ${difficulty} difficulty level.
The questions must be highly relevant for software/tech interviews.
Return raw JSON format as an array of objects.
Each object should have this structure:
{
  "id": "unique-id",
  "question": "The question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct": 0, // index of the correct option (0-3)
  "explanation": "Short explanation of the correct answer"
}
ONLY return the JSON array, no markdown formatting or backticks.`;

        const chatCompletion = await groqClient.chat.completions.create({
          messages: [
            {
              role: "system",
              content: "You are a technical interviewer expert. Always output strictly valid JSON array of objects without markdown formatting.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          model: GROQ_MODEL,
          temperature: 0.5,
        });

        const content = chatCompletion.choices[0]?.message?.content || "[]";
        let questions;
        try {
          questions = JSON.parse(content.replace(/```json/g, "").replace(/```/g, ""));
        } catch (e) {
          console.error("Failed to parse Groq response:", content);
          throw new Error("Failed to parse AI response");
        }

        return res.json(questions);
      } catch (groqError: any) {
        console.log("Groq API failed, using fallback questions:", groqError?.message);
      }
    }

    // Fallback to predefined questions
    const fallbackQuestions = getFallbackQuestions(category, difficulty);
    return res.json(fallbackQuestions);
  } catch (error: any) {
    console.error("Mock test generation error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

function getFallbackQuestions(category: string, difficulty: string) {
  const questionBank: Record<string, Record<string, any[]>> = {
    Python: {
      Easy: [
        {
          id: "py-e1",
          question: "What is the correct file extension for Python files?",
          options: [".py", ".python", ".pt", ".pyth"],
          correct: 0,
          explanation: "Python files use the .py extension."
        },
        {
          id: "py-e2",
          question: "Which keyword is used to define a function in Python?",
          options: ["func", "def", "function", "define"],
          correct: 1,
          explanation: "The 'def' keyword is used to define functions in Python."
        }
      ],
      Medium: [
        {
          id: "py-m1",
          question: "What is the output of list(range(5))?",
          options: ["[0, 1, 2, 3, 4]", "[1, 2, 3, 4, 5]", "[0, 1, 2, 3, 4, 5]", "Error"],
          correct: 0,
          explanation: "range(5) generates numbers from 0 to 4."
        },
        {
          id: "py-m2",
          question: "Which method is used to add an item to the end of a list?",
          options: ["add()", "append()", "insert()", "push()"],
          correct: 1,
          explanation: "The append() method adds items to the end of a list."
        }
      ],
      Hard: [
        {
          id: "py-h1",
          question: "What is the purpose of __init__ in Python classes?",
          options: ["Constructor", "Destructor", "Static method", "Class method"],
          correct: 0,
          explanation: "__init__ is the constructor method in Python classes."
        }
      ]
    },
    JavaScript: {
      Easy: [
        {
          id: "js-e1",
          question: "How do you declare a constant in JavaScript?",
          options: ["var", "let", "const", "constant"],
          correct: 2,
          explanation: "The 'const' keyword declares constants in JavaScript."
        }
      ],
      Medium: [
        {
          id: "js-m1",
          question: "What is the result of typeof null?",
          options: ["null", "undefined", "object", "string"],
          correct: 2,
          explanation: "typeof null returns 'object' - this is a known JavaScript quirk."
        }
      ],
      Hard: [
        {
          id: "js-h1",
          question: "What is closure in JavaScript?",
          options: ["Loop construct", "Function with access to outer scope", "Error handling", "Type declaration"],
          correct: 1,
          explanation: "Closure is a function having access to the outer function's scope."
        }
      ]
    }
  };

  // Get questions for the category and difficulty, or use default questions
  const questions = questionBank[category]?.[difficulty] || [
    {
      id: "default-1",
      question: `What is ${category} primarily used for?`,
      options: ["Web development", "Data analysis", "Mobile development", "All of the above"],
      correct: 3,
      explanation: `${category} has applications across multiple domains.`
    }
  ];

  // Ensure we have at least 10 questions by duplicating if necessary
  while (questions.length < 10) {
    questions.push({
      id: `${category.toLowerCase()}-${difficulty.toLowerCase()}-${questions.length + 1}`,
      question: `Sample question ${questions.length + 1} about ${category}`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correct: Math.floor(Math.random() * 4),
      explanation: "This is a sample question."
    });
  }

  return questions.slice(0, 10);
}

export default router;
