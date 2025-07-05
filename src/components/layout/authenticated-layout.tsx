"use client";

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/app-sidebar";
import type { UserRole } from '@/lib/types';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AuthenticatedLayout({
  children,
  role
}: {
  children: React.ReactNode;
  role: UserRole;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("Logged in:", user.uid);
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          console.log("User Firestore data:", userDoc.data());

          if (userDoc.exists()) {
            const userData = userDoc.data();
            const userRole = userData.role;
            const isApproved = userData.approved;
            
            if (userRole === role) {
              if (role === 'cadet' && !isApproved) {
                toast({
                  variant: "destructive",
                  title: "Account Not Approved",
                  description: "Your account is pending approval from an administrator.",
                  duration: 5000,
                });
                await auth.signOut();
                router.push('/login');
              } else {
                setUser(user);
              }
            } else {
              // Wrong role, redirect to login
               toast({
                  variant: "destructive",
                  title: "Access Denied",
                  description: "You do not have permission to access this page.",
                  duration: 5000,
               });
              await auth.signOut();
              router.push('/login');
            }
          } else {
             // User doc doesn't exist, something is wrong
            toast({
              variant: "destructive",
              title: "User Not Found",
              description: "Your user profile could not be found in the database.",
            });
            await auth.signOut();
            router.push('/login');
          }
        } catch(e) {
            console.error("Auth check error:", e);
            toast({
              variant: "destructive",
              title: "Authentication Error",
              description: "An error occurred while verifying your credentials.",
            });
            await auth.signOut();
            router.push('/login');
        }
      } else {
        // Not logged in, redirect to login
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, role, toast]);


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
        <p className="ml-2">Verifying access...</p>
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
