import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const otpsTable = pgTable("otps", {
  id: text("id").primaryKey(),
  mobile: text("mobile").notNull(),
  otp: text("otp").notNull(),
  used: boolean("used").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
});

export type Otp = typeof otpsTable.$inferSelect;
