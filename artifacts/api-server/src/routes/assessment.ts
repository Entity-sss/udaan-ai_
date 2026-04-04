import { Router } from "express";
import { db } from "@workspace/db";
import { studentsTable, roadmapsTable, coursesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

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

router.get("/assessment/questions", async (req, res) => {
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

export default router;
