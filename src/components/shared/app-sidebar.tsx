"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
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
import type { UserRole } from "@/lib/types";

interface AppSidebarProps {
  role: UserRole;
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
];

const adminNav = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/manage-cadets", icon: Users, label: "Manage Cadets" },
  { href: "/admin/manage-camps", icon: Flame, label: "Manage Camps" },
  { href: "/admin/profile", icon: User, label: "My Profile" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

const navItems = {
  cadet: cadetNav,
  manager: managerNav,
  admin: adminNav,
};

const userDetails = {
    cadet: { name: "Cdt. Harsh Home", email: "homeharsh001@gmail.com" },
    manager: { name: "Maj. Vikram Batra", email: "vikram.batra@example.com" },
    admin: { name: "Col. Elvish Ray", email: "elvishray007@gmail.com" },
}

export function AppSidebar({ role }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const currentNav = navItems[role] || [];
  const currentUser = userDetails[role];


  const handleLogout = () => {
    auth.signOut().then(() => {
        router.push("/");
    });
  };

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <div className="flex flex-col">
            <h2 className="font-headline text-lg font-semibold text-sidebar-foreground">CadetLink</h2>
            <p className="text-xs text-sidebar-foreground/70">{role.charAt(0).toUpperCase() + role.slice(1)} Portal</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {currentNav.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label }}
                  asChild
                >
                  <a className="flex items-center gap-3">
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="p-2">
         <div className="flex items-center gap-3 rounded-md p-2">
            <Avatar className="h-10 w-10">
                <AvatarImage src={`https://placehold.co/40x40.png`} alt={currentUser.name} data-ai-hint="profile picture" />
                <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
                <p className="truncate text-sm font-medium text-sidebar-foreground">{currentUser.name}</p>
                <p className="truncate text-xs text-sidebar-foreground/70">{currentUser.email}</p>
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
