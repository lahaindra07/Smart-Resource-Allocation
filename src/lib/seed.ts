import { CommunityNeed, VolunteerProfile, Organization } from "@/types";

export const SEED_NGOS: Organization[] = [
  { id: "org1", name: "Goonj Relief Network", description: "Disaster relief, material recycling, and rural community rehabilitation.", location: "New Delhi, India", contactEmail: "mail@goonj.org", verified: true, ownerId: "admin1" },
  { id: "org2", name: "SEEDS India Disaster Response", description: "Community resilience, emergency shelter, and water purification across disaster zones.", location: "National Network, India", contactEmail: "info@seedsindia.org", verified: true, ownerId: "admin2" },
  { id: "org3", name: "Akshaya Patra Humanitarian Wing", description: "Emergency food distribution and community nutrition across crisis hubs.", location: "Bengaluru / National", contactEmail: "relief@akshayapatra.org", verified: true, ownerId: "admin3" },
  { id: "org4", name: "Ramakrishna Mission Relief Wing", description: "Flood, cyclone, and medical emergency relief in eastern disaster corridors.", location: "Belur Math / Kolkata, WB", contactEmail: "relief@rkmm.org", verified: true, ownerId: "admin4" },
  { id: "org5", name: "Kerala Disaster Auxiliary Taskforce", description: "Monsoon landslide rescue, mobile primary clinics, and first aid dispatch.", location: "Wayanad / Kochi, Kerala", contactEmail: "help@keralarelief.org", verified: true, ownerId: "admin5" }
];

export const SEED_NEEDS: CommunityNeed[] = [
  { 
    id: "n1", 
    title: "Emergency Flood Rations & Potable Water - Sundarbans", 
    urgencyLevel: "CRITICAL", 
    category: "FOOD", 
    location: "Gosaba, Sundarbans Delta, West Bengal", 
    latitude: 22.1652, 
    longitude: 88.8072, 
    status: "OPEN", 
    reportedBy: "admin4", 
    organizationId: "org4", 
    description: "Tidal river breach inundated 3 villages. Critical need for non-perishable food parcels and water purification units for 180 families.", 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString() 
  },
  { 
    id: "n2", 
    title: "Mobile Emergency Clinic & Triage Outpost - Wayanad", 
    urgencyLevel: "HIGH", 
    category: "HEALTH", 
    location: "Meppadi Relief Base, Wayanad, Kerala", 
    latitude: 11.5534, 
    longitude: 76.1287, 
    status: "OPEN", 
    reportedBy: "admin5", 
    organizationId: "org5", 
    description: "Monsoon landslide evacuees require mobile medical personnel, wound dressing, anti-venom, and oral rehydration therapy.", 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString() 
  },
  { 
    id: "n3", 
    title: "Cyclone Resistant Shelters & Tarpaulins - Puri Coast", 
    urgencyLevel: "CRITICAL", 
    category: "SHELTER", 
    location: "Puri Coastal Relief Corridor, Odisha", 
    latitude: 19.8135, 
    longitude: 85.8312, 
    status: "OPEN", 
    reportedBy: "admin2", 
    organizationId: "org2", 
    description: "Heavy gale winds damaged 80 thatched huts. High-density tarpaulins and framing anchors urgently needed.", 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString() 
  }
];

export const SEED_VOLUNTEERS: VolunteerProfile[] = [
  { 
    id: "v1", 
    userId: "u1", 
    skills: ["Logistics", "Water Purification", "First Aid", "Supply Chain"], 
    availability: "Weekends", 
    hoursPerWeek: 14, 
    location: "Delhi NCR Sector 12, India", 
    latitude: 28.6280, 
    longitude: 77.2789, 
    bio: "Certified disaster relief coordinator with experience in mobile water purification logistics.", 
    verified: true, 
    impactScore: 92 
  },
  { 
    id: "v2", 
    userId: "u2", 
    skills: ["Medical", "Emergency Triage", "Pediatrics", "Trauma Response"], 
    availability: "Flexible", 
    hoursPerWeek: 20, 
    location: "Kochi / Wayanad Outpost, Kerala", 
    latitude: 11.5534, 
    longitude: 76.1287, 
    bio: "Emergency physician and volunteer trauma responder for Kerala State Disaster Management Auxiliary.", 
    verified: true, 
    impactScore: 96 
  }
];
