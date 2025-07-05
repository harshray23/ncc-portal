import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Flame, UserCheck, FileDown, FileUp, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const stats = [
  { title: "Total Cadets", value: "1,250", icon: Users, color: "text-blue-500" },
  { title: "Active Camps", value: "8", icon: Flame, color: "text-orange-500" },
  { title: "Pending Registrations", value: "42", icon: UserCheck, color: "text-green-500" },
];

const recentActivities = [
    { description: "New cadet data uploaded.", timestamp: "2 hours ago" },
    { description: "Camp 'Mountain Trek 2024' created.", timestamp: "1 day ago" },
    { description: "Bulk attendance marked for 'Annual Parade'.", timestamp: "3 days ago" },
    { description: "Cadet Ankit Sharma's profile updated.", timestamp: "5 days ago" },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-md transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">Updated just now</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
         <Card className="shadow-md">
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Link href="/admin/manage-cadets" passHref>
                    <Button className="w-full" variant="outline"><Users className="mr-2" /> Manage Cadets</Button>
                </Link>
                <Link href="/admin/manage-camps" passHref>
                    <Button className="w-full" variant="outline"><Flame className="mr-2" /> Manage Camps</Button>
                </Link>
                 <Button className="w-full"><FileUp className="mr-2" /> Upload Cadet Data</Button>
                 <Button className="w-full"><FileDown className="mr-2" /> Download Reports</Button>
            </CardContent>
        </Card>
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableBody>
                        {recentActivities.map((activity, index) => (
                            <TableRow key={index}>
                                <TableCell>{activity.description}</TableCell>
                                <TableCell className="text-right text-muted-foreground">{activity.timestamp}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
