import { Router } from "express";
import { db } from "@workspace/db";
import { studentProgressTable, coursesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

router.get("/progress/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const progress = await db.select().from(studentProgressTable).where(eq(studentProgressTable.studentId, studentId));
    const allCourses = await db.select().from(coursesTable);

    const courseProgress = allCourses.map(course => {
      const courseP = progress.filter(p => p.courseId === course.id);
      const completed = courseP.filter(p => p.completed).length;
      const total = course.totalLectures || 1;
      const lastAccessed = courseP.sort((a, b) => new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime())[0];
      return {
        courseId: course.id,
        courseName: course.title,
        progress: Math.round((completed / total) * 100),
        completedLectures: completed,
        totalLectures: total,
        lastAccessedAt: lastAccessed?.updatedAt?.toISOString(),
      };
    }).filter(c => c.completedLectures > 0 || Math.random() > 0.5);

    const overallProgress = courseProgress.length > 0
      ? Math.round(courseProgress.reduce((sum, c) => sum + c.progress, 0) / courseProgress.length)
      : 0;

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const monthlyData = months.map((month, i) => ({
      month,
      hoursStudied: Math.round((2 + i * 0.5 + Math.random()) * 10) / 10,
      lecturesCompleted: Math.floor(3 + i * 2 + Math.random() * 3),
    }));

    return res.json({ overallProgress, courseProgress, monthlyData });
  } catch (err) {
    req.log.error({ err }, "Get progress error");
    return res.status(500).json({ error: "Failed to get progress" });
  }
});

router.patch("/progress/:studentId/course/:courseId", async (req, res) => {
  try {
    const { studentId, courseId } = req.params;
    const { lectureId, completed, progress } = req.body;

    const existing = await db.select().from(studentProgressTable)
      .where(and(
        eq(studentProgressTable.studentId, studentId),
        eq(studentProgressTable.courseId, courseId),
        eq(studentProgressTable.lectureId, lectureId),
      )).limit(1);

    let result;
    if (existing.length > 0) {
      const [updated] = await db.update(studentProgressTable).set({
        completed: completed ?? existing[0].completed,
        progress: progress ?? existing[0].progress,
        updatedAt: new Date(),
      }).where(eq(studentProgressTable.id, existing[0].id)).returning();
      result = updated;
    } else {
      const [created] = await db.insert(studentProgressTable).values({
        id: randomUUID(),
        studentId,
        courseId,
        lectureId,
        completed: completed ?? false,
        progress: progress ?? 0,
      }).returning();
      result = created;
    }

    const allProgress = await db.select().from(studentProgressTable)
      .where(and(eq(studentProgressTable.studentId, studentId), eq(studentProgressTable.courseId, courseId)));
    const completedCount = allProgress.filter(p => p.completed).length;
    const courses = await db.select().from(coursesTable).where(eq(coursesTable.id, courseId)).limit(1);
    const total = courses[0]?.totalLectures || 1;

    return res.json({
      courseId,
      courseName: courses[0]?.title || "Course",
      progress: Math.round((completedCount / total) * 100),
      completedLectures: completedCount,
      totalLectures: total,
    });
  } catch (err) {
    req.log.error({ err }, "Update progress error");
    return res.status(500).json({ error: "Failed to update progress" });
  }
});

export default router;
