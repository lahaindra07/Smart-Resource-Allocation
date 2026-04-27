export type Role = 'ADMIN' | 'NGO_MANAGER' | 'VOLUNTEER' | 'PUBLIC';
export type Urgency = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type NeedCategory = 'HEALTH' | 'EDUCATION' | 'FOOD' | 'SHELTER' | 'ENVIRONMENT' | 'OTHER';
export type NeedStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
export type MatchStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  emailVerified: boolean;
  image?: string;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  location: string;
  contactEmail: string;
  verified: boolean;
  ownerId: string;
}

export interface CommunityNeed {
  id: string;
  title: string;
  description: string;
  urgencyLevel: Urgency;
  category: NeedCategory;
  location: string;
  latitude: number;
  longitude: number;
  status: NeedStatus;
  reportedBy: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface VolunteerProfile {
  id: string;
  userId: string;
  skills: string[];
  availability: string;
  hoursPerWeek: number;
  location: string;
  latitude: number;
  longitude: number;
  bio: string;
  verified: boolean;
  impactScore: number;
}
