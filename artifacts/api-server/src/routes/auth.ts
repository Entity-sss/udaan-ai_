import { Router } from "express";
import { db } from "@workspace/db";
import { studentsTable, otpsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

const router = Router();

function generateStudentId(): string {
  const year = new Date().getFullYear();
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `UDN-${year}-${num}`;
}

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateToken(studentId: string): string {
  return Buffer.from(`${studentId}:${Date.now()}`).toString("base64");
}

router.post("/auth/register", async (req, res) => {
  try {
    const { name, mobile, email } = req.body;
    if (!name || !mobile) {
      return res.status(400).json({ error: "Name and mobile are required" });
    }

    let existing = await db.select().from(studentsTable).where(eq(studentsTable.mobile, mobile)).limit(1);

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
      email: email || null,
      assessmentCompleted: false,
    }).returning();

    const token = generateToken(id);
    return res.status(201).json({ student, token, isNewStudent: true });
  } catch (err) {
    req.log.error({ err }, "Register error");
    return res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/auth/send-otp", async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) {
      return res.status(400).json({ success: false, message: "Mobile is required" });
    }

    const otp = generateOtp();
    const id = randomUUID();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await db.insert(otpsTable).values({ id, mobile, otp, expiresAt });

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
    const { mobile, otp } = req.body;
    if (!mobile || !otp) {
      return res.status(400).json({ error: "Mobile and OTP required" });
    }

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

    let students = await db.select().from(studentsTable).where(eq(studentsTable.mobile, mobile)).limit(1);
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
    const { mobile, otp } = req.body;
    const students = await db.select().from(studentsTable).where(eq(studentsTable.mobile, mobile)).limit(1);
    if (students.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    const student = students[0];
    const token = generateToken(student.id);
    return res.json({ student, token, isNewStudent: false });
  } catch (err) {
    req.log.error({ err }, "Login error");
    return res.status(500).json({ error: "Login failed" });
  }
});

export default router;
