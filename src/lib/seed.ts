import { CommunityNeed, VolunteerProfile, Organization } from "@/types";

export const SEED_NGOS: Organization[] = [
  { id: "org1", name: "GreenEarth NGO", description: "Environmental conservation and reforestation.", location: "Brazil", contactEmail: "contact@greenearth.org", verified: true, ownerId: "admin1" },
  { id: "org2", name: "EduAfrica", description: "Bringing coding education to rural kids.", location: "Kenya", contactEmail: "info@eduafrica.org", verified: true, ownerId: "admin2" },
  { id: "org3", name: "GlobalHealth Relief", description: "Mobile clinics for emergency zones.", location: "Global", contactEmail: "urgent@ghr.org", verified: true, ownerId: "admin3" },
  { id: "org4", name: "SoupForAll", description: "Fighting hunger in urban food deserts.", location: "London", contactEmail: "help@soupforall.uk", verified: true, ownerId: "admin4" },
  { id: "org5", name: "Habitat Builders", description: "Low-income housing construction.", location: "USA", contactEmail: "build@habitat.com", verified: true, ownerId: "admin5" }
];

export const SEED_NEEDS: CommunityNeed[] = [
  { id: "n1", title: "Reforestation Amazon", urgencyLevel: "HIGH", category: "ENVIRONMENT", location: "Amazon Basin", latitude: -3.4653, longitude: -62.2159, status: "OPEN", reportedBy: "admin1", organizationId: "org1", description: "Need workers for tree planting project.", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: "n2", title: "Coding Bootcamp Nairobi", urgencyLevel: "MEDIUM", category: "EDUCATION", location: "Nairobi", latitude: -1.2921, longitude: 36.8219, status: "IN_PROGRESS", reportedBy: "admin2", organizationId: "org2", description: "Teaching JS to 50 students.", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  // ... more needs will be added in implementation
];

export const SEED_VOLUNTEERS: VolunteerProfile[] = [
  { id: "v1", userId: "u1", skills: ["JavaScript", "Teaching"], availability: "Weekends", hoursPerWeek: 10, location: "Nairobi", latitude: -1.28, longitude: 36.81, bio: "Tech enthusiast", verified: true, impactScore: 85 },
  { id: "v2", userId: "u2", skills: ["Medical", "First Aid"], availability: "Flexible", hoursPerWeek: 20, location: "Brazil", latitude: -3.47, longitude: -62.22, bio: "Certified Nurse", verified: true, impactScore: 92 }
];
