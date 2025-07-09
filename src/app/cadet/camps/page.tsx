"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { getCampsForCadet } from "@/lib/actions/camp.actions";
import { CampsClientPage } from "@/components/cadet/camps-client-page";
import type { Camp, CampRegistration, UserProfile } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function CampsPage() {
  const { user } = useAuth();
  const [campsData, setCampsData] = useState<{
    camps: Camp[];
    registrations: CampRegistration[];
  } | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (user) {
        setLoadingData(true);
        const data = await getCampsForCadet(user.uid);
        setCampsData(data);
        setLoadingData(false);
      }
    }
    fetchData();
  }, [user]);

  if (!user) {
    // This part is handled by the AuthenticatedLayout, which will show a loader
    // or an access denied message. Returning null prevents a flash of content.
    return null;
  }

  if (loadingData) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex items-center gap-4 text-xl font-semibold text-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
          Loading Camps...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Upcoming Camps</h1>
        <p className="text-muted-foreground">
          Explore and register for the latest camps and training programs.
        </p>
      </div>
      {campsData && campsData.camps.length > 0 ? (
        <CampsClientPage
          initialCamps={campsData.camps}
          initialRegistrations={campsData.registrations}
          currentUser={user as UserProfile}
        />
      ) : (
        <div className="flex justify-center items-center text-center text-muted-foreground p-8 bg-card rounded-lg">
          <p>There are no upcoming camps scheduled at this time.</p>
        </div>
      )}
    </div>
  );
}
