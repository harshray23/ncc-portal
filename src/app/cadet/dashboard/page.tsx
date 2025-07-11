"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Flame, CheckSquare, User, Bell, Loader2 } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from "@/components/providers/auth-provider";
import { getCadetDashboardData } from "@/lib/actions/dashboard.actions";
import type { AppNotification, Camp } from "@/lib/types";

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

export default function CadetDashboard() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [nextCamp, setNextCamp] = useState<Camp | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (user) {
        setLoadingData(true);
        const data = await getCadetDashboardData(user.uid);
        setNotifications(data.notifications);
        setNextCamp(data.nextCamp);
        setLoadingData(false);
      }
    }
    fetchData();
  }, [user]);

  // The main layout already handles the top-level loading state for the user object.
  // We just need to check for the user object before rendering.
  if (!user) {
    return null; // The AuthenticatedLayout will show a loader or an access denied message.
  }
  
  if (loadingData) {
     return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="flex items-center gap-4 text-xl font-semibold text-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
                Loading Dashboard Data...
            </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Welcome, {user.name}</h1>
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
                {nextCamp ? (
                  <div className="flex flex-col items-start gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                          <h3 className="text-lg font-semibold">{nextCamp.name}</h3>
                          <p className="text-muted-foreground">Location: {nextCamp.location} | Starts: {new Date(nextCamp.startDate).toLocaleDateString()}</p>
                      </div>
                      <Link href="/cadet/camps" passHref>
                          <Button>View Details</Button>
                      </Link>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center p-4">No upcoming camps scheduled.</p>
                )}
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
                    {notifications.length > 0 ? notifications.map(notif => (
                        <div key={notif.id} className="flex items-start gap-3">
                            <div>
                                <div className={`h-2 w-2 rounded-full mt-2 ${notif.read ? 'bg-transparent' : 'bg-primary animate-pulse'}`}></div>
                            </div>
                            <div>
                                <p className="text-sm font-medium">{notif.message}</p>
                                <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}</p>
                            </div>
                        </div>
                    )) : (
                      <p className="text-muted-foreground text-center p-4">You have no new notifications.</p>
                    )}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
