import { Router } from "express";
import { randomUUID } from "crypto";
import { devStore, devUpsertStudent, ensureDevSeedData } from "../lib/dev-store";
import { parseGroqJson } from "../lib/groq-json";

const router = Router();

type ChatMessage = { role: "user" | "assistant"; content: string };
const GROQ_MODEL = process.env.GROQ_MODEL?.trim() || "llama-3.3-70b-versatile";

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

const CONVERSATION_SYSTEM_PROMPT = `You are Udaan AI's mentor for a student growth ecosystem.

You are running a conversational skills/goal assessment. Your job is to ask unlimited adaptive questions (no fixed script) and steadily build an understanding of the student so you can create a personalized roadmap.

You must cover (naturally, in any order):
- The student's goal (e.g. job, internship, placements, research, startup)
- Their field/track (e.g. Web, AI/ML, Data, DevOps, Mobile)
- Their current skill level (beginner/intermediate/advanced; what they've built)
- Their time availability (minutes/hours per day; timeline)
- Extra skills they want to add (DSA, system design, projects, communication, etc.)

Style:
- Casual, friendly, mentor vibe for Indian tech students
- Short, crisp messages; ask 1-2 questions per turn
- When you have enough info, offer a rough roadmap summary and ask what they'd like to tweak
- Always keep it dynamic; follow their answers`;

const DRAFT_EXTRACTOR_SYSTEM_PROMPT = `You extract a roadmap draft from a conversation.

Return ONLY strict JSON with this schema:
{
  "hasEnoughInfo": boolean,
  "profile": {
    "goal": string | null,
    "field": string | null,
    "skillLevel": "beginner" | "intermediate" | "advanced" | null,
    "timePerDayMinutes": number | null,
    "timelineWeeks": number | null,
    "extraSkills": string[],
    "interests": string[]
  },
  "draftSummary": string | null
}

Rules:
- hasEnoughInfo should be true only if goal, field, skillLevel and timePerDayMinutes are reasonably inferred.
- draftSummary is short markdown text with 3-5 bullets + 3 phases.
- interests should be human readable, 1-3 items (e.g. "AI/ML", "Web Development").`;

const assessmentQuestions = [
  {
    id: "q1",
    question: "How would you rate your current programming experience?",
    type: "multiple_choice",
    options: ["Complete beginner", "I know basics (variables, loops)", "I can build simple projects", "I'm comfortable with complex code"],
    category: "experience",
  },
  {
    id: "q2",
    question: "Which programming languages have you worked with?",
    type: "multiple_choice",
    options: ["None yet", "Python", "JavaScript/Web", "Java/C++", "Multiple languages"],
    category: "languages",
  },
  {
    id: "q3",
    question: "What is your primary area of interest in tech?",
    type: "multiple_choice",
    options: ["Artificial Intelligence / Machine Learning", "Web Development", "Data Science / Analytics", "Cloud & DevOps", "Mobile App Development"],
    category: "interest",
  },
  {
    id: "q4",
    question: "Have you studied any Machine Learning concepts?",
    type: "multiple_choice",
    options: ["Not yet, but I'm curious", "I've heard the basics", "I understand supervised/unsupervised learning", "I've built ML models"],
    category: "ml_knowledge",
  },
  {
    id: "q5",
    question: "What is your career goal after graduation?",
    type: "multiple_choice",
    options: ["Software Engineer at a product company", "Data Scientist / ML Engineer", "Start my own startup", "Research / PhD", "I'm exploring options"],
    category: "career",
  },
  {
    id: "q6",
    question: "How much time can you dedicate to learning daily?",
    type: "multiple_choice",
    options: ["Less than 30 minutes", "30 minutes to 1 hour", "1-2 hours", "2+ hours"],
    category: "time",
  },
  {
    id: "q7",
    question: "Which of these concepts are you familiar with?",
    type: "multiple_choice",
    options: ["None of these yet", "Git & Version Control", "Databases & SQL", "APIs & REST", "All of the above"],
    category: "fundamentals",
  },
  {
    id: "q8",
    question: "What kind of projects excite you most?",
    type: "multiple_choice",
    options: ["Building AI chatbots", "Creating websites/apps", "Analyzing data & insights", "Automating tasks", "Building games"],
    category: "projects",
  },
];

function generateRoadmap(skillLevel: string, interests: string[], courses: any[]) {
  const beginnerCourses = courses.filter(c => c.difficulty === "beginner").slice(0, 2);
  const intermediateCourses = courses.filter(c => c.difficulty === "intermediate").slice(0, 2);
  const advancedCourses = courses.filter(c => c.difficulty === "advanced").slice(0, 2);

  return [
    {
      phase: 1,
      title: "Foundation",
      description: "Build strong fundamentals in programming and computer science",
      courses: beginnerCourses,
      status: skillLevel === "beginner" ? "active" : "completed",
      completionPercentage: skillLevel === "beginner" ? 0 : 100,
    },
    {
      phase: 2,
      title: "Core Skills",
      description: "Develop intermediate skills and start specialization",
      courses: intermediateCourses,
      status: skillLevel === "intermediate" ? "active" : skillLevel === "advanced" ? "completed" : "locked",
      completionPercentage: skillLevel === "intermediate" ? 30 : skillLevel === "advanced" ? 100 : 0,
    },
    {
      phase: 3,
      title: "Advanced Mastery",
      description: "Master advanced concepts and build real-world projects",
      courses: advancedCourses,
      status: skillLevel === "advanced" ? "active" : "locked",
      completionPercentage: skillLevel === "advanced" ? 15 : 0,
    },
  ];
}

router.get("/assessment/questions", async (_req, res) => {
  return res.json(assessmentQuestions);
});

router.post("/assessment/submit", async (req, res) => {
  try {
    const { studentId, answers } = req.body;

    let skillLevel = "beginner";
    let interests: string[] = [];

    for (const answer of (answers || [])) {
      const q = assessmentQuestions.find(q => q.id === answer.questionId);
      if (!q) continue;

      if (q.category === "experience") {
        if (answer.answer.includes("complex")) skillLevel = "advanced";
        else if (answer.answer.includes("simple") || answer.answer.includes("multiple")) skillLevel = "intermediate";
      }
      if (q.category === "interest") {
        if (answer.answer.includes("AI") || answer.answer.includes("Machine")) interests.push("AI/ML");
        if (answer.answer.includes("Web")) interests.push("Web Development");
        if (answer.answer.includes("Data")) interests.push("Data Science");
        if (answer.answer.includes("Cloud")) interests.push("DevOps");
        if (answer.answer.includes("Mobile")) interests.push("Mobile Dev");
      }
    }

    if (interests.length === 0) interests = ["AI/ML", "Web Development"];

    if (!process.env.DATABASE_URL) {
      ensureDevSeedData();
      devUpsertStudent(studentId, { assessmentCompleted: true, skillLevel, interests });

      const allCourses = devStore.courses;
      const phases = generateRoadmap(skillLevel, interests, allCourses);

      const existing = devStore.roadmapsByStudentId.get(studentId);
      const roadmap = existing
        ? {
            ...existing,
            title: `Your ${skillLevel.charAt(0).toUpperCase() + skillLevel.slice(1)} Tech Journey`,
            phases,
          }
        : {
            id: randomUUID(),
            studentId,
            title: `Your ${skillLevel.charAt(0).toUpperCase() + skillLevel.slice(1)} Tech Journey`,
            description: `Personalized roadmap based on your skills and interests in ${interests.join(", ")}`,
            phases,
            estimatedDuration: skillLevel === "beginner" ? "12 months" : skillLevel === "intermediate" ? "8 months" : "6 months",
            createdAt: new Date(),
          };

      devStore.roadmapsByStudentId.set(studentId, roadmap as any);

      return res.json({
        skillLevel,
        interests,
        roadmap: { ...roadmap, phases: (roadmap as any).phases || [] },
        summary: `Based on your responses, you're a ${skillLevel}-level learner with interests in ${interests.join(" and ")}. Your personalized roadmap has been created with ${phases.length} phases to guide your tech journey.`,
      });
    }

    const { db, studentsTable, roadmapsTable, coursesTable } = await import("@workspace/db");
    const { eq } = await import("drizzle-orm");

    await db.update(studentsTable).set({
      assessmentCompleted: true,
      skillLevel,
      interests,
    }).where(eq(studentsTable.id, studentId));

    const allCourses = await db.select().from(coursesTable);
    const phases = generateRoadmap(skillLevel, interests, allCourses);

    const existingRoadmap = await db.select().from(roadmapsTable).where(eq(roadmapsTable.studentId, studentId)).limit(1);
    let roadmap;
    if (existingRoadmap.length > 0) {
      const [updated] = await db.update(roadmapsTable).set({ phases, title: `Your ${skillLevel.charAt(0).toUpperCase() + skillLevel.slice(1)} Tech Journey` }).where(eq(roadmapsTable.studentId, studentId)).returning();
      roadmap = updated;
    } else {
      const [created] = await db.insert(roadmapsTable).values({
        id: randomUUID(),
        studentId,
        title: `Your ${skillLevel.charAt(0).toUpperCase() + skillLevel.slice(1)} Tech Journey`,
        description: `Personalized roadmap based on your skills and interests in ${interests.join(", ")}`,
        phases,
        estimatedDuration: skillLevel === "beginner" ? "12 months" : skillLevel === "intermediate" ? "8 months" : "6 months",
      }).returning();
      roadmap = created;
    }

    return res.json({
      skillLevel,
      interests,
      roadmap: { ...roadmap, phases: roadmap.phases || [] },
      summary: `Based on your responses, you're a ${skillLevel}-level learner with interests in ${interests.join(" and ")}. Your personalized roadmap has been created with ${phases.length} phases to guide your tech journey.`,
    });
  } catch (err) {
    req.log.error({ err }, "Submit assessment error");
    return res.status(500).json({ error: "Assessment submission failed" });
  }
});

router.post("/assessment/chat", async (req, res) => {
  try {
    const { messages, context } = req.body as {
      messages: ChatMessage[];
      context?: { studentName?: string };
    };

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    const groqApiKey = process.env.GROQ_API_KEY?.trim();
    if (!groqApiKey) {
      return res.status(503).json({
        error: "Groq is not configured. Add GROQ_API_KEY in .env and restart the API server.",
      });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");

    const { groq } = await import("@workspace/integrations-groq");

    const system = `${CONVERSATION_SYSTEM_PROMPT}${context?.studentName ? `\nStudent name: ${context.studentName}` : ""}`;

    const stream = await groq.chat.completions.create({
      model: GROQ_MODEL,
      max_tokens: 2048,
      stream: true,
      messages: [
        { role: "system", content: system },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
    });

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content;
      if (text) {
        res.write(`data: ${JSON.stringify({ type: "content", content: text })}\n\n`);
      }
    }

    // After the main reply is done, try to compute a draft summary & profile extraction.
    try {
      const extraction = await groq.chat.completions.create({
        model: GROQ_MODEL,
        max_tokens: 800,
        stream: false,
        messages: [
          { role: "system", content: DRAFT_EXTRACTOR_SYSTEM_PROMPT },
          {
            role: "user",
            content: `Conversation:\n${messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n")}\n\nExtract now.`,
          },
        ],
      });

      const text = (extraction.choices[0]?.message?.content ?? "").trim();
      const draft = JSON.parse(text);
      res.write(`data: ${JSON.stringify({ type: "draft", draft })}\n\n`);
    } catch (err) {
      req.log.warn({ err }, "Draft extraction failed");
    }

    res.write(`data: ${JSON.stringify({ type: "done", done: true })}\n\n`);
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
      "Assessment chat error",
    );
    if (!res.headersSent) {
      return res.status(500).json({ error: "Assessment chat failed" });
    }
    res.write(`data: ${JSON.stringify({ type: "done", done: true, error: "Stream error" })}\n\n`);
    res.end();
    return;
  }
});

const DYNAMIC_ASSESSMENT_SYSTEM = `You are Udaan AI's friendly assessment mentor. 
Your ONLY job is to deeply understand the student 
through conversation and collect enough information 
to build them a perfect personalised learning roadmap.

HOW YOU WORK:
- Ask ONE question at a time
- Each question MUST follow logically from ALL 
  previous answers
- Questions get more specific and deeper each time
- You decide when you have enough information
- Only set isLastQuestion to true when you are 
  100% confident you can build a perfect roadmap
- Never rush - ask as many questions as needed
- Never ask irrelevant questions
- Never repeat a question already asked

TONE:
- Casual and friendly like a mentor friend
- Short questions - max 1 sentence
- Never formal or robotic

WHAT YOU NEED TO FIND OUT:
- Their main goal (job/freelance/business/upskill)
- Their specific field or role
- Their specific skills they want to learn
- Their current level with those skills
- What they ultimately want to achieve
- Any additional skills they want alongside

QUESTION LOGIC:
Start broad then get specific:
Round 1 → Understand their goal
Round 2 → Understand their field/domain
Round 3 → Understand specific skills needed
Round 4 → Understand their current level
Round 5+ → Dig deeper into specifics until confident

Keep asking until you could answer this:
'I know exactly what this person needs to learn 
and in what order to achieve their goal'

Only THEN set isLastQuestion to true.

OPTIONS RULES:
- Always give 4-5 clickable options
- Options must be specific to their answers
- Always include an 'Other' or custom option
- Options should feel natural not robotic

RESPOND IN PURE JSON ONLY - no markdown, no extra text:
{
  "question": "your question here",
  "options": ["option1", "option2", "option3", "option4"],
  "isLastQuestion": false,
  "questionNumber": 3
}

When you are confident enough to build the roadmap:
{
  "question": "Want to add any specific skills?",
  "options": [],
  "isLastQuestion": true,
  "questionNumber": 7
}`;

router.post("/assessment/dynamic-turn", async (req, res) => {
  try {
    const groqApiKey = process.env.GROQ_API_KEY?.trim();
    if (!groqApiKey) {
      return res.status(503).json({ error: "Groq is not configured. Add GROQ_API_KEY in .env." });
    }

    const { history } = req.body as { history: { question: string; answer: string }[] };
    if (!history || !Array.isArray(history) || history.length === 0) {
      return res.status(400).json({ error: "history is required" });
    }

    const { groq } = await import("@workspace/integrations-groq");

    const transcript = history
      .map((h, i) => `Q${i + 1}: ${h.question}\nA${i + 1}: ${h.answer}`)
      .join("\n\n");

    const userPrompt = `Transcript so far:\n${transcript}\n\nN (Q&A pairs) = ${history.length}.\nReturn the JSON decision.`;

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      temperature: 0.35,
      max_tokens: 1200,
      messages: [
        { role: "system", content: DYNAMIC_ASSESSMENT_SYSTEM },
        { role: "user", content: userPrompt },
      ],
    });

    const text = completion.choices[0]?.message?.content ?? "";
    type Turn = {
      complete: boolean;
      question: string | null;
      options: string[];
      draft: any;
    };

    let parsed = parseGroqJson<Turn>(text, {
      complete: false,
      question: "What specific skills or technologies interest you?",
      options: ["Programming", "Design", "Marketing", "Data Analytics", "Other"],
      draft: null,
    });

    const n = history.length;
    // Limits removed - AI decides completion via isLastQuestion/complete


    if (parsed.complete && (!parsed.draft || typeof parsed.draft !== "object")) {
      const completion2 = await groq.chat.completions.create({
        model: GROQ_MODEL,
        temperature: 0.2,
        max_tokens: 900,
        messages: [
          {
            role: "system",
            content:
              "Extract roadmap draft from transcript. Output ONLY JSON: {\"hasEnoughInfo\":true,\"profile\":{\"goal\":...,\"field\":...,\"skillLevel\":\"beginner\"|\"intermediate\"|\"advanced\",\"timePerDayMinutes\":number,\"timelineWeeks\":number,\"extraSkills\":[],\"interests\":[]},\"draftSummary\":\"* line\\n* line\"}",
          },
          { role: "user", content: transcript },
        ],
      });
      const t2 = completion2.choices[0]?.message?.content ?? "";
      parsed.draft = parseGroqJson(t2, parsed.draft);
    }

    return res.json({
      complete: parsed.complete,
      question: parsed.question,
      options: Array.isArray(parsed.options) ? parsed.options : [],
      draft: parsed.draft,
      questionNumber: (parsed as any).questionNumber || n + 1,
    });
  } catch (err) {
    req.log.error({ err }, "dynamic-turn");
    return res.status(500).json({ error: "Failed to generate next question" });
  }
});

const NEXT_QUESTION_SYSTEM = `You are Udaan AI's friendly assessment mentor.
Your ONLY job is to deeply understand the student
through conversation and collect enough information
to build them a perfect personalised learning roadmap.

HOW YOU WORK:
- Ask ONE question at a time
- Each question MUST follow logically from ALL
  previous answers
- Questions get more specific and deeper each time
- You decide when you have enough information
- Only set isLastQuestion to true when you are
  100% confident you can build a perfect roadmap
- Never rush - ask as many questions as needed
- Never ask irrelevant questions
- Never repeat a question already asked

TONE:
- Casual and friendly like a mentor friend
- Short questions - max 1 sentence
- Never formal or robotic

WHAT YOU NEED TO FIND OUT:
- Their main goal (job/freelance/business/upskill)
- Their specific field or role
- Their specific skills they want to learn
- Their current level with those skills
- What they ultimately want to achieve
- Any additional skills they want alongside

QUESTION LOGIC:
Start broad then get specific:
Round 1 → Understand their goal
Round 2 → Understand their field/domain
Round 3 → Understand specific skills needed
Round 4 → Understand their current level
Round 5+ → Dig deeper into specifics until confident

Keep asking until you could answer this:
'I know exactly what this person needs to learn
and in what order to achieve their goal'

Only THEN set isLastQuestion to true.

OPTIONS RULES:
- Always give 4-5 clickable options
- Options must be specific to their answers
- Always include an 'Other' or custom option
- Options should feel natural not robotic

RESPOND IN PURE JSON ONLY - no markdown, no extra text:
{
  'question': 'your question here',
  'options': ['option1', 'option2', 'option3', 'option4'],
  'isLastQuestion': false,
  'questionNumber': 3
}

When you are confident enough to build the roadmap:
{
  'question': 'Want to add any specific skills?',
  'options': [],
  'isLastQuestion': true,
  'questionNumber': 7
}`;

router.post("/assessment/next-question", async (req, res) => {
  try {
    const groqApiKey = process.env.GROQ_API_KEY?.trim();
    if (!groqApiKey) {
      return res.status(503).json({ error: "Groq is not configured. Add GROQ_API_KEY in .env." });
    }

    const { conversationHistory, currentAnswer } = req.body as { 
      conversationHistory: { question: string; answer: string }[];
      currentAnswer: string;
    };
    
    if (!conversationHistory || !Array.isArray(conversationHistory)) {
      return res.status(400).json({ error: "conversationHistory is required" });
    }

    const { groq } = await import("@workspace/integrations-groq");

    const transcript = conversationHistory
      .map((h, i) => `Q${i + 1}: ${h.question}\nA${i + 1}: ${h.answer}`)
      .join("\n\n");

    const payload = `Transcript so far:\n${transcript}\n\nLatest User Answer: "${currentAnswer}"\n\nGenerate the next question.`;

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      temperature: 0.35,
      max_tokens: 800,
      messages: [
        { role: "system", content: NEXT_QUESTION_SYSTEM },
        { role: "user", content: payload },
      ],
    });

    const text = completion.choices[0]?.message?.content ?? "";
    const n = conversationHistory.length + 1;
    
    let parsed = parseGroqJson(text, {
      question: "Could you tell me a bit more about your background?",
      options: ["I'm a beginner", "I have some experience", "I'm advanced", "Other"],
      isLastQuestion: false,
      questionNumber: n + 1
    });

    parsed.questionNumber = parsed.questionNumber || n + 1;

    
    return res.json(parsed);
  } catch (err) {
    req.log.error({ err }, "next-question");
    return res.status(500).json({ error: "Failed to generate next question" });
  }
});

router.post("/assessment/extract-draft", async (req, res) => {
  try {
    const groqApiKey = process.env.GROQ_API_KEY?.trim();
    if (!groqApiKey) {
      return res.status(503).json({ error: "Groq is not configured. Add GROQ_API_KEY in .env." });
    }

    const { conversationHistory } = req.body as { 
      conversationHistory: { question: string; answer: string }[];
    };
    
    if (!conversationHistory || !Array.isArray(conversationHistory)) {
      return res.status(400).json({ error: "conversationHistory is required" });
    }

    const { groq } = await import("@workspace/integrations-groq");

    const transcript = conversationHistory
      .map((h, i) => `Q${i + 1}: ${h.question}\nA${i + 1}: ${h.answer}`)
      .join("\n\n");

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      temperature: 0.2,
      max_tokens: 900,
      messages: [
        {
          role: "system",
          content:
            "Extract roadmap draft from transcript. Output ONLY JSON: {\"hasEnoughInfo\":true,\"profile\":{\"goal\":...,\"field\":...,\"skillLevel\":\"beginner\"|\"intermediate\"|\"advanced\",\"timePerDayMinutes\":number,\"timelineWeeks\":number,\"extraSkills\":[],\"interests\":[]},\"draftSummary\":\"* line\\n* line\"}",
        },
        { role: "user", content: transcript },
      ],
    });

    const text = completion.choices[0]?.message?.content ?? "";
    const draft = parseGroqJson(text, {
      hasEnoughInfo: true,
      profile: {
        goal: "Learning Tech",
        field: "General Tech",
        skillLevel: "beginner",
        timePerDayMinutes: 60,
        timelineWeeks: 12,
        extraSkills: [],
        interests: []
      },
      draftSummary: "* Fundamentals\n* Projects\n* Interview Prep",
    });

    return res.json({ draft });
  } catch (err) {
    req.log.error({ err }, "extract-draft");
    return res.status(500).json({ error: "Failed to extract draft" });
  }
});

const REFINE_SYSTEM = `You adjust a student's learning roadmap based on their chat message.

Return ONLY JSON:
{
  "profile": {
    "goal": string | null,
    "field": string | null,
    "skillLevel": "beginner" | "intermediate" | "advanced" | null,
    "timePerDayMinutes": number | null,
    "timelineWeeks": number | null,
    "extraSkills": string[],
    "interests": string[]
  },
  "draftSummary": string | null,
  "assistantMessage": string
}

Rules:
- If they ask to add/remove skills, update interests and extraSkills accordingly.
- Keep arrays deduped, human-readable skill names (e.g. "Python", "Excel").
- assistantMessage: one short casual reply (max 2 sentences).
- draftSummary: 3-5 lines with "* " bullets reflecting the updated plan.`;

router.post("/assessment/refine-roadmap", async (req, res) => {
  try {
    const groqApiKey = process.env.GROQ_API_KEY?.trim();
    if (!groqApiKey) {
      return res.status(503).json({ error: "Groq is not configured. Add GROQ_API_KEY in .env." });
    }

    const { profile, draftSummary, message } = req.body as {
      profile?: Record<string, unknown>;
      draftSummary?: string | null;
      message?: string;
    };

    if (!message?.trim()) {
      return res.status(400).json({ error: "message is required" });
    }

    const { groq } = await import("@workspace/integrations-groq");

    const payload = `Current profile JSON:\n${JSON.stringify(profile ?? {})}\n\nCurrent draft summary:\n${draftSummary ?? ""}\n\nStudent message:\n${message}`;

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      temperature: 0.3,
      max_tokens: 900,
      messages: [
        { role: "system", content: REFINE_SYSTEM },
        { role: "user", content: payload },
      ],
    });

    const text = completion.choices[0]?.message?.content ?? "";
    const refined = parseGroqJson<{
      profile: Record<string, unknown>;
      draftSummary: string | null;
      assistantMessage: string;
    }>(text, {
      profile: (profile ?? {}) as Record<string, unknown>,
      draftSummary: draftSummary ?? null,
      assistantMessage: "On it — I tweaked your roadmap.",
    });

    return res.json(refined);
  } catch (err) {
    req.log.error({ err }, "refine-roadmap");
    return res.status(500).json({ error: "Failed to refine roadmap" });
  }
});

router.post("/assessment/confirm", async (req, res) => {
  try {
    const { studentId, profile } = req.body as {
      studentId: string;
      profile?: {
        skillLevel?: "beginner" | "intermediate" | "advanced" | null;
        interests?: string[];
        goal?: string | null;
        field?: string | null;
        timePerDayMinutes?: number | null;
        timelineWeeks?: number | null;
        extraSkills?: string[];
      };
    };

    if (!studentId) return res.status(400).json({ error: "studentId is required" });

    const skillLevel = profile?.skillLevel ?? "beginner";
    const interests = (profile?.interests && profile.interests.length > 0) ? profile.interests : ["AI/ML", "Web Development"];

    if (!process.env.DATABASE_URL) {
      ensureDevSeedData();
      devUpsertStudent(studentId, { assessmentCompleted: true, skillLevel, interests });
      const phases = generateRoadmap(skillLevel, interests, devStore.courses);
      const roadmap = {
        id: randomUUID(),
        studentId,
        title: `Your ${skillLevel.charAt(0).toUpperCase() + skillLevel.slice(1)} Tech Journey`,
        description: `Personalized roadmap based on your goals in ${profile?.field ?? "tech"} and interests in ${interests.join(", ")}`,
        phases,
        estimatedDuration: skillLevel === "beginner" ? "12 months" : skillLevel === "intermediate" ? "8 months" : "6 months",
        createdAt: new Date(),
      };
      devStore.roadmapsByStudentId.set(studentId, roadmap as any);
      return res.json({ roadmap: { ...roadmap, phases }, skillLevel, interests });
    }

    const { db, studentsTable, roadmapsTable, coursesTable } = await import("@workspace/db");
    const { eq } = await import("drizzle-orm");

    await db.update(studentsTable).set({
      assessmentCompleted: true,
      skillLevel,
      interests,
    }).where(eq(studentsTable.id, studentId));

    const allCourses = await db.select().from(coursesTable);
    const phases = generateRoadmap(skillLevel, interests, allCourses);

    const existingRoadmap = await db.select().from(roadmapsTable).where(eq(roadmapsTable.studentId, studentId)).limit(1);
    const title = `Your ${skillLevel.charAt(0).toUpperCase() + skillLevel.slice(1)} Tech Journey`;
    const description = `Personalized roadmap based on your goals in ${profile?.field ?? "tech"} and interests in ${interests.join(", ")}`;
    let roadmap;

    if (existingRoadmap.length > 0) {
      const [updated] = await db.update(roadmapsTable).set({ phases, title, description }).where(eq(roadmapsTable.studentId, studentId)).returning();
      roadmap = updated;
    } else {
      const [created] = await db.insert(roadmapsTable).values({
        id: randomUUID(),
        studentId,
        title,
        description,
        phases,
        estimatedDuration: skillLevel === "beginner" ? "12 months" : skillLevel === "intermediate" ? "8 months" : "6 months",
      }).returning();
      roadmap = created;
    }

    return res.json({ roadmap: { ...roadmap, phases: roadmap.phases || [] }, skillLevel, interests });
  } catch (err) {
    req.log.error({ err }, "Assessment confirm error");
    return res.status(500).json({ error: "Assessment confirm failed" });
  }
});

export default router;
