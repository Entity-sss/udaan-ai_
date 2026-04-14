import { Router } from "express";
import { devStore } from "../lib/dev-store";

const router = Router();

router.get("/roadmap/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    if (!process.env.DATABASE_URL) {
      const roadmap = devStore.roadmapsByStudentId.get(studentId);
      if (!roadmap) {
        return res.status(404).json({ error: "No roadmap found. Complete assessment first." });
      }
      return res.json({ ...roadmap, phases: (roadmap as any).phases || [] });
    }

    const { db, roadmapsTable } = await import("@workspace/db");
    const { eq } = await import("drizzle-orm");
    const roadmaps = await db.select().from(roadmapsTable).where(eq(roadmapsTable.studentId, studentId)).limit(1);

    if (roadmaps.length === 0) {
      return res.status(404).json({ error: "No roadmap found. Complete assessment first." });
    }

    const roadmap = roadmaps[0];
    return res.json({ ...roadmap, phases: roadmap.phases || [] });
  } catch (err) {
    req.log.error({ err }, "Get roadmap error");
    return res.status(500).json({ error: "Failed to get roadmap" });
  }
});

export default router;
