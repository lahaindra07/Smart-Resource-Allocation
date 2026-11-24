/**
 * Centralized API Client Service for ResourceMap India
 * Communicates with the Express backend on /api/*
 */

import { CommunityNeed, VolunteerProfile } from "@/types";

export interface PlatformStats {
  activeNeeds: number;
  totalVolunteers: number;
  partnerNGOs: number;
  resolutionRate: string;
  responseTimeMinutes: number;
}

export interface MatchCandidate {
  volunteerId: string;
  name: string;
  skills: string[];
  distanceKm: number;
  compatibilityScore: number;
  availability: string;
  hoursPerWeek: number;
  location: string;
  status: string;
}

export interface NeedMatchesResponse {
  success: boolean;
  needId: string;
  needTitle: string;
  matches: MatchCandidate[];
}

/**
 * Fetch all community crisis needs with optional filters
 */
export async function getNeeds(params?: { category?: string; urgency?: string; status?: string }): Promise<CommunityNeed[]> {
  const query = new URLSearchParams();
  if (params?.category && params.category !== "ALL") query.set("category", params.category);
  if (params?.urgency && params.urgency !== "ALL") query.set("urgency", params.urgency);
  if (params?.status) query.set("status", params.status);

  const res = await fetch(`/api/needs?${query.toString()}`);
  if (!res.ok) throw new Error(`Failed to fetch needs: ${res.statusText}`);
  const data = await res.json();
  return data.data || [];
}

/**
 * Fetch details for a specific need by ID
 */
export async function getNeedById(id: string): Promise<CommunityNeed> {
  const res = await fetch(`/api/needs/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch need ${id}: ${res.statusText}`);
  const data = await res.json();
  return data.data;
}

/**
 * Post a new community crisis need ticket
 */
export async function createNeed(needData: Partial<CommunityNeed>): Promise<CommunityNeed> {
  const res = await fetch("/api/needs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(needData)
  });
  if (!res.ok) throw new Error(`Failed to create need: ${res.statusText}`);
  const data = await res.json();
  return data.data;
}

/**
 * Fetch verified volunteers directory
 */
export async function getVolunteers(): Promise<VolunteerProfile[]> {
  const res = await fetch("/api/volunteers");
  if (!res.ok) throw new Error(`Failed to fetch volunteers: ${res.statusText}`);
  const data = await res.json();
  return data.data || [];
}

/**
 * Run algorithmic Haversine matching for a specific need
 */
export async function getNeedMatches(needId: string): Promise<NeedMatchesResponse> {
  const res = await fetch(`/api/matches/need/${needId}`);
  if (!res.ok) throw new Error(`Failed to fetch matches for need ${needId}`);
  return await res.json();
}

/**
 * Fetch global platform telemetry statistics
 */
export async function getPlatformStats(): Promise<PlatformStats> {
  const res = await fetch("/api/stats");
  if (!res.ok) throw new Error("Failed to fetch platform stats");
  const data = await res.json();
  return data.data;
}

/**
 * Check backend API health and connectivity
 */
export async function checkBackendHealth(): Promise<{ status: string; region: string; model: string }> {
  const res = await fetch("/api/health");
  if (!res.ok) throw new Error("Backend API healthcheck failed");
  return await res.json();
}

/**
 * Great-circle distance between two coordinates in kilometers using the Haversine formula
 */
export function calculateDistance(lat1?: number, lon1?: number, lat2?: number, lon2?: number): number {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) {
    return 15;
  }
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Computes multi-factor match score (0-100%) between a volunteer and community need
 */
export function calculateMatchScore(volunteer: VolunteerProfile, targetNeed: CommunityNeed): number {
  const categoryKeywords: Record<string, string[]> = {
    FOOD: ["cooking", "logistics", "distribution", "delivery", "food", "water", "purification", "rations"],
    HEALTH: ["nursing", "medical", "first aid", "triage", "healthcare", "pediatrics", "doctor"],
    EDUCATION: ["teaching", "mentoring", "academics", "tutoring", "javascript", "translation", "books"],
    SHELTER: ["construction", "maintenance", "carpentry", "shelter", "engineering", "tarpaulins"],
    ENVIRONMENT: ["planting", "cleanup", "conservation", "sanitation", "filtration", "water"]
  };

  const keywords = categoryKeywords[targetNeed.category] || ["general", "teamwork", "logistics"];
  const volunteerSkills = volunteer.skills || [];

  const skillMatches = volunteerSkills.filter(skill =>
    keywords.some(k => skill.toLowerCase().includes(k) || k.includes(skill.toLowerCase()))
  ).length;
  const skillScore = Math.min(40, skillMatches * 15 + (skillMatches > 0 ? 10 : 0));

  const distance = calculateDistance(volunteer.latitude, volunteer.longitude, targetNeed.latitude, targetNeed.longitude);
  const distanceScore = Math.max(0, 30 - (distance / 400) * 30);

  const availabilityScore = (volunteer.hoursPerWeek || 10) >= 12 ? 20 : ((volunteer.hoursPerWeek || 10) / 12) * 20;
  const impactScore = Math.min(10, ((volunteer.impactScore || 85) / 100) * 10);

  return Math.min(100, Math.max(15, Math.round(skillScore + distanceScore + availabilityScore + impactScore)));
}
