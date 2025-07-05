import { AttendanceChart } from "@/components/manager/attendance-chart";
import { ActivityChart } from "@/components/manager/activity-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const upcomingCamps = [
    { name: 'Annual Training Camp', registrants: 128, capacity: 150, status: 'Open' },
    { name: 'Thal Sainik Camp', registrants: 95, capacity: 100, status: 'Filling Fast' },
    { name: 'Rock Climbing Camp', registrants: 45, capacity: 50, status: 'Open' },
];

export default function ManagerDashboard() {
  return (
    <div className="space-y-8">
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Camp Attendance Overview</CardTitle>
            <CardDescription>Comparison of attendance across recent camps.</CardDescription>
          </CardHeader>
          <CardContent>
            <AttendanceChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cadet Activity</CardTitle>
            <CardDescription>Profile updates and registrations over the last 30 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityChart />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Upcoming Camp Registrations</CardTitle>
            <CardDescription>Live status of registrations for forthcoming camps.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Camp Name</TableHead>
                        <TableHead>Registrants</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {upcomingCamps.map((camp) => (
                        <TableRow key={camp.name}>
                            <TableCell className="font-medium">{camp.name}</TableCell>
                            <TableCell>{camp.registrants}</TableCell>
                            <TableCell>{camp.capacity}</TableCell>
                            <TableCell>
                                <Badge variant={camp.status === 'Open' ? 'secondary' : 'default'}>{camp.status}</Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
