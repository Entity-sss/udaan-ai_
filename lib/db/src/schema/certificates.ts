import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const certificatesTable = pgTable("certificates", {
  id: text("id").primaryKey(),
  certCode: text("cert_code").notNull().unique(),
  studentName: text("student_name").notNull(),
  studentId: text("student_id").notNull(),
  courseName: text("course_name").notNull(),
  courseCategory: text("course_category"),
  grade: text("grade"),
  qrData: text("qr_data").notNull(),
  issuedAt: timestamp("issued_at").defaultNow(),
});

export type Certificate = typeof certificatesTable.$inferSelect;
