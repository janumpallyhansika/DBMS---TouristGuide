import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { testDatabaseConnection } from "./config/db.js";

import stateRoutes from "./routes/stateRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import destinationRoutes from "./routes/destinationRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import savedPlaceRoutes from "./routes/savedPlaceRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// =====================================================
// CORS
// =====================================================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://192.168.31.132:5173",
    ],
    credentials: true,
  })
);

// =====================================================
// BODY PARSERS
// =====================================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// =====================================================
// BASIC ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🌍 Tourist Guide API is running!",
    version: "1.0.0",
  });
});

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/api/health", async (req, res) => {
  res.json({
    success: true,
    message: "Backend is running successfully",
    database: process.env.DB_NAME || "touristguide",
    port: PORT,
  });
});

// =====================================================
// AUTH ROUTES
// =====================================================

app.use("/api/auth", authRoutes);

// =====================================================
// STATE ROUTES
// =====================================================

app.use("/api/states", stateRoutes);

// =====================================================
// DESTINATION ROUTES
// =====================================================

app.use("/api/destinations", destinationRoutes);

// =====================================================
// AI ROUTES
// =====================================================

app.use("/api/ai", aiRoutes);

// =====================================================
// TRIP ROUTES
// =====================================================

app.use("/api/trips", tripRoutes);

// =====================================================
// SAVED PLACES ROUTES
// =====================================================

app.use("/api/saved-places", savedPlaceRoutes);

// =====================================================
// 404 ROUTE
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
  console.error("API Error:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// =====================================================
// START SERVER
// =====================================================

async function startServer() {
  const databaseConnected = await testDatabaseConnection();

  app.listen(PORT, "0.0.0.0", () => {
    console.log("");

    console.log("==========================================");
    console.log("       🌍 TOURIST GUIDE BACKEND");
    console.log("==========================================");

    console.log(
      `🚀 Server: http://localhost:${PORT}`
    );

    console.log(
      `📱 Phone: http://192.168.31.132:${PORT}`
    );

    console.log(
      `🗄️ MySQL: ${
        databaseConnected
          ? "CONNECTED ✅"
          : "NOT CONNECTED ❌"
      }`
    );

    console.log(
      `🔐 Authentication: http://localhost:${PORT}/api/auth`
    );

    console.log(
      `🗺️ States: http://localhost:${PORT}/api/states`
    );

    console.log(
      `📍 Destinations: http://localhost:${PORT}/api/destinations`
    );

    console.log(
      `🤖 AI: http://localhost:${PORT}/api/ai`
    );

    console.log(
      `💬 AI Chat: http://localhost:${PORT}/api/ai/chat`
    );

    console.log(
      `✈️ AI Trip Planner: http://localhost:${PORT}/api/ai/plan-trip`
    );

    console.log(
      `🧳 Trips: http://localhost:${PORT}/api/trips`
    );

    console.log(
      `📋 My Trips: http://localhost:${PORT}/api/trips`
    );

    console.log(
      `❤️ Saved Places: http://localhost:${PORT}/api/saved-places`
    );

    console.log(
      "🗺️ Google Maps: Ready for integration"
    );

    console.log("==========================================");
    console.log("");
  });
}

startServer();