import { pgTable, uuid, varchar, timestamp, text, boolean } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const messages = pgTable("messages", {
    id: uuid("id").primaryKey().defaultRandom(),
    senderId: uuid("sender_id")
        .references(() => users.id)
        .notNull(),
    receiverId: uuid("receiver_id")
        .references(() => users.id)
        .notNull(),
    subject: varchar("subject", { length: 255 }),
    content: text("content").notNull(),
    type: varchar("type", { length: 50 }).notNull().default("message"), // message, notification, booking_inquiry
    isRead: boolean("is_read").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
