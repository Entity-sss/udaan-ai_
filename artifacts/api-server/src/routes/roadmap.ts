import { Router } from "express";
import { db } from "@workspace/db";
import { roadmapsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/roadmap/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
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
