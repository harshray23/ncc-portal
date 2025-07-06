import { getCampDetails } from '@/lib/actions/camp.actions';
import { CampDetailsClientPage } from '@/components/admin/camp-details-client-page';
import { notFound } from 'next/navigation';

export default async function CampDetailsPage({ params }: { params: { id: string } }) {
  const campDetails = await getCampDetails(params.id);

  if (!campDetails) {
    notFound();
  }

  return <CampDetailsClientPage initialCampDetails={campDetails} />;
}
