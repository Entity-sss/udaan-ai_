import { Router } from "express";
import { randomUUID } from "crypto";
import { devStore } from "../lib/dev-store";

const router = Router();

function makeCertCode(): string {
  const part = randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase();
  return `UDN-CERT-${part}`;
}

router.post("/certificates/skill-issue", async (req, res) => {
  try {
    const { studentId, skillId, skillName } = req.body as {
      studentId?: string;
      skillId?: string;
      skillName?: string;
    };

    if (!studentId || !skillId) {
      return res.status(400).json({ error: "studentId and skillId are required" });
    }

    if (!process.env.DATABASE_URL) {
      const certCode = makeCertCode();
      const cert = {
        id: randomUUID(),
        studentId,
        courseId: skillId,
        skillName: skillName ?? skillId,
        certCode,
        issuedAt: new Date(),
      };
      devStore.certificates.push(cert);
      return res.json({ certificate: cert });
    }

    return res.status(501).json({ error: "DB certificate issue not implemented; use dev mode without DATABASE_URL." });
  } catch (err) {
    req.log.error({ err }, "skill-issue cert");
    return res.status(500).json({ error: "Failed to issue certificate" });
  }
});

router.get("/certificates/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    if (!process.env.DATABASE_URL) {
      const certs = devStore.certificates.filter(c => c.studentId === studentId);
      return res.json(certs);
    }

    const { db, certificatesTable } = await import("@workspace/db");
    const { eq } = await import("drizzle-orm");
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
    if (!process.env.DATABASE_URL) {
      const cert = devStore.certificates.find(c => c.certCode === certCode);
      if (!cert) {
        return res.json({ valid: false, message: "Certificate not found or invalid" });
      }
      return res.json({
        valid: true,
        certificate: cert,
        message: "Certificate is authentic and verified by Udaan AI",
      });
    }

    const { db, certificatesTable } = await import("@workspace/db");
    const { eq } = await import("drizzle-orm");
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
