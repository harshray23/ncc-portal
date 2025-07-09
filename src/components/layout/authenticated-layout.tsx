"use client";

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/app-sidebar";
import type { UserRole } from '@/lib/types';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


export default function AuthenticatedLayout({
  children,
  role
}: {
  children: React.ReactNode;
  role: UserRole;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = React.useState(true);
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="flex items-center gap-4 text-xl font-semibold text-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
                Loading Portal...
            </div>
      </div>
    );
  }
  
  if (!user || user.role !== role) {
    // Instead of showing "Access Denied", we redirect to the homepage.
    // This handles the logout case more gracefully.
    // The useEffect ensures this runs on the client after mount.
    React.useEffect(() => {
      router.push('/');
    }, [router]);

    // Show a loader while redirecting.
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background/90 p-4">
             <Card className="w-full max-w-md text-center shadow-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl text-destructive">Access Denied</CardTitle>
                    <CardDescription>
                       You do not have permission to view this page. Redirecting...
                    </CardDescription>
                </CardHeader>
                <CardContent>
                   <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                </CardContent>
            </Card>
        </div>
    );
  }

  const getTitle = (path: string) => {
    const segments = path.split('/').filter(Boolean);
    if (segments.length === 0) return 'Dashboard';
    
    // Handle dynamic routes like /admin/manage-camps/[id]
    if (segments.length > 2 && segments[segments.length - 2].startsWith('manage-')) {
      const feature = segments[segments.length - 2].replace('manage-', '');
      return `${feature.charAt(0).toUpperCase() + feature.slice(1)} Details`;
    }

    const lastSegment = segments[segments.length - 1];
    return lastSegment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  return (
    <SidebarProvider defaultOpen open={open} onOpenChange={setOpen}>
      <div className="flex h-screen w-full">
        <Sidebar collapsible="icon" className="border-r border-sidebar-border">
          <AppSidebar user={user} />
        </Sidebar>
        <SidebarInset className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-card px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex w-full items-center gap-4">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <h1 className="font-headline text-xl font-semibold">
                {getTitle(pathname)}
              </h1>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto bg-background p-4 sm:p-6 md:p-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
