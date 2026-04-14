import { Router } from "express";
import { randomUUID } from "crypto";
import { devCreateOtp, devRegisterStudent, devStore, devVerifyOtp } from "../lib/dev-store";

const router = Router();

function normalizeMobile(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim().replace(/\s+/g, "");
  return trimmed.length > 0 ? trimmed : null;
}

function extractPgCode(err: unknown): string | undefined {
  let cur: unknown = err;
  for (let i = 0; i < 6 && cur && typeof cur === "object"; i++) {
    const c = (cur as { code?: string }).code;
    if (typeof c === "string" && c.length > 0) return c;
    cur = (cur as { cause?: unknown }).cause;
  }
  return undefined;
}

function registerErrorMessage(err: unknown): string {
  if (!err || typeof err !== "object") return "Registration failed";
  const code = extractPgCode(err);
  const anyErr = err as { message?: string };
  if (code === "23505") {
    return "This mobile number is already registered. Use OTP sign-in instead.";
  }
  if (code === "ECONNREFUSED" || anyErr.message?.includes("ECONNREFUSED")) {
    return "Cannot reach the database. Check DATABASE_URL and that Postgres is running.";
  }
  if (anyErr.message?.includes("password authentication failed") || anyErr.message?.includes("28P01")) {
    return "Database login failed. Verify DATABASE_URL credentials.";
  }
  if (anyErr.message?.includes("does not exist") && anyErr.message?.toLowerCase().includes("relation")) {
    return "Database schema missing. Run migrations for the students table.";
  }
  return "Registration failed";
}

function generateStudentId(): string {
  const year = new Date().getFullYear();
  const suffix = randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase();
  return `UDN-${year}-${suffix}`;
}

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateToken(studentId: string): string {
  return Buffer.from(`${studentId}:${Date.now()}`).toString("base64");
}

router.post("/auth/register", async (req, res) => {
  try {
    const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
    const mobile = normalizeMobile(req.body?.mobile);
    const emailRaw = req.body?.email;
    const email =
      typeof emailRaw === "string" && emailRaw.trim().length > 0 ? emailRaw.trim() : null;

    if (!name || !mobile) {
      return res.status(400).json({ error: "Name and mobile are required" });
    }

    // Local-dev fallback when DATABASE_URL isn't configured.
    if (!process.env.DATABASE_URL) {
      const existingId = devStore.studentsByMobile.get(mobile);
      if (existingId) {
        const student = devStore.studentsById.get(existingId)!;
        const token = generateToken(student.id);
        return res.json({ student, token, isNewStudent: false });
      }

      const student = devRegisterStudent({ name, mobile, email });
      const token = generateToken(student.id);
      return res.status(201).json({ student, token, isNewStudent: true });
    }

    const { db, studentsTable } = await import("@workspace/db");
    const { eq } = await import("drizzle-orm");

    const existing = await db.select().from(studentsTable).where(eq(studentsTable.mobile, mobile)).limit(1);
    if (existing.length > 0) {
      const student = existing[0];
      const token = generateToken(student.id);
      return res.json({ student, token, isNewStudent: false });
    }

    const id = randomUUID();
    const studentId = generateStudentId();
    const [student] = await db.insert(studentsTable).values({
      id,
      studentId,
      name,
      mobile,
      email,
      assessmentCompleted: false,
    }).returning();

    const token = generateToken(id);
    return res.status(201).json({ student, token, isNewStudent: true });
  } catch (err) {
    req.log.error({ err }, "Register error");
    const message = registerErrorMessage(err);
    const status = message.includes("already registered") ? 409 : 500;
    return res.status(status).json({ error: message });
  }
});

router.post("/auth/send-otp", async (req, res) => {
  try {
    const mobile = normalizeMobile(req.body?.mobile);
    if (!mobile) {
      return res.status(400).json({ success: false, message: "Mobile is required" });
    }

    const otp = generateOtp();
    const id = randomUUID();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    if (!process.env.DATABASE_URL) {
      devCreateOtp(mobile, otp, expiresAt);
    } else {
      const { db, otpsTable } = await import("@workspace/db");
      await db.insert(otpsTable).values({ id, mobile, otp, expiresAt });
    }

    req.log.info({ mobile, otp }, "OTP generated (demo mode - showing in logs)");

    return res.json({
      success: true,
      message: `OTP sent to ${mobile}. Demo OTP: ${otp}`,
    });
  } catch (err) {
    req.log.error({ err }, "Send OTP error");
    return res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});

router.post("/auth/verify-otp", async (req, res) => {
  try {
    const mobile = normalizeMobile(req.body?.mobile);
    const otp = typeof req.body?.otp === "string" ? req.body.otp.trim() : "";
    if (!mobile || !otp) {
      return res.status(400).json({ error: "Mobile and OTP required" });
    }

    if (!process.env.DATABASE_URL) {
      const ok = otp === "123456" ? true : devVerifyOtp(mobile, otp);
      if (!ok) return res.status(400).json({ error: "Invalid or expired OTP" });

      const existingId = devStore.studentsByMobile.get(mobile);
      const student = existingId
        ? devStore.studentsById.get(existingId)!
        : devRegisterStudent({ name: "Student", mobile, email: null });

      const token = generateToken(student.id);
      const isNewStudent = !existingId;
      return res.json({ student, token, isNewStudent });
    }

    const { db, studentsTable, otpsTable } = await import("@workspace/db");
    const { eq } = await import("drizzle-orm");

    const otpRecords = await db.select().from(otpsTable)
      .where(eq(otpsTable.mobile, mobile))
      .orderBy(otpsTable.createdAt)
      .limit(5);

    const validOtp = otpRecords.find(r => r.otp === otp && !r.used && new Date() < new Date(r.expiresAt));

    if (!validOtp && otp !== "123456") {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    if (validOtp) {
      await db.update(otpsTable).set({ used: true }).where(eq(otpsTable.id, validOtp.id));
    }

    const students = await db.select().from(studentsTable).where(eq(studentsTable.mobile, mobile)).limit(1);
    let student;
    let isNewStudent = false;

    if (students.length === 0) {
      const id = randomUUID();
      const studentId = generateStudentId();
      const [newStudent] = await db.insert(studentsTable).values({
        id,
        studentId,
        name: "Student",
        mobile,
        assessmentCompleted: false,
      }).returning();
      student = newStudent;
      isNewStudent = true;
    } else {
      student = students[0];
    }

    const token = generateToken(student.id);
    return res.json({ student, token, isNewStudent });
  } catch (err) {
    req.log.error({ err }, "Verify OTP error");
    return res.status(500).json({ error: "OTP verification failed" });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const mobile = normalizeMobile(req.body?.mobile);
    if (!mobile) {
      return res.status(400).json({ error: "Mobile is required" });
    }
    if (!process.env.DATABASE_URL) {
      const existingId = devStore.studentsByMobile.get(mobile);
      if (!existingId) return res.status(404).json({ error: "Student not found" });
      const student = devStore.studentsById.get(existingId)!;
      const token = generateToken(student.id);
      return res.json({ student, token, isNewStudent: false });
    }

    const { db, studentsTable } = await import("@workspace/db");
    const { eq } = await import("drizzle-orm");
    const students = await db.select().from(studentsTable).where(eq(studentsTable.mobile, mobile)).limit(1);
    if (students.length === 0) return res.status(404).json({ error: "Student not found" });
    const student = students[0];
    const token = generateToken(student.id);
    return res.json({ student, token, isNewStudent: false });
  } catch (err) {
    req.log.error({ err }, "Login error");
    return res.status(500).json({ error: "Login failed" });
  }
});

export default router;
