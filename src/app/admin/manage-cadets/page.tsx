"use client";

import { useState } from "react";
import type { UserProfile } from "@/lib/types";
import * as XLSX from 'xlsx';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileDown, PlusCircle, Search, CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const mockCadets: UserProfile[] = [
  { uid: 'cadet-1', name: 'Ankit Sharma', email: 'ankit.sharma@example.com', role: 'cadet', regimentalNumber: 'PB20SDA123456', studentId: '20BCS1024', rank: 'Cadet', phone: '1234567890', whatsapp: '1234567890', approved: true, createdAt: new Date() },
  { uid: 'cadet-2', name: 'Priya Verma', email: 'priya.verma@example.com', role: 'cadet', regimentalNumber: 'PB20SDA123457', studentId: '20BCS1025', rank: 'Cadet', phone: '1234567890', whatsapp: '1234567890', approved: false, createdAt: new Date() },
  { uid: 'cadet-3', name: 'Rahul Singh', email: 'rahul.singh@example.com', role: 'cadet', regimentalNumber: 'PB20SDA123458', studentId: '20BCS1026', rank: 'Lance Corporal', phone: '1234567890', whatsapp: '1234567890', approved: true, createdAt: new Date() },
  { uid: 'cadet-4', name: 'Sneha Gupta', email: 'sneha.gupta@example.com', role: 'cadet', regimentalNumber: 'PB20SWA987654', studentId: '20BCS1027', rank: 'Cadet', phone: '1234567890', whatsapp: '1234567890', approved: false, createdAt: new Date() },
];


function ApproveButton({ onApprove }: { onApprove: () => void }) {
  const [isApproving, setIsApproving] = useState(false);
  
  const handleApprove = () => {
    setIsApproving(true);
    setTimeout(() => {
        onApprove();
        setIsApproving(false);
    }, 1000)
  };

  return (
    <Button variant="outline" size="sm" onClick={handleApprove} disabled={isApproving}>
      {isApproving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
      {isApproving ? "Approving..." : "Approve"}
    </Button>
  );
}

export default function ManageCadetsPage() {
  const [cadets, setCadets] = useState<UserProfile[]>(mockCadets);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const handleApproveCadet = (uid: string) => {
    setCadets(currentCadets => 
        currentCadets.map(cadet => 
            cadet.uid === uid ? { ...cadet, approved: true } : cadet
        )
    );
    toast({ title: "Success", description: "Cadet approved successfully." });
  }

  const filteredCadets = cadets.filter(cadet => 
    cadet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cadet.regimentalNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = () => {
    const dataToExport = filteredCadets.map(cadet => ({
      "Regimental Number": cadet.regimentalNumber,
      "Name": cadet.name,
      "Email": cadet.email,
      "Rank": cadet.rank,
      "Student ID": cadet.studentId,
      "Phone": cadet.phone,
      "WhatsApp": cadet.whatsapp,
      "Status": cadet.approved ? 'Approved' : 'Pending',
      "Registered At": cadet.createdAt.toLocaleDateString(),
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cadets");
    XLSX.writeFile(workbook, "CadetDetails.xlsx");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Cadet Roster</CardTitle>
            <CardDescription>View, manage, and approve cadet profiles.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownload}><FileDown className="mr-2"/> Download Details (XLSX)</Button>
            <Button disabled><PlusCircle className="mr-2"/> Add Cadet</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    placeholder="Search cadets by name or ID..." 
                    className="pl-10" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
        <div className="overflow-hidden rounded-md border">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Regimental No.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredCadets.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center">No cadets found.</TableCell>
                    </TableRow>
                ) : (
                    filteredCadets.map((cadet) => (
                    <TableRow key={cadet.uid}>
                        <TableCell className="font-medium">{cadet.regimentalNumber}</TableCell>
                        <TableCell>{cadet.name}</TableCell>
                        <TableCell>{cadet.rank}</TableCell>
                        <TableCell>
                            <Badge variant={cadet.approved ? 'default' : 'destructive'}>
                                {cadet.approved ? 'Approved' : 'Pending'}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                        {!cadet.approved ? (
                          <ApproveButton onApprove={() => handleApproveCadet(cadet.uid)} />
                        ) : (
                          <Button variant="ghost" size="sm">Edit</Button>
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
  );
}
