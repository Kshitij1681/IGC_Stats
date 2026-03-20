import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import bowlerRoutes from "./routes/bowlers.js";
import adminRoutes from "./routes/admin.js";
import bowlerOfWeekRoutes from "./routes/bowlerOfWeek.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [process.env.CLIENT_URL, "http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  }),
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bowlers", bowlerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bowler-of-week", bowlerOfWeekRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "IGNOU Cricket Club API Running" });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/ignou_cricket")
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

export default app;
