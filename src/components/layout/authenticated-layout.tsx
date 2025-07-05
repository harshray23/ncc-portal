"use client";

import * as React from 'react';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/app-sidebar";
import type { UserRole } from '@/lib/types';
import { ShieldCheck } from 'lucide-react';

export default function AuthenticatedLayout({
  children,
  role
}: {
  children: React.ReactNode;
  role: UserRole;
}) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(true);

  // This is a simple way to derive a title from the pathname
  const getTitle = (path: string) => {
    const segments = path.split('/').filter(Boolean);
    if (segments.length === 0) return 'Dashboard';
    const lastSegment = segments[segments.length - 1];
    return lastSegment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

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
