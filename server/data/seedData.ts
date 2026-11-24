export interface BackendUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: "VOLUNTEER" | "NGO_MANAGER" | "ADMIN" | "PUBLIC";
  authProvider: "email" | "google";
  createdAt: string;
}

export interface VolunteerEntity {
  id: string;
  name: string;
  skills: string[];
  availability: string;
  hoursPerWeek: number;
  location: string;
  latitude: number;
  longitude: number;
  impactScore: number;
}

export interface NeedEntity {
  id: string;
  title: string;
  category: "FOOD" | "HEALTH" | "EDUCATION" | "SHELTER" | "ENVIRONMENT" | "OTHER";
  urgencyLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  latitude: number;
  longitude: number;
  location: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  createdAt: string;
}

export const BACKEND_USERS: BackendUser[] = [
  {
    id: "usr-1",
    name: "Aarav Sharma",
    email: "volunteer@resourcemap.org",
    password: "password123",
    role: "VOLUNTEER",
    authProvider: "email",
    createdAt: new Date().toISOString()
  },
  {
    id: "usr-2",
    name: "Rajesh Mukherjee",
    email: "ngo@resourcemap.org",
    password: "password123",
    role: "NGO_MANAGER",
    authProvider: "email",
    createdAt: new Date().toISOString()
  },
  {
    id: "usr-3",
    name: "Dr. Priya Nair",
    email: "admin@resourcemap.org",
    password: "password123",
    role: "ADMIN",
    authProvider: "email",
    createdAt: new Date().toISOString()
  }
];

export const SEED_VOLUNTEERS: VolunteerEntity[] = [
  { id: "v1", name: "Aarav Sharma", skills: ["Logistics", "Water Purification", "First Aid", "Supply Chain"], availability: "Weekends", hoursPerWeek: 14, location: "Delhi NCR Sector 12", latitude: 28.6280, longitude: 77.2789, impactScore: 92 },
  { id: "v2", name: "Dr. Priya Nair", skills: ["Medical", "First Aid", "Nursing", "Triage", "Pediatrics"], availability: "Flexible", hoursPerWeek: 20, location: "Kochi / Wayanad Outpost, Kerala", latitude: 11.5534, longitude: 76.1287, impactScore: 96 },
  { id: "v3", name: "Rajesh Mukherjee", skills: ["Civil Engineering", "Shelter Construction", "Logistics", "NDRF Liaison"], availability: "Weekdays", hoursPerWeek: 16, location: "Kolkata, West Bengal", latitude: 22.5726, longitude: 88.3639, impactScore: 89 },
  { id: "v4", name: "Ananya Sen", skills: ["Teaching", "Academics", "Translation", "Child Nutrition"], availability: "Weekends", hoursPerWeek: 12, location: "Sundarbans Relief Base, WB", latitude: 22.1652, longitude: 88.8072, impactScore: 86 },
  { id: "v5", name: "Vikram Rathore", skills: ["Mountain Rescue", "High Altitude Logistics", "Heavy Transport", "Shelter"], availability: "Evenings", hoursPerWeek: 10, location: "Rishikesh / Chamoli, Uttarakhand", latitude: 30.0869, longitude: 78.2676, impactScore: 91 },
  { id: "v6", name: "Kavita Reddy", skills: ["Water Sanitation", "Community Health", "Cooking", "Disaster Outreach"], availability: "Weekdays", hoursPerWeek: 15, location: "Visakhapatnam Coastal Hub, AP", latitude: 17.6868, longitude: 83.2185, impactScore: 84 }
];

export const SEED_NEEDS: NeedEntity[] = [
  {
    id: "need-1",
    title: "Emergency Flood Rations & Clean Water - Sundarbans",
    category: "FOOD",
    urgencyLevel: "CRITICAL",
    latitude: 22.1652,
    longitude: 88.8072,
    location: "Gosaba, Sundarbans Delta, West Bengal",
    description: "Tidal river breach inundated 3 villages. Critical need for non-perishable food parcels (rice, chira, dal) and portable drinking water purification kits for 180 families.",
    status: "OPEN",
    createdAt: new Date().toISOString()
  },
  {
    id: "need-2",
    title: "Primary School Science & Textbooks - Assam Flood Relief",
    category: "EDUCATION",
    urgencyLevel: "MEDIUM",
    latitude: 26.2503,
    longitude: 92.3421,
    location: "Morigaon District Floodplain, Assam",
    description: "Inundated village school needs grade 1-8 syllabus books, notebooks, and learning activity kits for 160 displaced students.",
    status: "OPEN",
    createdAt: new Date().toISOString()
  },
  {
    id: "need-3",
    title: "Mobile Emergency Clinic & First Aid Camp - Wayanad",
    category: "HEALTH",
    urgencyLevel: "HIGH",
    latitude: 11.5534,
    longitude: 76.1287,
    location: "Meppadi Relief Base, Wayanad, Kerala",
    description: "Monsoon landslide evacuees require mobile medical personnel, wound dressing, anti-venom, and oral rehydration therapy (ORS).",
    status: "OPEN",
    createdAt: new Date().toISOString()
  },
  {
    id: "need-4",
    title: "Cyclone Resistant Shelters & Tarpaulins - Odisha Coast",
    category: "SHELTER",
    urgencyLevel: "CRITICAL",
    latitude: 19.8135,
    longitude: 85.8312,
    location: "Puri Coastal Relief Corridor, Odisha",
    description: "Severe coastal gale damaged 80 thatched huts. Heavy-duty waterproof tarpaulins, bamboo framing anchors, and thermal ground sheets needed.",
    status: "OPEN",
    createdAt: new Date().toISOString()
  },
  {
    id: "need-5",
    title: "Potable Water Tankers & Deep Well Filtration - Bundelkhand",
    category: "ENVIRONMENT",
    urgencyLevel: "HIGH",
    latitude: 25.4484,
    longitude: 78.5685,
    location: "Jhansi & Mahoba Outpost, Uttar Pradesh",
    description: "Drought-affected rural sector needs emergency solar-powered water filtration and ground water tanker distribution.",
    status: "OPEN",
    createdAt: new Date().toISOString()
  },
  {
    id: "need-6",
    title: "Urban Slum Waterlogging Medical Triage - Mumbai",
    category: "HEALTH",
    urgencyLevel: "HIGH",
    latitude: 19.0728,
    longitude: 72.8797,
    location: "Kurla Mithi Basin, Mumbai, Maharashtra",
    description: "Severe monsoon waterlogging requires preventative leptospirosis medicine, rapid outpatient triage, and pediatric rehydration camps.",
    status: "OPEN",
    createdAt: new Date().toISOString()
  }
];
