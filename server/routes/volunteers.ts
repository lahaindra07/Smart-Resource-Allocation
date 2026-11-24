import { Router } from "express";
import { SEED_VOLUNTEERS } from "../data/seedData.ts";

export const volunteersRouter = Router();

// Get Volunteers Directory
volunteersRouter.get("/", (req, res) => {
  res.json({
    success: true,
    count: SEED_VOLUNTEERS.length,
    data: SEED_VOLUNTEERS
  });
});

// Get Volunteer by ID
volunteersRouter.get("/:id", (req, res) => {
  const volunteer = SEED_VOLUNTEERS.find(v => v.id === req.params.id);
  if (!volunteer) {
    return res.status(404).json({ error: "Volunteer not found." });
  }
  res.json({ success: true, data: volunteer });
});
