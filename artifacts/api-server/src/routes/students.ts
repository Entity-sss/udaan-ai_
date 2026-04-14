import { Router } from "express";
import { devGetStudent, devStore, devUpsertStudent, ensureDevSeedData } from "../lib/dev-store";

const router = Router();

router.get("/students/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    if (!process.env.DATABASE_URL) {
      const student = devGetStudent(studentId);
      if (!student) return res.status(404).json({ error: "Student not found" });
      return res.json(student);
    }

    const { db, studentsTable } = await import("@workspace/db");
    const { eq } = await import("drizzle-orm");
    const students = await db.select().from(studentsTable).where(eq(studentsTable.id, studentId)).limit(1);
    if (students.length === 0) return res.status(404).json({ error: "Student not found" });
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

    if (!process.env.DATABASE_URL) {
      const updated = devUpsertStudent(studentId, {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(branch !== undefined && { branch }),
        ...(semester !== undefined && { semester }),
        ...(college !== undefined && { college }),
        ...(avatar !== undefined && { avatar }),
      });
      if (!updated) return res.status(404).json({ error: "Student not found" });
      return res.json(updated);
    }

    const { db, studentsTable } = await import("@workspace/db");
    const { eq } = await import("drizzle-orm");
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
    if (!process.env.DATABASE_URL) {
      ensureDevSeedData();
      const student = devGetStudent(studentId);
      if (!student) return res.status(404).json({ error: "Student not found" });

      const progress = devStore.progress.filter(p => p.studentId === studentId);
      const completedLectures = progress.filter(p => p.completed).length;
      const allCourses = devStore.courses;
      const certificates = devStore.certificates.filter(c => c.studentId === studentId);

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
      const isFresh =
        completedLectures === 0 &&
        coursesEnrolled === 0 &&
        (student.totalPoints == null || student.totalPoints === 0) &&
        (student.streak == null || student.streak === 0);

      const weeklyProgressData = days.map(day => ({
        day,
        hours: isFresh ? 0 : Math.random() * 3,
        lectures: isFresh ? 0 : Math.floor(Math.random() * 4),
      }));

      const interestSkills = (student.interests ?? []).filter(Boolean);
      const skillDistribution =
        interestSkills.length > 0
          ? interestSkills.slice(0, 6).map((skill, i) => ({
              skill,
              level: isFresh ? 5 + (i % 3) * 5 : 40 + (i * 7) % 40,
              color: "#4c35c8",
            }))
          : [
              { skill: "Python", level: isFresh ? 5 : 70, color: "#4c35c8" },
              { skill: "ML/AI", level: isFresh ? 5 : 55, color: "#4c35c8" },
              { skill: "Web Dev", level: isFresh ? 5 : 65, color: "#4c35c8" },
            ];

      const recentActivity = isFresh
        ? []
        : [
            { type: "lecture", description: "Completed lecture: Intro to Neural Networks", timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), points: 10 },
            { type: "quiz", description: "Passed assessment with 85% score", timestamp: new Date(Date.now() - 24 * 3600000).toISOString(), points: 50 },
            { type: "course", description: "Started Python Foundations course", timestamp: new Date(Date.now() - 48 * 3600000).toISOString(), points: 5 },
          ];

      return res.json({
        student,
        coursesEnrolled,
        coursesCompleted,
        totalLecturesWatched: completedLectures,
        overallProgress: Math.round(overallProgress),
        streak: student.streak ?? 0,
        totalPoints: student.totalPoints ?? 0,
        certificates: certificates.length,
        recentActivity,
        weeklyProgressData,
        skillDistribution,
      });
    }

    const { db, studentsTable, studentProgressTable, coursesTable, certificatesTable } = await import("@workspace/db");
    const { eq } = await import("drizzle-orm");
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

    const streak = student.streak ?? 0;
    const totalPoints = student.totalPoints ?? 0;
    const isNewUser =
      completedLectures === 0 &&
      coursesEnrolled === 0 &&
      totalPoints === 0 &&
      streak === 0;

    const weeklyProgressDataDb = days.map(day => ({
      day,
      hours: isNewUser ? 0 : Math.random() * 3,
      lectures: isNewUser ? 0 : Math.floor(Math.random() * 4),
    }));

    const interestSkillsDb = (student.interests ?? []).filter(Boolean);
    const skillDistributionDb =
      interestSkillsDb.length > 0
        ? interestSkillsDb.slice(0, 6).map((skill, i) => ({
            skill,
            level: isNewUser ? 5 + (i % 3) * 5 : 40 + (i * 7) % 40,
            color: "#4c35c8",
          }))
        : [
            { skill: "Python", level: isNewUser ? 5 : 70, color: "#4c35c8" },
            { skill: "ML/AI", level: isNewUser ? 5 : 55, color: "#4c35c8" },
            { skill: "Web Dev", level: isNewUser ? 5 : 65, color: "#4c35c8" },
          ];

    const recentActivityDb = isNewUser
      ? []
      : [
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
      streak,
      totalPoints,
      certificates: certificates.length,
      recentActivity: recentActivityDb,
      weeklyProgressData: weeklyProgressDataDb,
      skillDistribution: skillDistributionDb,
    });
  } catch (err) {
    req.log.error({ err }, "Dashboard error");
    return res.status(500).json({ error: "Failed to get dashboard" });
  }
});

export default router;
