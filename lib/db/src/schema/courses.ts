import { pgTable, text, integer, real, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const coursesTable = pgTable("courses", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(),
  duration: text("duration"),
  totalLectures: integer("total_lectures").notNull().default(0),
  thumbnail: text("thumbnail"),
  instructor: text("instructor"),
  rating: real("rating").default(4.5),
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCourseSchema = createInsertSchema(coursesTable).omit({ createdAt: true });
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof coursesTable.$inferSelect;

export const lecturesTable = pgTable("lectures", {
  id: text("id").primaryKey(),
  courseId: text("course_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  duration: text("duration").notNull(),
  order: integer("order").notNull(),
  videoUrl: text("video_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Lecture = typeof lecturesTable.$inferSelect;

export const notesTable = pgTable("notes", {
  id: text("id").primaryKey(),
  courseId: text("course_id").notNull(),
  lectureId: text("lecture_id"),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Note = typeof notesTable.$inferSelect;
