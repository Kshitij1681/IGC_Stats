import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Bowler from "./models/Bowler.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/ignou_cricket");
    console.log("✅ Connected to MongoDB");

    // Clear existing
    await User.deleteMany({});
    await Bowler.deleteMany({});
    console.log("🗑  Cleared existing data");

    // Create admin
    const admin = await User.create({
      username: process.env.ADMIN_USERNAME || "admin",
      password: process.env.ADMIN_PASSWORD || "admin123",
      role: "admin",
    });

    // Seed bowlers
    const bowlers = [
      {
        name: "Prince Chauhan",
        jerseyNumber: 7,
        role: "Fast",
        homeStats: { matches: 0, overs: 0, wickets: 0, runsConceded: 0, wicketHauls: 0 },
        awayStats: { matches: 0, overs: 0, wickets: 0, runsConceded: 0, wicketHauls: 0 },
      },
      {
        name: "Kshitij Kumar",
        jerseyNumber: 9,
        role: "Fast",
        homeStats: { matches: 0, overs: 0, wickets: 0, runsConceded: 0, wicketHauls: 0 },
        awayStats: { matches: 0, overs: 0, wickets: 0, runsConceded: 0, wicketHauls: 0 },
      },
      {
        name: "Ankit Yadav",
        jerseyNumber: 3,
        role: "Medium",
        homeStats: { matches: 0, overs: 0, wickets: 0, runsConceded: 0, wicketHauls: 0 },
        awayStats: { matches: 0, overs: 0, wickets: 0, runsConceded: 0, wicketHauls: 0 },
      },
      {
        name: "Rawat Dabal Singh",
        jerseyNumber: 13,
        role: "Fast",
        homeStats: { matches: 0, overs: 0, wickets: 0, runsConceded: 0, wicketHauls: 0 },
        awayStats: { matches: 0, overs: 0, wickets: 0, runsConceded: 0, wicketHauls: 0 },
      },
      {
        name: "Nitin Saini",
        jerseyNumber: 11,
        role: "Medium-Fast",
        homeStats: { matches: 0, overs: 0, wickets: 0, runsConceded: 0, wicketHauls: 0 },
        awayStats: { matches: 0, overs: 0, wickets: 0, runsConceded: 0, wicketHauls: 0 },
      },
      {
        name: "Rajesh Kumar",
        jerseyNumber: 21,
        role: "Fast",
        homeStats: { matches: 0, overs: 0, wickets: 0, runsConceded: 0, wicketHauls: 0 },
        awayStats: { matches: 0, overs: 0, wickets: 0, runsConceded: 0, wicketHauls: 0 },
      },
      {
        name: "Shubham Yadav",
        jerseyNumber: 33,
        role: "Medium-Fast",
        homeStats: { matches: 0, overs: 0, wickets: 0, runsConceded: 0, wicketHauls: 0 },
        awayStats: { matches: 0, overs: 0, wickets: 0, runsConceded: 0, wicketHauls: 0 },
      },
      {
        name: "Sourav",
        jerseyNumber: 17,
        role: "Medium-Fast",
        homeStats: { matches: 0, overs: 0, wickets: 0, runsConceded: 0, wicketHauls: 0 },
        awayStats: { matches: 0, overs: 0, wickets: 0, runsConceded: 0, wicketHauls: 0 },
      },
    ];

    await Bowler.insertMany(bowlers);
    console.log(`🏏 ${bowlers.length} bowlers seeded`);

    console.log("\n✨ Database seeded successfully!");
    console.log("─────────────────────────────────────");
    console.log("Admin Login: username=admin | password=admin123");
    console.log("─────────────────────────────────────");
  } catch (err) {
    console.error("❌ Seed error:", err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seedData();
