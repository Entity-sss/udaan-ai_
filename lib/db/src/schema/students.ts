import { pgTable, text, integer, boolean, timestamp, serial, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const studentsTable = pgTable("students", {
  id: text("id").primaryKey(),
  studentId: text("student_id").notNull().unique(),
  name: text("name").notNull(),
  mobile: text("mobile").notNull().unique(),
  email: text("email"),
  avatar: text("avatar"),
  branch: text("branch"),
  semester: integer("semester"),
  college: text("college"),
  assessmentCompleted: boolean("assessment_completed").notNull().default(false),
  skillLevel: text("skill_level").default("beginner"),
  interests: jsonb("interests").$type<string[]>().default([]),
  totalPoints: integer("total_points").default(0),
  streak: integer("streak").default(0),
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const insertStudentSchema = createInsertSchema(studentsTable).omit({ joinedAt: true });
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof studentsTable.$inferSelect;
