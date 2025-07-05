import AuthenticatedLayout from '@/components/layout/authenticated-layout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | CadetLink',
  description: 'Manage cadets, camps, and system settings.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AuthenticatedLayout role="admin">{children}</AuthenticatedLayout>;
}
