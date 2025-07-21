import { pgTable, uuid, varchar, timestamp, integer, text } from "drizzle-orm/pg-core";
import { users } from "./users.schema";
import { properties } from "./properties.schema";
import { bookings } from "./bookings.schema";

export const reviews = pgTable("reviews", {
    id: uuid("id").primaryKey().defaultRandom(),
    propertyId: uuid("property_id")
        .references(() => properties.id)
        .notNull(),
    bookingId: uuid("booking_id")
        .references(() => bookings.id)
        .notNull(),
    reviewerId: uuid("reviewer_id")
        .references(() => users.id)
        .notNull(),
    rating: integer("rating").notNull(), // 1-5
    title: varchar("title", { length: 255 }),
    comment: text("comment"),
    cleanliness: integer("cleanliness"), // 1-5
    communication: integer("communication"), // 1-5
    checkIn: integer("check_in"), // 1-5
    accuracy: integer("accuracy"), // 1-5
    location: integer("location"), // 1-5
    value: integer("value"), // 1-5
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
