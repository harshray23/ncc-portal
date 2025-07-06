import { CampCard } from "@/components/cadet/camp-card";
import { getCampsForCadet } from "@/lib/actions/camp.actions";
import { getCurrentUser } from "@/lib/auth";
import { CampsClientPage } from "@/components/cadet/camps-client-page";

export default async function CampsPage() {
  const user = await getCurrentUser();
  if (!user) {
    // This should be handled by middleware in a real app
    return <p>Please log in.</p>;
  }

  const { camps, registrations } = await getCampsForCadet(user.uid);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Upcoming Camps</h1>
        <p className="text-muted-foreground">
          Explore and register for the latest camps and training programs.
        </p>
      </div>
      <CampsClientPage 
        initialCamps={camps} 
        initialRegistrations={registrations} 
        currentUser={user}
      />
    </div>
  );
}
