import { Router } from "express";
import { devStore, ensureDevSeedData } from "../lib/dev-store";

const router = Router();

router.get("/courses", async (req, res) => {
  try {
    if (!process.env.DATABASE_URL) {
      ensureDevSeedData();
      return res.json(devStore.courses);
    }

    const { db, coursesTable } = await import("@workspace/db");
    const courses = await db.select().from(coursesTable);
    return res.json(courses);
  } catch (err) {
    req.log.error({ err }, "Get courses error");
    return res.status(500).json({ error: "Failed to get courses" });
  }
});

router.get("/courses/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!process.env.DATABASE_URL) {
      ensureDevSeedData();
      const course = devStore.courses.find(c => c.id === courseId);
      if (!course) return res.status(404).json({ error: "Course not found" });

      const lectures = devStore.lectures.filter(l => l.courseId === courseId).sort((a, b) => a.order - b.order);
      const notes = devStore.notes.filter(n => n.courseId === courseId);

      const progressChart = Array.from({ length: 8 }, (_, i) => ({
        week: `Week ${i + 1}`,
        percentage: Math.min(100, i * 14 + Math.floor(Math.random() * 5)),
      }));

      return res.json({
        course,
        lectures: lectures.map(l => ({ ...l, isCompleted: false })),
        notes,
        progressChart,
      });
    }

    const { db, coursesTable, lecturesTable, notesTable } = await import("@workspace/db");
    const { eq } = await import("drizzle-orm");
    const courses = await db.select().from(coursesTable).where(eq(coursesTable.id, courseId)).limit(1);
    if (courses.length === 0) return res.status(404).json({ error: "Course not found" });

    const lectures = await db.select().from(lecturesTable).where(eq(lecturesTable.courseId, courseId)).orderBy(lecturesTable.order);
    const notes = await db.select().from(notesTable).where(eq(notesTable.courseId, courseId));

    const progressChart = Array.from({ length: 8 }, (_, i) => ({
      week: `Week ${i + 1}`,
      percentage: Math.min(100, i * 14 + Math.floor(Math.random() * 5)),
    }));

    return res.json({
      course: courses[0],
      lectures: lectures.map(l => ({ ...l, isCompleted: false })),
      notes,
      progressChart,
    });
  } catch (err) {
    req.log.error({ err }, "Get course error");
    return res.status(500).json({ error: "Failed to get course" });
  }
});

router.get("/library", async (req, res) => {
  try {
    if (!process.env.DATABASE_URL) {
      ensureDevSeedData();
      const courseMap = Object.fromEntries(devStore.courses.map(c => [c.id, c]));
      const library = devStore.notes.map(note => ({
        ...note,
        courseName: courseMap[note.courseId]?.title || "Unknown Course",
        courseCategory: courseMap[note.courseId]?.category || "General",
        courseDifficulty: courseMap[note.courseId]?.difficulty || "beginner",
      }));
      return res.json(library);
    }

    const { db, notesTable, coursesTable } = await import("@workspace/db");
    const allNotes = await db.select().from(notesTable);
    const allCourses = await db.select().from(coursesTable);
    const courseMap = Object.fromEntries(allCourses.map(c => [c.id, c]));
    const library = allNotes.map(note => ({
      ...note,
      courseName: courseMap[note.courseId]?.title || "Unknown Course",
      courseCategory: courseMap[note.courseId]?.category || "General",
      courseDifficulty: courseMap[note.courseId]?.difficulty || "beginner",
    }));
    return res.json(library);
  } catch (err) {
    req.log.error({ err }, "Get library error");
    return res.status(500).json({ error: "Failed to get library" });
  }
});

export default router;
