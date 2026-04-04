import { Router } from "express";
import { db } from "@workspace/db";
import { certificatesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/certificates/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const certs = await db.select().from(certificatesTable).where(eq(certificatesTable.studentId, studentId));
    return res.json(certs);
  } catch (err) {
    req.log.error({ err }, "Get certificates error");
    return res.status(500).json({ error: "Failed to get certificates" });
  }
});

router.get("/certificates/verify/:certCode", async (req, res) => {
  try {
    const { certCode } = req.params;
    const certs = await db.select().from(certificatesTable).where(eq(certificatesTable.certCode, certCode)).limit(1);

    if (certs.length === 0) {
      return res.json({ valid: false, message: "Certificate not found or invalid" });
    }

    return res.json({
      valid: true,
      certificate: certs[0],
      message: "Certificate is authentic and verified by Udaan AI",
    });
  } catch (err) {
    req.log.error({ err }, "Verify certificate error");
    return res.status(500).json({ error: "Failed to verify certificate" });
  }
});

export default router;
