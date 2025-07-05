import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Flame, CheckSquare, User } from "lucide-react";

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
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Welcome, Cadet Ankit Sharma</h1>
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

      <Card>
        <CardHeader>
            <CardTitle>Next Upcoming Event</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col items-start gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Annual Training Camp</h3>
                    <p className="text-muted-foreground">Location: Ropar, Punjab | Starts: 01 Aug 2024</p>
                </div>
                <Link href="/cadet/camps" passHref>
                    <Button>View Details</Button>
                </Link>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
