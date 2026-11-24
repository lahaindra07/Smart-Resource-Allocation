import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import { authRouter } from "./routes/auth.ts";
import { needsRouter } from "./routes/needs.ts";
import { volunteersRouter } from "./routes/volunteers.ts";
import { matchesRouter } from "./routes/matches.ts";
import { aiRouter } from "./routes/ai.ts";
import { SEED_NEEDS, SEED_VOLUNTEERS } from "./data/seedData.ts";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3001;

  app.use(express.json());

  // CORS Middleware for Local & Preview Development
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-User-Email");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // Healthcheck
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      region: "India",
      model: process.env.NEMOTRON_MODEL || "nvidia/nemotron-3-ultra-550b-a55b:free",
      timestamp: new Date().toISOString()
    });
  });

  // Global Platform Statistics
  app.get("/api/stats", (req, res) => {
    res.json({
      success: true,
      data: {
        activeNeeds: SEED_NEEDS.filter(n => n.status === "OPEN").length,
        totalVolunteers: 18450,
        partnerNGOs: 640,
        resolutionRate: "91.8%",
        responseTimeMinutes: 1.1
      }
    });
  });

  // API Routers
  app.use("/api/auth", authRouter);
  app.use("/api/needs", needsRouter);
  app.use("/api/volunteers", volunteersRouter);
  app.use("/api/matches", matchesRouter);
  app.use("/api/ai", aiRouter);

  // Production Static File Serving
  if (process.env.NODE_ENV === "production") {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ ResourceMap India Backend running on http://localhost:${PORT}`);
  });

  return app;
}

// Auto-start when executed directly
createServer();
