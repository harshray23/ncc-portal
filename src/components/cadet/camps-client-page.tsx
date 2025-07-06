"use client";

import { CampCard } from "@/components/cadet/camp-card";
import { type Camp, type CampRegistration, type UserProfile } from "@/lib/types";
import { useState } from "react";
import { registerForCamp } from "@/lib/actions/camp.actions";
import { useToast } from "@/hooks/use-toast";

interface CampsClientPageProps {
    initialCamps: Camp[];
    initialRegistrations: CampRegistration[];
    currentUser: UserProfile;
}

export function CampsClientPage({ initialCamps, initialRegistrations, currentUser }: CampsClientPageProps) {
  const [camps, setCamps] = useState<Camp[]>(initialCamps);
  const [registrations, setRegistrations] = useState<CampRegistration[]>(initialRegistrations);
  const { toast } = useToast();

  const handleRegister = async (campId: string) => {
    const result = await registerForCamp(campId, currentUser);
    if (result.success) {
        toast({
            title: "Registration Submitted!",
            description: `Your registration is pending approval.`,
        });
        // Optimistically update UI
        const newRegistration: CampRegistration = {
            id: `temp-${Date.now()}`,
            campId,
            cadetId: currentUser.uid,
            cadetName: currentUser.name,
            cadetRegimentalNumber: currentUser.regimentalNumber,
            cadetYear: currentUser.year,
            status: 'Pending',
            registeredAt: new Date().toISOString(),
        };
        setRegistrations(prev => [...prev, newRegistration]);
    } else {
        toast({
            variant: 'destructive',
            title: 'Registration Failed',
            description: result.message
        });
    }
  };

  return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {camps.map((camp) => {
            const existingRegistration = registrations.find(r => r.campId === camp.id);
            return (
                <CampCard 
                    key={camp.id} 
                    camp={camp}
                    registrationStatus={existingRegistration?.status}
                    onRegister={() => handleRegister(camp.id)}
                    currentUser={currentUser}
                />
            );
        })}
      </div>
  );
}
