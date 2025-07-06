export type UserRole = "cadet" | "admin" | "manager";

export interface UserProfile {
  uid: string;
  role: UserRole;
  name: string;
  email: string;
  regimentalNumber: string;
  regimentalNumberEditCount?: number;
  studentId: string;
  rank: string;
  unit?: string;
  phone: string;
  whatsapp: string;
  approved: boolean;
  profilePhotoUrl?: string;
  createdAt: any; // Firestore Timestamp
  year?: number;
}

export interface Camp {
  id: string;
  name: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  status: 'Upcoming' | 'Completed' | 'Planning';
  registrationLink?: string; // Kept for AI flow, but registration will be handled internally
}

export type RegistrationStatus = 'Pending' | 'Accepted' | 'Rejected';

export interface CampRegistration {
    id: string;
    campId: string;
    cadetId: string;
    cadetName: string;
    cadetYear: number;
    cadetRegimentalNumber: string;
    status: RegistrationStatus;
    registeredAt: Date;
}


export interface AttendanceRecord {
    id: string;
    eventName: string;
    date: Date;
    status: 'Present' | 'Absent' | 'On-Leave';
}

export interface AppNotification {
    id: string;
    message: string;
    read: boolean;
    timestamp: Date;
}
