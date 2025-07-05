import { CampCard } from "@/components/cadet/camp-card";
import { type Camp } from "@/lib/types";

const camps: Camp[] = [
  {
    id: 'camp-1',
    title: "Annual Training Camp",
    location: "Ropar, Punjab",
    startDate: new Date(2024, 7, 1),
    endDate: new Date(2024, 7, 10),
    description: "A comprehensive 10-day camp focusing on drill, weapon training, and map reading.",
    registrationLink: "https://example.com/register/atc2024",
  },
  {
    id: 'camp-2',
    title: "Thal Sainik Camp",
    location: "Delhi Cantt, Delhi",
    startDate: new Date(2024, 8, 15),
    endDate: new Date(2024, 8, 25),
    description: "National level camp for shooting, obstacle course, and other competitions.",
    registrationLink: "https://example.com/register/tsc2024",
  },
  {
    id: 'camp-3',
    title: "Rock Climbing Camp",
    location: "Manali, Himachal Pradesh",
    startDate: new Date(2024, 9, 5),
    endDate: new Date(2024, 9, 15),
    description: "An adventure camp designed to build courage and physical fitness.",
    registrationLink: "https://phishing-site.com/register/rcc2024",
  },
   {
    id: 'camp-4',
    title: "Basic Leadership Camp",
    location: "Dehradun, Uttarakhand",
    startDate: new Date(2024, 10, 20),
    endDate: new Date(2024, 10, 30),
    description: "Develop leadership qualities and decision-making skills.",
    registrationLink: "https://example.com/register/blc2024",
  },
];

export default function CampsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Upcoming Camps</h1>
        <p className="text-muted-foreground">
          Explore and register for the latest camps and training programs.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {camps.map((camp) => (
          <CampCard key={camp.id} camp={camp} />
        ))}
      </div>
    </div>
  );
}
