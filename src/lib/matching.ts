import { VolunteerProfile, CommunityNeed } from "@/types";

/**
 * Calculates the distance between two points on Earth using the Haversine formula.
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Scoring formula (0–100):
 * - Skill overlap: volunteer skills vs. need category keywords (40 pts)
 * - Location proximity: distance in km using Haversine formula (30 pts)
 * - Availability: hours/week vs. task estimated hours (20 pts)
 * - Past completion rate (10 pts)
 */
export function calculateMatchScore(volunteer: VolunteerProfile, targetNeed: CommunityNeed): number {
  let score = 0;

  // 1. Skill Overlap (40 pts)
  // Mapping categories to keywords for better overlap matching
  const categoryKeywords: Record<string, string[]> = {
    FOOD: ["cooking", "logistics", "distribution", "delivery", "nutrition"],
    HEALTH: ["nursing", "medical", "first aid", "counseling", "healthcare"],
    EDUCATION: ["teaching", "mentoring", "tutoring", "content creation", "academics"],
    SHELTER: ["construction", "maintenance", "carpentry", "housing", "organizing"],
    ENVIRONMENT: ["planting", "cleanup", "conservation", "wildlife", "mapping"],
    OTHER: ["admin", "general labour", "translation", "event planning"]
  };

  const keywords = categoryKeywords[targetNeed.category] || [];
  const skillCount = volunteer.skills.filter(skill => 
    keywords.some(keyword => skill.toLowerCase().includes(keyword.toLowerCase()))
  ).length;

  const skillScore = Math.min(40, (skillCount / Math.max(1, keywords.length)) * 40 + (skillCount > 0 ? 10 : 0));
  score += skillScore;

  // 2. Location Proximity (30 pts)
  // Max points if within 5km, decreases linearly to 0 at 50km
  const distance = calculateDistance(volunteer.latitude, volunteer.longitude, targetNeed.latitude, targetNeed.longitude);
  const distanceScore = Math.max(0, 30 - (distance / 50) * 30);
  score += distanceScore;

  // 3. Availability (20 pts)
  // Assuming needs specify a required hours/week eventually. Defaulting logic for now.
  const requiredHours = 5; // Placeholder
  const availabilityScore = volunteer.hoursPerWeek >= requiredHours ? 20 : (volunteer.hoursPerWeek / requiredHours) * 20;
  score += availabilityScore;

  // 4. Past completion rate (10 pts)
  // Using impactScore as a proxy for now
  const completionScore = Math.min(10, (volunteer.impactScore / 100) * 10);
  score += completionScore;

  return Math.round(score);
}
