import { pgTable, uuid, varchar, timestamp, decimal } from "drizzle-orm/pg-core";
import { users } from "./users.schema";
import { properties } from "./properties.schema";

export const bookings = pgTable("bookings", {
    id: uuid("id").primaryKey().defaultRandom(),
    propertyId: uuid("property_id")
        .references(() => properties.id)
        .notNull(),
    guestId: uuid("guest_id")
        .references(() => users.id)
        .notNull(),
    checkIn: timestamp("check_in").notNull(),
    checkOut: timestamp("check_out").notNull(),
    guests: varchar("guests", { length: 10 }).notNull(),
    totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
    status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, confirmed, cancelled
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
