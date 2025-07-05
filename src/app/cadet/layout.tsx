import AuthenticatedLayout from '@/components/layout/authenticated-layout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cadet Portal | CadetLink',
  description: 'Your personal dashboard for all NCC activities.',
};

export default function CadetLayout({ children }: { children: React.ReactNode }) {
  return <AuthenticatedLayout role="cadet">{children}</AuthenticatedLayout>;
}
