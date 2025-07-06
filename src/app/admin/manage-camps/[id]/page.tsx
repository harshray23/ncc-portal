"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ArrowLeft, Calendar, MapPin, Users, Download } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import * as XLSX from 'xlsx';
import type { UserProfile } from "@/lib/types";

const camps = [
  { id: 'CAMP-01', name: 'Annual Training Camp', location: 'Ropar, Punjab', startDate: new Date(2024, 7, 1), endDate: new Date(2024, 7, 10), status: 'Upcoming', description: "A comprehensive 10-day camp focusing on drill, weapon training, and map reading.", registrants: 120 },
  { id: 'CAMP-02', name: 'Thal Sainik Camp', location: 'Delhi Cantt', startDate: new Date(2024, 8, 15), endDate: new Date(2024, 8, 25), status: 'Upcoming', description: "National level camp for shooting, obstacle course, and other competitions.", registrants: 95 },
  { id: 'CAMP-03', name: 'Basic Leadership Camp', location: 'Dehradun, UK', startDate: new Date(2024, 5, 20), endDate: new Date(2024, 5, 30), status: 'Completed', description: "Develop leadership qualities and decision-making skills.", registrants: 80 },
  { id: 'CAMP-04', name: 'Republic Day Camp', location: 'Delhi', startDate: new Date(2024, 0, 1), endDate: new Date(2024, 0, 29), status: 'Completed', description: "The most prestigious camp, involving parades and cultural events at the national level.", registrants: 50 },
  { id: 'CAMP-05', name: 'Rock Climbing Camp', location: 'Manali, HP', startDate: new Date(2024, 9, 5), endDate: new Date(2024, 9, 15), status: 'Planning', description: "An adventure camp designed to build courage and physical fitness.", registrants: 45 },
];

const mockRegisteredCadets: UserProfile[] = [
  { uid: 'cadet-1', name: 'Ankit Sharma', email: 'ankit.sharma@example.com', role: 'cadet', regimentalNumber: 'PB20SDA123456', studentId: '20BCS1024', rank: 'Cadet', phone: '1234567890', whatsapp: '1234567890', approved: true, createdAt: new Date(), year: 2 },
  { uid: 'cadet-2', name: 'Priya Verma', email: 'priya.verma@example.com', role: 'cadet', regimentalNumber: 'PB20SDA123457', studentId: '20BCS1025', rank: 'Cadet', phone: '1234567890', whatsapp: '1234567890', approved: true, createdAt: new Date(), year: 2 },
  { uid: 'cadet-3', name: 'Rahul Singh', email: 'rahul.singh@example.com', role: 'cadet', regimentalNumber: 'PB20SDA123458', studentId: '20BCS1026', rank: 'Lance Corporal', phone: '1234567890', whatsapp: '1234567890', approved: true, createdAt: new Date(), year: 1 },
];


export default function CampDetailsPage({ params }: { params: { id: string } }) {
  const camp = camps.find(c => c.id === params.id);

  const handleDownload = () => {
      if (!camp) return;

      const dataToExport = mockRegisteredCadets.map(cadet => ({
          "Name": cadet.name,
          "Year": cadet.year,
          "Regimental Number": cadet.regimentalNumber,
          "Phone": cadet.phone,
          "Email": cadet.email,
      }));

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Registrants");
      XLSX.writeFile(workbook, `Camp_Report_${camp.name.replace(/ /g, "_")}.xlsx`);
  };

  if (!camp) {
    return (
        <div className="text-center">
            <h1 className="text-2xl font-bold">Camp Not Found</h1>
            <p className="text-muted-foreground">The camp you are looking for does not exist.</p>
            <Link href="/admin/manage-camps" passHref>
                <Button variant="link" className="mt-4"><ArrowLeft className="mr-2" /> Back to Camps</Button>
            </Link>
        </div>
    )
  }

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <Link href="/admin/manage-camps" passHref>
                <Button variant="outline"><ArrowLeft className="mr-2" /> Back to Camp List</Button>
            </Link>
            <Button onClick={handleDownload}><Download className="mr-2"/> Download Report</Button>
        </div>
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <CardTitle className="text-3xl">{camp.name}</CardTitle>
                        <CardDescription>{camp.description}</CardDescription>
                    </div>
                    <Badge variant={camp.status === 'Upcoming' ? 'default' : (camp.status === 'Completed' ? 'secondary' : 'outline')}>
                        {camp.status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-md border p-4">
                        <Calendar className="h-6 w-6 text-primary" />
                        <div>
                            <p className="font-semibold">Camp Dates</p>
                            <p className="text-muted-foreground">{`${format(camp.startDate, "dd MMM yyyy")} to ${format(camp.endDate, "dd MMM yyyy")}`}</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-3 rounded-md border p-4">
                        <MapPin className="h-6 w-6 text-primary" />
                        <div>
                            <p className="font-semibold">Location</p>
                            <p className="text-muted-foreground">{camp.location}</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-3 rounded-md border p-4">
                        <Users className="h-6 w-6 text-primary" />
                        <div>
                            <p className="font-semibold">Registrants</p>
                            <p className="text-muted-foreground">{camp.registrants} Cadets</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
