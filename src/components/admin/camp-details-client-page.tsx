"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ArrowLeft, Calendar, MapPin, Users, Download, Check, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import * as XLSX from 'xlsx';
import type { Camp, CampRegistration } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { updateRegistrationStatus } from '@/lib/actions/camp.actions';

interface CampDetailsClientPageProps {
  initialCampDetails: {
    camp: Camp;
    registrations: CampRegistration[];
  }
}

export function CampDetailsClientPage({ initialCampDetails }: CampDetailsClientPageProps) {
  const { camp } = initialCampDetails;
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState<CampRegistration[]>(initialCampDetails.registrations);
  
  const handleDownload = () => {
    if (!camp) return;

    const acceptedCadets = registrations.filter(r => r.status === 'Accepted');
    if (acceptedCadets.length === 0) {
        toast({ variant: 'destructive', title: "No Data", description: "There are no accepted cadets to download."});
        return;
    }

    const dataToExport = acceptedCadets.map(reg => {
        return {
            "Name": reg.cadetName,
            "Year": reg.cadetYear,
            "Regimental Number": reg.cadetRegimentalNumber,
        };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrants");
    XLSX.writeFile(workbook, `Camp_Report_${camp.name.replace(/ /g, "_")}.xlsx`);
  };

  const handleRegistrationStatus = async (registrationId: string, status: 'Accepted' | 'Rejected') => {
    const registration = registrations.find(r => r.id === registrationId);
    if (!registration) return;

    const result = await updateRegistrationStatus(registrationId, status, camp.id);

    if (result.success) {
      setRegistrations(prev => 
          prev.map(r => r.id === registrationId ? { ...r, status } : r)
      );
      toast({
          title: `Registration ${status}`,
          description: `The registration for ${registration?.cadetName} has been ${status.toLowerCase()}.`
      });
    } else {
      toast({ variant: 'destructive', title: "Error", description: result.message });
    }
  }
  
  const totalRegistrants = registrations.length;
  const acceptedRegistrants = registrations.filter(r => r.status === 'Accepted').length;

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
                            {registrations.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">No cadets have registered for this camp yet.</TableCell>
                                </TableRow>
                            ) : (
                                registrations.map(reg => (
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
