import dotenv from "dotenv";
import { db } from "../db";
import { users, properties, amenities, propertyAmenities } from "../db/schema";
import bcrypt from "bcryptjs";

// Load environment variables
dotenv.config();

async function seed() {
    try {
        console.log("🌱 Seeding database...");

        // Create users
        const hashedPassword = await bcrypt.hash("password123", 12);

        const newUsers = await db
            .insert(users)
            .values([
                {
                    email: "john@example.com",
                    password: hashedPassword,
                    firstName: "John",
                    lastName: "Doe",
                    isHost: true,
                    isVerified: true,
                },
                {
                    email: "jane@example.com",
                    password: hashedPassword,
                    firstName: "Jane",
                    lastName: "Smith",
                    isHost: false,
                    isVerified: true,
                },
            ])
            .returning();

        console.log(`✅ Created ${newUsers.length} users`);

        // Create amenities
        const newAmenities = await db
            .insert(amenities)
            .values([
                { name: "WiFi", icon: "wifi", category: "connectivity" },
                { name: "Air Conditioning", icon: "snowflake", category: "comfort" },
                { name: "Kitchen", icon: "chef-hat", category: "facilities" },
                { name: "Parking", icon: "car", category: "convenience" },
            ])
            .returning();

        console.log(`✅ Created ${newAmenities.length} amenities`);

        // Create properties
        const hostUser = newUsers.find(u => u.isHost);
        if (hostUser) {
            const newProperties = await db
                .insert(properties)
                .values([
                    {
                        title: "Beautiful Apartment in Downtown",
                        description: "A lovely apartment with great city views",
                        hostId: hostUser.id,
                        propertyType: "apartment",
                        roomType: "entire_place",
                        maxGuests: 4,
                        bedrooms: 2,
                        bathrooms: 1,
                        pricePerNight: "120.00",
                        city: "San Francisco",
                        state: "CA",
                        country: "USA",
                        latitude: "37.7749",
                        longitude: "-122.4194",
                    },
                ])
                .returning();

            console.log(`✅ Created ${newProperties.length} properties`);

            // Link amenities to property
            const property = newProperties[0];
            const wifiAmenity = newAmenities.find(a => a.name === "WiFi");
            const acAmenity = newAmenities.find(a => a.name === "Air Conditioning");

            if (wifiAmenity && acAmenity) {
                await db.insert(propertyAmenities).values([
                    { propertyId: property.id, amenityId: wifiAmenity.id },
                    { propertyId: property.id, amenityId: acAmenity.id },
                ]);
                console.log("✅ Linked amenities to property");
            }
        }

        console.log("🎉 Database seeded successfully!");
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

seed();
