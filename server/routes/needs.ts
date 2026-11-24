import { Router } from "express";
import { SEED_NEEDS, NeedEntity } from "../data/seedData.ts";

export const needsRouter = Router();

// Get All Needs
needsRouter.get("/", (req, res) => {
  const { category, urgency, status } = req.query;

  let results = [...SEED_NEEDS];

  if (category && category !== "ALL") {
    results = results.filter(n => n.category === category);
  }

  if (urgency && urgency !== "ALL") {
    results = results.filter(n => n.urgencyLevel === urgency);
  }

  if (status) {
    results = results.filter(n => n.status === status);
  }

  res.json({
    success: true,
    count: results.length,
    data: results
  });
});

// Get Need by ID
needsRouter.get("/:id", (req, res) => {
  const need = SEED_NEEDS.find(n => n.id === req.params.id);
  if (!need) {
    return res.status(404).json({ error: "Need not found." });
  }
  res.json({ success: true, data: need });
});

// Create Need
needsRouter.post("/", (req, res) => {
  const { title, description, category, urgencyLevel, location, latitude, longitude } = req.body;

  if (!title || !category || !urgencyLevel) {
    return res.status(400).json({ error: "Title, category, and urgency level are required." });
  }

  const newNeed: NeedEntity = {
    id: `need-${Date.now()}`,
    title,
    description: description || "Community request registered via NGO portal.",
    category,
    urgencyLevel,
    location: location || "Central Relief Sector, India",
    latitude: latitude || 22.5937 + (Math.random() - 0.5) * 6.0,
    longitude: longitude || 78.9629 + (Math.random() - 0.5) * 6.0,
    status: "OPEN",
    createdAt: new Date().toISOString()
  };

  SEED_NEEDS.unshift(newNeed);
  res.status(201).json({ success: true, data: newNeed });
});

// Update Need Status
needsRouter.patch("/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const need = SEED_NEEDS.find(n => n.id === id);
  if (!need) {
    return res.status(404).json({ error: "Need not found." });
  }

  if (status) {
    need.status = status;
  }

  res.json({ success: true, data: need });
});
