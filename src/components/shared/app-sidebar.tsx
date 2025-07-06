
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShieldCheck,
  LayoutDashboard,
  User,
  CheckSquare,
  Flame,
  Users,
  Settings,
  LogOut,
  BarChart,
  GraduationCap,
} from "lucide-react";
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/lib/types";
import { getFirebase } from "@/lib/firebase";

interface AppSidebarProps {
  user: UserProfile;
}

const cadetNav = [
  { href: "/cadet/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/cadet/profile", icon: User, label: "My Profile" },
  { href: "/cadet/camps", icon: Flame, label: "Camps" },
  { href: "/cadet/attendance", icon: CheckSquare, label: "Attendance" },
];

const managerNav = [
  { href: "/manager/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/manager/activity", icon: BarChart, label: "Activity Monitor" },
  { href: "/manager/manage-staff", icon: Users, label: "Manage Staff" },
];

const adminNav = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/manage-cadets", icon: Users, label: "Manage Cadets" },
  { href: "/admin/manage-camps", icon: Flame, label: "Manage Camps" },
  { href: "/admin/manage-attendance", icon: CheckSquare, label: "Manage Attendance" },
  { href: "/admin/manage-year", icon: GraduationCap, label: "Manage Year" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

const navItems = {
  cadet: cadetNav,
  manager: managerNav,
  admin: adminNav,
};

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const currentNav = navItems[user.role] || [];

  const handleLogout = async () => {
    const { auth } = getFirebase();
    await auth.signOut();
    router.push("/");
  };

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <div className="flex flex-col">
            <h2 className="font-headline text-lg font-semibold text-sidebar-foreground">NCC</h2>
            <p className="text-xs text-sidebar-foreground/70">{user.role.charAt(0).toUpperCase() + user.role.slice(1)} Portal</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {currentNav.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                isActive={pathname.startsWith(item.href)}
                tooltip={{ children: item.label }}
                asChild
              >
                <Link href={item.href} className="flex items-center gap-3">
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="p-2">
         <div className="flex items-center gap-3 rounded-md p-2">
            <Avatar className="h-10 w-10">
                <AvatarImage src={user.profilePhotoUrl} alt={user.name} data-ai-hint="profile picture" />
                <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
                <p className="truncate text-sm font-medium text-sidebar-foreground">{user.name}</p>
                <p className="truncate text-xs text-sidebar-foreground/70">{user.email}</p>
            </div>
        </div>
        <Button variant="ghost" className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent" onClick={handleLogout}>
          <LogOut />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </>
  );
}
