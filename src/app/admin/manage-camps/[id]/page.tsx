"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ArrowLeft, Calendar, MapPin, Users, Download, Check, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import * as XLSX from 'xlsx';
import type { Camp, CampRegistration, UserProfile } from "@/lib/types";
import { useParams } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

const camps: Camp[] = [
  { id: 'CAMP-01', name: 'Annual Training Camp', location: 'Ropar, Punjab', startDate: new Date(2024, 7, 1), endDate: new Date(2024, 7, 10), status: 'Upcoming', description: "A comprehensive 10-day camp focusing on drill, weapon training, and map reading." },
  { id: 'CAMP-02', name: 'Thal Sainik Camp', location: 'Delhi Cantt', startDate: new Date(2024, 8, 15), endDate: new Date(2024, 8, 25), status: 'Upcoming', description: "National level camp for shooting, obstacle course, and other competitions." },
  { id: 'CAMP-03', name: 'Basic Leadership Camp', location: 'Dehradun, UK', startDate: new Date(2024, 5, 20), endDate: new Date(2024, 5, 30), status: 'Completed', description: "Develop leadership qualities and decision-making skills." },
  { id: 'CAMP-04', name: 'Republic Day Camp', location: 'Delhi', startDate: new Date(2024, 0, 1), endDate: new Date(2024, 0, 29), status: 'Completed', description: "The most prestigious camp, involving parades and cultural events at the national level." },
  { id: 'CAMP-05', name: 'Rock Climbing Camp', location: 'Manali, HP', startDate: new Date(2024, 9, 5), endDate: new Date(2024, 9, 15), status: 'Planning', description: "An adventure camp designed to build courage and physical fitness." },
];

const mockCadets: UserProfile[] = [
  { uid: 'cadet-1', name: 'Ankit Sharma', email: 'ankit.sharma@example.com', role: 'cadet', regimentalNumber: 'PB20SDA123456', studentId: '20BCS1024', rank: 'Cadet', phone: '1234567890', whatsapp: '1234567890', approved: true, createdAt: new Date(), year: 2 },
  { uid: 'cadet-2', name: 'Priya Verma', email: 'priya.verma@example.com', role: 'cadet', regimentalNumber: 'PB20SDA123457', studentId: '20BCS1025', rank: 'Cadet', phone: '1234567890', whatsapp: '1234567890', approved: true, createdAt: new Date(), year: 2 },
  { uid: 'cadet-3', name: 'Rahul Singh', email: 'rahul.singh@example.com', role: 'cadet', regimentalNumber: 'PB20SDA123458', studentId: '20BCS1026', rank: 'Lance Corporal', phone: '1234567890', whatsapp: '1234567890', approved: true, createdAt: new Date(), year: 1 },
];

const initialRegistrations: CampRegistration[] = [
    { id: 'reg-1', campId: 'CAMP-01', cadetId: 'cadet-1', cadetName: 'Ankit Sharma', cadetYear: 2, cadetRegimentalNumber: 'PB20SDA123456', status: 'Pending', registeredAt: new Date() },
    { id: 'reg-2', campId: 'CAMP-01', cadetId: 'cadet-2', cadetName: 'Priya Verma', cadetYear: 2, cadetRegimentalNumber: 'PB20SDA123457', status: 'Accepted', registeredAt: new Date() },
    { id: 'reg-3', campId: 'CAMP-01', cadetId: 'cadet-3', cadetName: 'Rahul Singh', cadetYear: 1, cadetRegimentalNumber: 'PB20SDA123458', status: 'Pending', registeredAt: new Date() },
    { id: 'reg-4', campId: 'CAMP-02', cadetId: 'cadet-1', cadetName: 'Ankit Sharma', cadetYear: 2, cadetRegimentalNumber: 'PB20SDA123456', status: 'Accepted', registeredAt: new Date() },
    { id: 'reg-5', campId: 'CAMP-02', cadetId: 'cadet-3', cadetName: 'Rahul Singh', cadetYear: 1, cadetRegimentalNumber: 'PB20SDA123458', status: 'Rejected', registeredAt: new Date() },
];

export default function CampDetailsPage() {
  const params = useParams();
  const camp = camps.find(c => c.id === params.id);
  const { toast } = useToast();

  const [registrations, setRegistrations] = useState<CampRegistration[]>(initialRegistrations);
  
  const campRegistrations = registrations.filter(r => r.campId === camp?.id);
  
  const handleDownload = () => {
    if (!camp) return;

    const acceptedCadets = campRegistrations.filter(r => r.status === 'Accepted');
    if (acceptedCadets.length === 0) {
        toast({ variant: 'destructive', title: "No Data", description: "There are no accepted cadets to download."});
        return;
    }

    const dataToExport = acceptedCadets.map(reg => {
        const cadetInfo = mockCadets.find(c => c.uid === reg.cadetId);
        return {
            "Name": reg.cadetName,
            "Year": reg.cadetYear,
            "Regimental Number": reg.cadetRegimentalNumber,
            "Phone": cadetInfo?.phone || 'N/A',
            "Email": cadetInfo?.email || 'N/A',
        };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrants");
    XLSX.writeFile(workbook, `Camp_Report_${camp.name.replace(/ /g, "_")}.xlsx`);
  };

  const handleRegistrationStatus = (registrationId: string, status: 'Accepted' | 'Rejected') => {
    const registration = registrations.find(r => r.id === registrationId);
    setRegistrations(prev => 
        prev.map(r => r.id === registrationId ? { ...r, status } : r)
    );
    toast({
        title: `Registration ${status}`,
        description: `The registration for ${registration?.cadetName} has been ${status.toLowerCase()}.`
    });
  }

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
  
  const totalRegistrants = campRegistrations.length;
  const acceptedRegistrants = campRegistrations.filter(r => r.status === 'Accepted').length;

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
                <div className="grid gap-4 md:grid-cols-3">
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
                            <p className="font-semibold">Registrations</p>
                            <p className="text-muted-foreground">{acceptedRegistrants} Accepted / {totalRegistrants} Total</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Manage Registrations</CardTitle>
                <CardDescription>Approve or reject cadet registrations for this camp.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Cadet Name</TableHead>
                                <TableHead>Year</TableHead>
                                <TableHead>Regimental No.</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {campRegistrations.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">No cadets have registered for this camp yet.</TableCell>
                                </TableRow>
                            ) : (
                                campRegistrations.map(reg => (
                                    <TableRow key={reg.id}>
                                        <TableCell className="font-medium">{reg.cadetName}</TableCell>
                                        <TableCell>{reg.cadetYear}</TableCell>
                                        <TableCell>{reg.cadetRegimentalNumber}</TableCell>
                                        <TableCell>
                                             <Badge variant={reg.status === 'Accepted' ? 'default' : reg.status === 'Rejected' ? 'destructive' : 'secondary'}>
                                                {reg.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {reg.status === 'Pending' && (
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700" onClick={() => handleRegistrationStatus(reg.id, 'Accepted')}>
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700" onClick={() => handleRegistrationStatus(reg.id, 'Rejected')}>
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
