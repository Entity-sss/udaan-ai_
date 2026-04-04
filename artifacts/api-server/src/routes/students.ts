import { Router } from "express";
import { db } from "@workspace/db";
import { studentsTable, studentProgressTable, coursesTable, certificatesTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";

const router = Router();

router.get("/students/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const students = await db.select().from(studentsTable).where(eq(studentsTable.id, studentId)).limit(1);
    if (students.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    return res.json(students[0]);
  } catch (err) {
    req.log.error({ err }, "Get student error");
    return res.status(500).json({ error: "Failed to get student" });
  }
});

router.patch("/students/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const { name, email, branch, semester, college, avatar } = req.body;

    const [updated] = await db.update(studentsTable).set({
      ...(name !== undefined && { name }),
      ...(email !== undefined && { email }),
      ...(branch !== undefined && { branch }),
      ...(semester !== undefined && { semester }),
      ...(college !== undefined && { college }),
      ...(avatar !== undefined && { avatar }),
    }).where(eq(studentsTable.id, studentId)).returning();

    if (!updated) return res.status(404).json({ error: "Student not found" });
    return res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Update student error");
    return res.status(500).json({ error: "Failed to update student" });
  }
});

router.get("/students/:studentId/dashboard", async (req, res) => {
  try {
    const { studentId } = req.params;
    const students = await db.select().from(studentsTable).where(eq(studentsTable.id, studentId)).limit(1);
    if (students.length === 0) return res.status(404).json({ error: "Student not found" });
    const student = students[0];

    const progress = await db.select().from(studentProgressTable).where(eq(studentProgressTable.studentId, studentId));
    const completedLectures = progress.filter(p => p.completed).length;
    const allCourses = await db.select().from(coursesTable);
    const certificates = await db.select().from(certificatesTable).where(eq(certificatesTable.studentId, studentId));

    const coursesWithProgress = allCourses.map(course => {
      const courseProgress = progress.filter(p => p.courseId === course.id);
      const completed = courseProgress.filter(p => p.completed).length;
      return { courseId: course.id, completed, total: course.totalLectures };
    });

    const coursesEnrolled = coursesWithProgress.filter(c => c.completed > 0).length;
    const coursesCompleted = coursesWithProgress.filter(c => c.total > 0 && c.completed >= c.total).length;
    const overallProgress = allCourses.length > 0
      ? coursesWithProgress.reduce((acc, c) => acc + (c.total > 0 ? c.completed / c.total : 0), 0) / allCourses.length * 100
      : 0;

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weeklyProgressData = days.map(day => ({
      day,
      hours: Math.random() * 3,
      lectures: Math.floor(Math.random() * 4),
    }));

    const skillDistribution = [
      { skill: "Python", level: 70, color: "#7c3aed" },
      { skill: "ML/AI", level: 55, color: "#9333ea" },
      { skill: "Web Dev", level: 65, color: "#f59e0b" },
      { skill: "DSA", level: 45, color: "#06b6d4" },
      { skill: "DevOps", level: 30, color: "#10b981" },
    ];

    const recentActivity = [
      { type: "lecture", description: "Completed lecture: Intro to Neural Networks", timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), points: 10 },
      { type: "quiz", description: "Passed assessment with 85% score", timestamp: new Date(Date.now() - 24 * 3600000).toISOString(), points: 50 },
      { type: "course", description: "Started Python for ML course", timestamp: new Date(Date.now() - 48 * 3600000).toISOString(), points: 5 },
    ];

    return res.json({
      student,
      coursesEnrolled,
      coursesCompleted,
      totalLecturesWatched: completedLectures,
      overallProgress: Math.round(overallProgress),
      streak: student.streak || 5,
      totalPoints: student.totalPoints || 350,
      certificates: certificates.length,
      recentActivity,
      weeklyProgressData,
      skillDistribution,
    });
  } catch (err) {
    req.log.error({ err }, "Dashboard error");
    return res.status(500).json({ error: "Failed to get dashboard" });
  }
});

export default router;
