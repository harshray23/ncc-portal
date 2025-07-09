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
  createdAt: string; 
  year: number;
}

export interface Camp {
  id: string;
  name: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
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
    registeredAt: string;
}


export interface AttendanceRecord {
    id: string; // YYYY-MM-DD
    date: string;
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
    timestamp: string;
    href?: string;
}

export interface CadetAttendanceRecord {
  id: string;
  eventName: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late';
  remarks?: string;
}

export type AuditLogType = 'Login' | 'Approval' | 'Registration' | 'Profile Update' | 'Data Import' | 'Report Download' | 'New User' | 'Camp Create' | 'Camp Delete' | 'Attendance Update' | 'Year Update' | 'Staff Add' | 'Staff Delete';

export interface AuditLog {
  id: string;
  timestamp: string; // ISO string
  user: string;
  userId: string;
  role: UserRole;
  type: AuditLogType;
  details: string;
}
