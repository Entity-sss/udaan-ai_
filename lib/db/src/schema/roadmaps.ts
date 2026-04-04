import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";

export const roadmapsTable = pgTable("roadmaps", {
  id: text("id").primaryKey(),
  studentId: text("student_id").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  phases: jsonb("phases").$type<any[]>().default([]),
  estimatedDuration: text("estimated_duration"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Roadmap = typeof roadmapsTable.$inferSelect;
