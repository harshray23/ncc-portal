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

const attendanceRecords: AttendanceRecord[] = [
  { id: "att-1", eventName: "Annual Training Camp - Day 1", date: new Date(2023, 7, 2), status: "Present" },
  { id: "att-2", eventName: "Weekly Parade", date: new Date(2023, 7, 12), status: "Present" },
  { id: "att-3", eventName: "Weapon Training", date: new Date(2023, 7, 15), status: "Absent" },
  { id: "att-4", eventName: "Weekly Parade", date: new Date(2023, 7, 19), status: "Present" },
  { id: "att-5", eventName: "Map Reading Class", date: new Date(2023, 7, 22), status: "On-Leave" },
  { id: "att-6", eventName: "Weekly Parade", date: new Date(2023, 7, 26), status: "Present" },
];

export default function AttendancePage() {
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
                  <TableCell>{format(record.date, "dd MMMM yyyy")}</TableCell>
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
