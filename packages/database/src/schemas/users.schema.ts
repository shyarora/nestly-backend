import { pgTable, uuid, varchar, text, timestamp, integer, decimal, boolean, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    googleId: varchar("google_id", { length: 255 }).unique(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    avatar: text("avatar"),
    phone: varchar("phone", { length: 20 }),
    roles: jsonb("roles").$type<string[]>().default(["user"]),
    isEmailVerified: boolean("is_email_verified").default(false),
    isPhoneVerified: boolean("is_phone_verified").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
