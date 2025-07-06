import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Flame, UserCheck, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDashboardStats } from "@/lib/actions/dashboard.actions";
import { formatDistanceToNow } from "date-fns";

export default async function AdminDashboard() {
  const { stats, recentActivities } = await getDashboardStats();

  const statIcons = {
    totalCadets: Users,
    activeCamps: Flame,
    pendingRegistrations: UserCheck,
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-md transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {React.createElement(statIcons[stat.id as keyof typeof statIcons], { className: `h-5 w-5 ${stat.color}` })}
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
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
            </CardContent>
        </Card>
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                {recentActivities.length > 0 ? (
                  <Table>
                      <TableBody>
                          {recentActivities.map((activity, index) => (
                              <TableRow key={index}>
                                  <TableCell>{activity.description}</TableCell>
                                  <TableCell className="text-right text-muted-foreground">
                                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                                  </TableCell>
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                        <Activity className="h-10 w-10 mb-4" />
                        <p>No recent activities found.</p>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
