"use client";

import { useState } from "react";
import type { UserProfile } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap } from "lucide-react";
import { Label } from "@/components/ui/label";

// Using the same mock data source for consistency, but will need to be managed with state here
const mockCadets: UserProfile[] = [
  { uid: 'cadet-1', name: 'Ankit Sharma', email: 'ankit.sharma@example.com', role: 'cadet', regimentalNumber: 'PB20SDA123456', studentId: '20BCS1024', rank: 'Cadet', phone: '1234567890', whatsapp: '1234567890', approved: true, createdAt: new Date(), year: 2 },
  { uid: 'cadet-2', name: 'Priya Verma', email: 'priya.verma@example.com', role: 'cadet', regimentalNumber: 'PB20SDA123457', studentId: '20BCS1025', rank: 'Cadet', phone: '1234567890', whatsapp: '1234567890', approved: true, createdAt: new Date(), year: 2 },
  { uid: 'cadet-3', name: 'Rahul Singh', email: 'rahul.singh@example.com', role: 'cadet', regimentalNumber: 'PB20SDA123458', studentId: '20BCS1026', rank: 'Lance Corporal', phone: '1234567890', whatsapp: '1234567890', approved: true, createdAt: new Date(), year: 1 },
  { uid: 'cadet-4', name: 'Sneha Gupta', email: 'sneha.gupta@example.com', role: 'cadet', regimentalNumber: 'PB20SWA987654', studentId: '20BCS1027', rank: 'Cadet', phone: '1234567890', whatsapp: '1234567890', approved: true, createdAt: new Date(), year: 1 },
];

export default function ManageCadetYearPage() {
  const { toast } = useToast();
  const [cadets, setCadets] = useState<UserProfile[]>(mockCadets);
  const [selectedCadetUids, setSelectedCadetUids] = useState<string[]>([]);
  const [targetYear, setTargetYear] = useState<string>("");
  const [filterYear, setFilterYear] = useState<string>("all");

  const filteredCadets = cadets.filter(cadet => {
    if (filterYear === "all") return true;
    return cadet.year === parseInt(filterYear, 10);
  });

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedCadetUids(filteredCadets.map(c => c.uid));
    } else {
      setSelectedCadetUids([]);
    }
  };

  const handleSelectOne = (uid: string, checked: boolean) => {
    if (checked) {
      setSelectedCadetUids(prev => [...prev, uid]);
    } else {
      setSelectedCadetUids(prev => prev.filter(id => id !== uid));
    }
  };

  const handleUpdateYears = () => {
    if (!targetYear) {
      toast({ variant: "destructive", title: "Error", description: "Please select a target year." });
      return;
    }
    if (selectedCadetUids.length === 0) {
      toast({ variant: "destructive", title: "Error", description: "Please select at least one cadet." });
      return;
    }

    setCadets(prevCadets =>
      prevCadets.map(cadet =>
        selectedCadetUids.includes(cadet.uid)
          ? { ...cadet, year: parseInt(targetYear, 10) }
          : cadet
      )
    );

    toast({ title: "Success", description: `${selectedCadetUids.length} cadet(s) updated to ${targetYear}${targetYear === '1' ? 'st' : targetYear === '2' ? 'nd' : 'rd'} year.` });
    setSelectedCadetUids([]);
  };
  
  const isAllOnPageSelected = filteredCadets.length > 0 && selectedCadetUids.length > 0 && filteredCadets.every(fc => selectedCadetUids.includes(fc.uid));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Cadet Year</CardTitle>
        <CardDescription>Bulk update the academic year for cadets. This is typically done at the start of a new session.</CardDescription>
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Select value={targetYear} onValueChange={setTargetYear}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Set Year To..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1st Year</SelectItem>
              <SelectItem value="2">2nd Year</SelectItem>
              <SelectItem value="3">3rd Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleUpdateYears} disabled={selectedCadetUids.length === 0 || !targetYear}>
            <GraduationCap className="mr-2" />
            Update {selectedCadetUids.length} Selected
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="filter-year">Filter by Year:</Label>
            <Select value={filterYear} onValueChange={setFilterYear}>
              <SelectTrigger id="filter-year" className="w-[180px]">
                <SelectValue placeholder="Filter by year..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="1">1st Year</SelectItem>
                <SelectItem value="2">2nd Year</SelectItem>
                <SelectItem value="3">3rd Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={isAllOnPageSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>Cadet Name</TableHead>
                <TableHead>Regimental No.</TableHead>
                <TableHead>Current Year</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCadets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No cadets found for this filter.</TableCell>
                </TableRow>
              ) : (
                filteredCadets.map(cadet => (
                  <TableRow key={cadet.uid} data-state={selectedCadetUids.includes(cadet.uid) && "selected"}>
                    <TableCell>
                      <Checkbox
                        checked={selectedCadetUids.includes(cadet.uid)}
                        onCheckedChange={(checked) => handleSelectOne(cadet.uid, !!checked)}
                        aria-label={`Select ${cadet.name}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{cadet.name}</TableCell>
                    <TableCell>{cadet.regimentalNumber}</TableCell>
                    <TableCell>{cadet.year} {cadet.year === 1 ? 'st' : cadet.year === 2 ? 'nd' : 'rd'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
