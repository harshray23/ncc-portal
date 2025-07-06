"use client";

import { CampCard } from "@/components/cadet/camp-card";
import { type Camp, type CampRegistration } from "@/lib/types";
import { useState } from "react";

const initialCamps: Camp[] = [
  { id: 'CAMP-01', name: 'Annual Training Camp', location: 'Ropar, Punjab', startDate: new Date(2024, 7, 1), endDate: new Date(2024, 7, 10), status: 'Upcoming', description: "A comprehensive 10-day camp focusing on drill, weapon training, and map reading." },
  { id: 'CAMP-02', name: 'Thal Sainik Camp', location: 'Delhi Cantt', startDate: new Date(2024, 8, 15), endDate: new Date(2024, 8, 25), status: 'Upcoming', description: "National level camp for shooting, obstacle course, and other competitions." },
  { id: 'CAMP-03', name: 'Rock Climbing Camp', location: 'Manali, HP', startDate: new Date(2024, 9, 5), endDate: new Date(2024, 9, 15), status: 'Upcoming', description: "An adventure camp designed to build courage and physical fitness." },
  { id: 'CAMP-04', name: 'Basic Leadership Camp', location: 'Dehradun, UK', startDate: new Date(2024, 10, 20), endDate: new Date(2024, 10, 30), status: 'Upcoming', description: "Develop leadership qualities and decision-making skills." },
];

const initialRegistrations: CampRegistration[] = [
    { id: 'reg-2', campId: 'CAMP-01', cadetId: 'cadet-1', cadetName: 'Cdt. Harsh Home', cadetYear: 2, cadetRegimentalNumber: 'PB20SDA123457', status: 'Accepted', registeredAt: new Date() },
    { id: 'reg-3', campId: 'CAMP-02', cadetId: 'cadet-1', cadetName: 'Cdt. Harsh Home', cadetYear: 2, cadetRegimentalNumber: 'PB20SDA123457', status: 'Rejected', registeredAt: new Date() },
];


export default function CampsPage() {
  // This state would typically be managed by a global state manager or fetched from an API
  const [camps, setCamps] = useState<Camp[]>(initialCamps);
  const [registrations, setRegistrations] = useState<CampRegistration[]>(initialRegistrations);
  
  // Assume current cadet ID
  const currentCadetId = 'cadet-1';

  const handleRegister = (newRegistration: Omit<CampRegistration, 'id' | 'registeredAt'>) => {
    const registration: CampRegistration = {
      ...newRegistration,
      id: `reg-${Date.now()}`,
      registeredAt: new Date(),
    };
    setRegistrations(prev => [...prev, registration]);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Upcoming Camps</h1>
        <p className="text-muted-foreground">
          Explore and register for the latest camps and training programs.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {camps.filter(c => c.status === 'Upcoming').map((camp) => {
            const existingRegistration = registrations.find(r => r.campId === camp.id && r.cadetId === currentCadetId);
            return (
                <CampCard 
                    key={camp.id} 
                    camp={camp}
                    registrationStatus={existingRegistration?.status}
                    onRegister={handleRegister}
                />
            );
        })}
      </div>
    </div>
  );
}
