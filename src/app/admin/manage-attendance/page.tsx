"use client";

import { useState, useEffect } from "react";
import * as XLSX from 'xlsx';
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, Download, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { AttendanceData, UserProfile } from "@/lib/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { getAttendanceData, saveAttendance } from "@/lib/actions/attendance.actions";

type AttendanceStatus = "Present" | "Absent" | "Late";

export default function ManageAttendancePage() {
    const { toast } = useToast();
    const [attendanceDate, setAttendanceDate] = useState<Date>(new Date());
    const [filterYear, setFilterYear] = useState<string>("all");
    const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendance = async () => {
            setLoading(true);
            const data = await getAttendanceData(attendanceDate);
            setAttendanceData(data);
            setLoading(false);
        };
        fetchAttendance();
    }, [attendanceDate]);

    const handleStatusChange = (cadetId: string, status: AttendanceStatus) => {
        if (!attendanceData) return;
        const newRecords = { ...attendanceData.records };
        newRecords[cadetId] = { ...newRecords[cadetId], status };
        setAttendanceData({ ...attendanceData, records: newRecords });
    };

    const handleRemarkChange = (cadetId: string, remarks: string) => {
        if (!attendanceData) return;
        const newRecords = { ...attendanceData.records };
        newRecords[cadetId] = { ...newRecords[cadetId], remarks };
        setAttendanceData({ ...attendanceData, records: newRecords });
    };
    
    const handleSave = async () => {
        if (!attendanceData) return;
        const result = await saveAttendance(attendanceDate, attendanceData.records);
        if (result.success) {
            toast({
                title: "Attendance Saved",
                description: "The attendance records have been successfully saved.",
            });
        } else {
            toast({
                variant: 'destructive',
                title: "Save Failed",
                description: result.message,
            });
        }
    };

    const filteredCadets = attendanceData?.cadets.filter(cadet => {
        if (filterYear === "all") return true;
        return cadet.year === parseInt(filterYear, 10);
    }) || [];

    const handleDownload = () => {
        if (!attendanceData) return;
        const dataToExport = filteredCadets.map(cadet => {
            const record = attendanceData.records[cadet.uid];
            return {
                "Date": format(attendanceDate, "yyyy-MM-dd"),
                "Regimental Number": cadet.regimentalNumber,
                "Name": cadet.name,
                "Rank": cadet.rank,
                "Year": cadet.year,
                "Status": record.status,
                "Remarks": record.remarks,
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
        XLSX.writeFile(workbook, `Attendance_${format(attendanceDate, "yyyy-MM-dd")}.xlsx`);
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <CardTitle>Manage Attendance</CardTitle>
                        <CardDescription>Mark and track cadet attendance for events.</CardDescription>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full sm:w-[240px] justify-start text-left font-normal",
                                    !attendanceDate && "text-muted-foreground"
                                )}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {attendanceDate ? format(attendanceDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                mode="single"
                                selected={attendanceDate}
                                onSelect={(date) => date && setAttendanceDate(date)}
                                initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                         <Button onClick={handleDownload} variant="outline"><Download className="mr-2" /> Download Report</Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                 <div className="mb-4 flex items-center gap-2">
                    <Label htmlFor="year-filter">Filter by Year:</Label>
                    <Select value={filterYear} onValueChange={setFilterYear}>
                      <SelectTrigger id="year-filter" className="w-[180px]">
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
                 <div className="overflow-hidden rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Cadet Name</TableHead>
                                <TableHead>Regimental No.</TableHead>
                                <TableHead>Year</TableHead>
                                <TableHead className="w-[150px]">Status</TableHead>
                                <TableHead>Remarks</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-48"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></TableCell>
                                </TableRow>
                            ) : filteredCadets.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">No cadets found for this year.</TableCell>
                                </TableRow>
                            ) : (
                                filteredCadets.map(cadet => (
                                    <TableRow key={cadet.uid}>
                                        <TableCell className="font-medium">{cadet.name}</TableCell>
                                        <TableCell>{cadet.regimentalNumber}</TableCell>
                                        <TableCell>{cadet.year}</TableCell>
                                        <TableCell>
                                            <Select
                                                value={attendanceData?.records[cadet.uid]?.status}
                                                onValueChange={(value: AttendanceStatus) => handleStatusChange(cadet.uid, value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Present">Present</SelectItem>
                                                    <SelectItem value="Absent">Absent</SelectItem>
                                                    <SelectItem value="Late">Late</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                placeholder="Add a reason..."
                                                value={attendanceData?.records[cadet.uid]?.remarks || ''}
                                                onChange={(e) => handleRemarkChange(cadet.uid, e.target.value)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
                 <div className="mt-6 flex justify-end">
                    <Button onClick={handleSave}><Save className="mr-2" />Save Attendance</Button>
                </div>
            </CardContent>
        </Card>
    );
}
