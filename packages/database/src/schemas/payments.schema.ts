import { pgTable, uuid, varchar, timestamp, decimal, text, jsonb } from "drizzle-orm/pg-core";
import { bookings } from "./bookings.schema";

export const payments = pgTable("payments", {
    id: uuid("id").primaryKey().defaultRandom(),
    bookingId: uuid("booking_id")
        .references(() => bookings.id)
        .notNull(),
    razorpayOrderId: varchar("razorpay_order_id", { length: 255 }),
    razorpayPaymentId: varchar("razorpay_payment_id", { length: 255 }),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("INR"),
    status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, completed, failed, refunded
    paymentMethod: varchar("payment_method", { length: 50 }),
    metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
    failureReason: text("failure_reason"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
