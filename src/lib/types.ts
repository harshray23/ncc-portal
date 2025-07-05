export type UserRole = "cadet" | "admin" | "manager";

export interface UserProfile {
  name: string;
  email: string;
  regimentalNumber: string;
  studentId: string;
  rank: string;
  unit: string;
}

export interface Camp {
  id: string;
  name: string;
  location: string;
  startDate: Date;
  endDate: Date;
  description: string;
  registrationLink: string;
}

export interface AttendanceRecord {
  id: string;
  eventName: string;
  date: Date;
  status: "Present" | "Absent" | "On-Leave";
}
