export type UserRole = "cadet" | "admin" | "manager";

export interface UserProfile {
  uid: string;
  role: UserRole;
  name: string;
  email: string;
  regimentalNumber: string;
  regimentalNumberEditCount: number;
  studentId: string;
  rank: string;
  unit: string;
  phone: string;
  whatsapp: string;
  approved: boolean;
  profilePhotoUrl?: string;
  createdAt: Date; 
  year: number;
}

export interface Camp {
  id: string;
  name: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  status: 'Upcoming' | 'Completed' | 'Planning';
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
    id: string; // YYYY-MM-DD
    date: Date;
    records: Record<string, {
      cadetId: string;
      status: 'Present' | 'Absent' | 'On-Leave' | 'Late';
      remarks: string;
    }>
}

export interface AttendanceData {
  cadets: UserProfile[];
  records: Record<string, {
      status: 'Present' | 'Absent' | 'Late';
      remarks: string;
  }>;
}

export interface AppNotification {
    id: string;
    userId: string;
    message: string;
    read: boolean;
    timestamp: Date;
    href?: string;
}
