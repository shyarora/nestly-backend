import { pgTable, uuid, varchar, text, timestamp, decimal, boolean, jsonb, integer } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const properties = pgTable("properties", {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: uuid("owner_id")
        .references(() => users.id)
        .notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    type: varchar("type", { length: 50 }).notNull(), // apartment, house, room, etc.
    address: text("address").notNull(),
    city: varchar("city", { length: 100 }).notNull(),
    state: varchar("state", { length: 100 }).notNull(),
    country: varchar("country", { length: 100 }).notNull(),
    zipCode: varchar("zip_code", { length: 20 }).notNull(),
    latitude: decimal("latitude", { precision: 10, scale: 8 }),
    longitude: decimal("longitude", { precision: 11, scale: 8 }),
    pricePerNight: decimal("price_per_night", { precision: 10, scale: 2 }).notNull(),
    maxGuests: integer("max_guests").notNull(),
    bedrooms: integer("bedrooms").notNull(),
    bathrooms: integer("bathrooms").notNull(),
    amenities: jsonb("amenities").$type<string[]>().default([]),
    images: jsonb("images").$type<string[]>().default([]),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;
