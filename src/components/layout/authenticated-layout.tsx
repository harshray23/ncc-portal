"use client";

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/app-sidebar";
import type { UserRole } from '@/lib/types';
import { ShieldCheck, Loader2 } from 'lucide-react';

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
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        const userRole = idTokenResult.claims.role;

        if (userRole === role) {
          setUser(user);
        } else {
          // Wrong role, redirect to login
          router.push('/login'); 
        }
      } else {
        // Not logged in, redirect to login
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, role]);


  const getTitle = (path: string) => {
    const segments = path.split('/').filter(Boolean);
    if (segments.length === 0) return 'Dashboard';
    const lastSegment = segments[segments.length - 1];
    return lastSegment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // This case is handled by the redirect, but as a fallback to prevent rendering children.
    return null; 
  }

  return (
    <SidebarProvider defaultOpen open={open} onOpenChange={setOpen}>
      <div className="flex h-screen w-full">
        <Sidebar collapsible="icon" className="border-r border-sidebar-border">
          <AppSidebar role={role} />
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
