import AuthenticatedLayout from '@/components/layout/authenticated-layout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manager Dashboard | CadetLink',
  description: 'Monitor activities and view reports.',
};

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return <AuthenticatedLayout role="manager">{children}</AuthenticatedLayout>;
}
