import { Router } from "express";
import { SEED_NEEDS, SEED_VOLUNTEERS } from "../data/seedData.ts";
import { calculateHaversineDistance } from "../utils/geo.ts";

export const matchesRouter = Router();

// Smart Multi-factor Haversine Matching Engine
matchesRouter.get("/need/:needId", (req, res) => {
  const { needId } = req.params;
  const targetNeed = SEED_NEEDS.find(n => n.id === needId) || SEED_NEEDS[0];

  const categoryKeywords: Record<string, string[]> = {
    FOOD: ["cooking", "logistics", "distribution", "delivery", "food", "supply", "water", "purification"],
    HEALTH: ["nursing", "medical", "first aid", "healthcare", "health", "triage", "pediatrics", "doctor"],
    EDUCATION: ["teaching", "mentoring", "academics", "tutoring", "javascript", "translation", "books"],
    SHELTER: ["construction", "maintenance", "carpentry", "shelter", "engineering", "tarpaulins"],
    ENVIRONMENT: ["planting", "cleanup", "conservation", "sanitation", "filtration", "water"]
  };

  const keywords = categoryKeywords[targetNeed.category] || [];

  const scoredVolunteers = SEED_VOLUNTEERS.map(volunteer => {
    // 1. Proximity score (0-30 pts) using Haversine formula
    const distance = calculateHaversineDistance(
      volunteer.latitude,
      volunteer.longitude,
      targetNeed.latitude,
      targetNeed.longitude
    );
    // Exponential falloff over India's regional distances
    const distanceScore = Math.max(0, 30 - (distance / 400) * 30);

    // 2. Skill overlap score (0-40 pts)
    const matches = volunteer.skills.filter(s =>
      keywords.some(k => s.toLowerCase().includes(k) || k.includes(s.toLowerCase()))
    ).length;
    const skillScore = Math.min(40, matches * 15 + (matches > 0 ? 10 : 0));

    // 3. Availability score (0-20 pts)
    const availabilityScore = volunteer.hoursPerWeek >= 12 ? 20 : (volunteer.hoursPerWeek / 12) * 20;

    // 4. Past impact score (0-10 pts)
    const completionScore = Math.min(10, (volunteer.impactScore / 100) * 10);

    const totalScore = Math.min(100, Math.max(15, Math.round(distanceScore + skillScore + availabilityScore + completionScore)));

    return {
      volunteerId: volunteer.id,
      name: volunteer.name,
      skills: volunteer.skills,
      distanceKm: distance,
      compatibilityScore: totalScore,
      availability: volunteer.availability,
      hoursPerWeek: volunteer.hoursPerWeek,
      location: volunteer.location,
      status: "READY"
    };
  }).sort((a, b) => b.compatibilityScore - a.compatibilityScore);

  res.json({
    success: true,
    needId: targetNeed.id,
    needTitle: targetNeed.title,
    matches: scoredVolunteers
  });
});
