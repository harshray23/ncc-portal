import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Flame, CheckSquare, User, Bell, CheckCircle } from "lucide-react";
import { AppNotification } from "@/lib/types";
import { formatDistanceToNow } from 'date-fns';
import { Badge } from "@/components/ui/badge";

const quickLinks = [
  {
    title: "My Profile",
    description: "View and update your personal details and records.",
    href: "/cadet/profile",
    icon: User,
  },
  {
    title: "Upcoming Camps",
    description: "Explore and register for the latest camps.",
    href: "/cadet/camps",
    icon: Flame,
  },
  {
    title: "Attendance Record",
    description: "Check your attendance for all events and parades.",
    href: "/cadet/attendance",
    icon: CheckSquare,
  },
];

const mockNotifications: AppNotification[] = [
    { id: 'notif-1', message: "Congratulations! You have been selected for the Annual Training Camp.", read: false, timestamp: new Date(Date.now() - 3600000) },
    { id: 'notif-4', message: "Sorry, you are not eligible for the Thal Sainik Camp.", read: false, timestamp: new Date(Date.now() - 1800000) },
    { id: 'notif-2', message: "Your profile details have been updated successfully.", read: true, timestamp: new Date(Date.now() - 86400000 * 2) },
    { id: 'notif-3', message: "Reminder: Weekly parade tomorrow at 0800 hrs.", read: true, timestamp: new Date(Date.now() - 86400000 * 3) }
]

export default function CadetDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Welcome, Cdt. Harsh Home</h1>
        <p className="text-muted-foreground">
          Here is a summary of your NCC activities.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((link) => (
          <Card key={link.title} className="flex flex-col justify-between transition-all hover:shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <link.icon className="h-6 w-6" />
                </div>
                <div>
                    <CardTitle>{link.title}</CardTitle>
                    <CardDescription>{link.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link href={link.href} passHref>
                <Button variant="outline" className="w-full">
                  Go to {link.title} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Next Upcoming Event</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-start gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">Thal Sainik Camp</h3>
                        <p className="text-muted-foreground">Location: Delhi Cantt | Starts: 15 Sep 2024</p>
                    </div>
                    <Link href="/cadet/camps" passHref>
                        <Button>View Details</Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {mockNotifications.map(notif => (
                        <div key={notif.id} className="flex items-start gap-3">
                            <div>
                                <div className={`h-2 w-2 rounded-full mt-2 ${notif.read ? 'bg-transparent' : 'bg-primary animate-pulse'}`}></div>
                            </div>
                            <div>
                                <p className="text-sm font-medium">{notif.message}</p>
                                <p className="text-xs text-muted-foreground">{formatDistanceToNow(notif.timestamp, { addSuffix: true })}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
