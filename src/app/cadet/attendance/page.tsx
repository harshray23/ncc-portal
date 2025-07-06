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
import type { AttendanceRecord } from "@/lib/types";
import { getCurrentUser } from "@/lib/auth";
import { getCadetAttendance } from "@/lib/actions/attendance.actions";

export default async function AttendancePage() {
  const user = await getCurrentUser();
  const attendanceRecords = user ? await getCadetAttendance(user.uid) : [];

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
              {attendanceRecords.map((record) => (
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
              ))}
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
