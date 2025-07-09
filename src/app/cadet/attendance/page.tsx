"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { CadetAttendanceRecord } from "@/lib/types";
import { useAuth } from "@/components/providers/auth-provider";
import { getCadetAttendance } from "@/lib/actions/attendance.actions";
import { Loader2 } from "lucide-react";

export default function AttendancePage() {
  const { user } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState<CadetAttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAttendance() {
      if (user) {
        setLoading(true);
        const records = await getCadetAttendance(user.uid);
        setAttendanceRecords(records);
        setLoading(false);
      }
    }
    fetchAttendance();
  }, [user]);

  if (!user) {
    // The AuthenticatedLayout will show a loader or access denied message.
    return null;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Record</CardTitle>
        <CardDescription>
          Your attendance history for all camps, parades, and events.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                      Loading your attendance records...
                    </div>
                  </TableCell>
                </TableRow>
              ) : attendanceRecords.length > 0 ? (
                attendanceRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.eventName}</TableCell>
                    <TableCell>{format(new Date(record.date), "dd MMMM yyyy")}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={
                          record.status === "Present"
                            ? "default"
                            : record.status === "Absent"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {record.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                 <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                        No attendance records found.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
            Note: Attendance is marked by administrators. Please contact your unit for any discrepancies.
        </p>
      </CardContent>
    </Card>
  );
}
