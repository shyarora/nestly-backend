import { pgTable, uuid, text, integer, decimal, boolean, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    password: text("password"),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    phoneNumber: text("phone"),
    bio: text("bio"),
    avatar: text("avatar_url"),
    isHost: boolean("is_host").default(false).notNull(),
    isVerified: boolean("is_verified").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Properties table
export const properties = pgTable("properties", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    hostId: uuid("host_id")
        .notNull()
        .references(() => users.id),
    propertyType: text("property_type").notNull(),
    roomType: text("room_type").notNull(),
    maxGuests: integer("max_guests").notNull(),
    bedrooms: integer("bedrooms").notNull(),
    bathrooms: integer("bathrooms").notNull(),
    pricePerNight: decimal("price_per_night", { precision: 10, scale: 2 }).notNull(),
    cleaningFee: decimal("cleaning_fee", { precision: 10, scale: 2 }),
    serviceFee: decimal("service_fee", { precision: 10, scale: 2 }),
    minimumStay: integer("minimum_stay").default(1),
    maximumStay: integer("maximum_stay").default(30),
    city: text("city").notNull(),
    state: text("state").notNull(),
    country: text("country").notNull(),
    address: text("address"),
    latitude: decimal("latitude", { precision: 10, scale: 8 }),
    longitude: decimal("longitude", { precision: 11, scale: 8 }),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Property Images table
export const propertyImages = pgTable("property_images", {
    id: uuid("id").primaryKey().defaultRandom(),
    propertyId: uuid("property_id")
        .notNull()
        .references(() => properties.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    altText: text("alt_text"),
    caption: text("caption"),
    isPrimary: boolean("is_primary").default(false).notNull(),
    order: integer("order").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Amenities table
export const amenities = pgTable("amenities", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    icon: text("icon"),
    category: text("category"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Property Amenities junction table
export const propertyAmenities = pgTable(
    "property_amenities",
    {
        propertyId: uuid("property_id")
            .notNull()
            .references(() => properties.id, { onDelete: "cascade" }),
        amenityId: uuid("amenity_id")
            .notNull()
            .references(() => amenities.id, { onDelete: "cascade" }),
    },
    table => ({
        pk: primaryKey({ columns: [table.propertyId, table.amenityId] }),
    }),
);

// Bookings table
export const bookings = pgTable("bookings", {
    id: uuid("id").primaryKey().defaultRandom(),
    propertyId: uuid("property_id")
        .notNull()
        .references(() => properties.id),
    guestId: uuid("guest_id")
        .notNull()
        .references(() => users.id),
    checkIn: timestamp("check_in", { mode: "date" }).notNull(),
    checkOut: timestamp("check_out", { mode: "date" }).notNull(),
    guests: integer("guests").notNull(),
    totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
    status: text("status").default("pending").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Reviews table
export const reviews = pgTable("reviews", {
    id: uuid("id").primaryKey().defaultRandom(),
    bookingId: uuid("booking_id")
        .notNull()
        .unique()
        .references(() => bookings.id),
    propertyId: uuid("property_id")
        .notNull()
        .references(() => properties.id),
    reviewerId: uuid("reviewer_id")
        .notNull()
        .references(() => users.id),
    hostId: uuid("host_id").notNull(),
    rating: integer("rating").notNull(),
    comment: text("comment"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Messages table
export const messages = pgTable("messages", {
    id: uuid("id").primaryKey().defaultRandom(),
    senderId: uuid("sender_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    recipientId: uuid("recipient_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    bookingId: uuid("booking_id").references(() => bookings.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    isRead: boolean("is_read").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Favorites table
export const favorites = pgTable("favorites", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    propertyId: uuid("property_id")
        .notNull()
        .references(() => properties.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
    hostedProperties: many(properties),
    bookings: many(bookings),
    reviews: many(reviews),
    sentMessages: many(messages, { relationName: "sentMessages" }),
    receivedMessages: many(messages, { relationName: "receivedMessages" }),
    favorites: many(favorites),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
    host: one(users, {
        fields: [properties.hostId],
        references: [users.id],
    }),
    bookings: many(bookings),
    reviews: many(reviews),
    images: many(propertyImages),
    amenities: many(propertyAmenities),
    favorites: many(favorites),
}));

export const propertyImagesRelations = relations(propertyImages, ({ one }) => ({
    property: one(properties, {
        fields: [propertyImages.propertyId],
        references: [properties.id],
    }),
}));

export const amenitiesRelations = relations(amenities, ({ many }) => ({
    properties: many(propertyAmenities),
}));

export const propertyAmenitiesRelations = relations(propertyAmenities, ({ one }) => ({
    property: one(properties, {
        fields: [propertyAmenities.propertyId],
        references: [properties.id],
    }),
    amenity: one(amenities, {
        fields: [propertyAmenities.amenityId],
        references: [amenities.id],
    }),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
    property: one(properties, {
        fields: [bookings.propertyId],
        references: [properties.id],
    }),
    guest: one(users, {
        fields: [bookings.guestId],
        references: [users.id],
    }),
    review: one(reviews),
    messages: many(messages),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
    booking: one(bookings, {
        fields: [reviews.bookingId],
        references: [bookings.id],
    }),
    property: one(properties, {
        fields: [reviews.propertyId],
        references: [properties.id],
    }),
    reviewer: one(users, {
        fields: [reviews.reviewerId],
        references: [users.id],
    }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
    sender: one(users, {
        fields: [messages.senderId],
        references: [users.id],
        relationName: "sentMessages",
    }),
    recipient: one(users, {
        fields: [messages.recipientId],
        references: [users.id],
        relationName: "receivedMessages",
    }),
    booking: one(bookings, {
        fields: [messages.bookingId],
        references: [bookings.id],
    }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
    user: one(users, {
        fields: [favorites.userId],
        references: [users.id],
    }),
    property: one(properties, {
        fields: [favorites.propertyId],
        references: [properties.id],
    }),
}));
