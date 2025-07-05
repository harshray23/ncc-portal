export type UserRole = "cadet" | "admin" | "manager";

export interface UserProfile {
  uid: string;
  role: UserRole;
  name: string;
  email: string;
  regimentalNumber: string;
  studentId: string;
  rank: string;
  unit?: string;
  phone: string;
  whatsapp: string;
  approved: boolean;
  profilePhotoUrl?: string;
  createdAt: any; // Firestore Timestamp
}

export interface Camp {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  registrationLink: string;
}

export interface CampRegistration {
    id: string;
    campId: string;
    cadetId: string;
    regimentalNumber: string;
    studentId: string;
    rank: string;
    name: string;
    phone: string;
    whatsapp: string;
    registeredAt: any; // Firestore Timestamp
}

export interface AttendanceRecord {
    id: string;
    eventName: string;
    date: Date;
    status: 'Present' | 'Absent' | 'On-Leave';
}
