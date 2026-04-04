import { pgTable, text, integer, real, boolean, timestamp } from "drizzle-orm/pg-core";

export const studentProgressTable = pgTable("student_progress", {
  id: text("id").primaryKey(),
  studentId: text("student_id").notNull(),
  courseId: text("course_id").notNull(),
  lectureId: text("lecture_id").notNull(),
  completed: boolean("completed").notNull().default(false),
  progress: real("progress").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type StudentProgress = typeof studentProgressTable.$inferSelect;
