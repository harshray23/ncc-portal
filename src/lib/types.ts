export type UserRole = "cadet" | "admin" | "manager";

export interface UserProfile {
  uid: string;
  role: UserRole;
  name: string;
  email: string;
  regimentalNumber: string;
  studentId: string;
  rank: string;
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
  startDate: any; // Firestore Timestamp
  endDate: any; // Firestore Timestamp
  linkId: string;
  createdBy: string; // Admin's UID
  createdAt: any; // Firestore Timestamp
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
  id: string; // userId
  present: boolean;
  remarks?: string;
}

export interface Attendance {
    id: string; // dateId e.g., 2025-07-05
    campId?: string;
    markedBy: string; // Admin's UID
    timestamp: any; // Firestore Timestamp
    records: AttendanceRecord[];
}
