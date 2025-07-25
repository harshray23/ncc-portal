
"use client";

import { useState } from "react";
import type { UserProfile } from "@/lib/types";
import * as XLSX from 'xlsx';

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileDown, PlusCircle, Search, Save, Trash2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AddCadetDialog } from "@/components/admin/add-cadet-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateCadet, deleteCadet } from "@/lib/actions/user.actions";

export function CadetsClientPage({ initialCadets }: { initialCadets: UserProfile[] }) {
  const [cadets, setCadets] = useState<UserProfile[]>(initialCadets);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCadet, setEditingCadet] = useState<UserProfile | null>(null);
  const [editFormErrors, setEditFormErrors] = useState<Record<string, string[] | undefined>>({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingCadet, setDeletingCadet] = useState<UserProfile | null>(null);
  const { toast } = useToast();

  const handleEditClick = (cadet: UserProfile) => {
    setEditingCadet({ ...cadet });
    setEditFormErrors({});
    setIsEditDialogOpen(true);
  }

  const handleDeleteClick = (cadet: UserProfile) => {
    setDeletingCadet(cadet);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCadet) return;
    const result = await deleteCadet(deletingCadet.uid);
    if (result.success) {
      setCadets(currentCadets => currentCadets.filter(c => c.uid !== deletingCadet.uid));
      toast({ title: "Success", description: "Cadet has been deleted." });
    } else {
      toast({ variant: 'destructive', title: "Error", description: result.message });
    }
    setIsDeleteDialogOpen(false);
    setDeletingCadet(null);
  };

  const handleSave = async () => {
    if (!editingCadet) return;
    setEditFormErrors({});

    const result = await updateCadet(editingCadet);
    if (result.success) {
      setCadets(currentCadets => currentCadets.map(c => c.uid === editingCadet.uid ? editingCadet : c));
      toast({ title: "Success", description: "Cadet details updated." });
      setIsEditDialogOpen(false);
      setEditingCadet(null);
    } else {
      if (result.errors) {
        setEditFormErrors(result.errors);
      }
      toast({ variant: 'destructive', title: "Error", description: result.message });
    }
  }

  const filteredCadets = cadets.filter(cadet => 
    (cadet.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cadet.regimentalNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = () => {
    const dataToExport = filteredCadets.map(cadet => ({
      "Regimental Number": cadet.regimentalNumber,
      "Name": cadet.name,
      "Email": cadet.email,
      "Rank": cadet.rank,
      "Year": cadet.year,
      "Student ID": cadet.studentId,
      "Phone": cadet.phone,
      "WhatsApp": cadet.whatsapp,
      "Registered At": new Date(cadet.createdAt).toLocaleDateString(),
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cadets");
    XLSX.writeFile(workbook, "CadetDetails.xlsx");
  };

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Cadet Roster</CardTitle>
            <CardDescription>View, manage, and add cadet profiles.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownload}><FileDown className="mr-2"/> Download Details (XLSX)</Button>
            <Button onClick={() => setIsAddDialogOpen(true)}><PlusCircle className="mr-2"/> Add Cadet</Button>
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
                <TableHead>Year</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                    </TableCell>
                  </TableRow>
                ) : filteredCadets.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center">No cadets found.</TableCell>
                    </TableRow>
                ) : (
                    filteredCadets.map((cadet) => (
                    <TableRow key={cadet.uid}>
                        <TableCell className="font-medium">{cadet.regimentalNumber}</TableCell>
                        <TableCell>{cadet.name}</TableCell>
                        <TableCell>{cadet.rank}</TableCell>
                        <TableCell>{cadet.year}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleEditClick(cadet)}>Edit</Button>
                           <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDeleteClick(cadet)}>Delete</Button>
                        </TableCell>
                    </TableRow>
                    ))
                )}
            </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>

    {editingCadet && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Cadet: {editingCadet.name}</DialogTitle>
                    <DialogDescription>
                        Modify the details below and click save.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="name-edit" className="text-right pt-2">Name</Label>
                        <div className="col-span-3">
                          <Input id="name-edit" value={editingCadet.name} onChange={(e) => setEditingCadet({...editingCadet, name: e.target.value})} />
                          {editFormErrors?.name && <p className="text-sm text-destructive mt-1">{editFormErrors.name[0]}</p>}
                        </div>
                    </div>
                     <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="email-edit" className="text-right pt-2">Email</Label>
                        <div className="col-span-3">
                          <Input id="email-edit" value={editingCadet.email} disabled />
                        </div>
                    </div>
                     <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="regimentalNumber-edit" className="text-right pt-2">
                            Regimental No.
                        </Label>
                        <div className="col-span-3">
                            <Input 
                                id="regimentalNumber-edit" 
                                value={editingCadet.regimentalNumber} 
                                onChange={(e) => setEditingCadet({...editingCadet, regimentalNumber: e.target.value})}
                                disabled={(editingCadet.regimentalNumberEditCount ?? 0) >= 2}
                            />
                            {editFormErrors?.regimentalNumber && <p className="text-sm text-destructive mt-1">{editFormErrors.regimentalNumber[0]}</p>}
                            <p className="text-xs text-muted-foreground mt-1">
                                {(editingCadet.regimentalNumberEditCount ?? 0) < 2
                                ? `${2 - (editingCadet.regimentalNumberEditCount ?? 0)} edits remaining.`
                                : "No edits remaining."}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="rank-edit" className="text-right pt-2">Rank</Label>
                         <div className="col-span-3">
                            <Input id="rank-edit" value={editingCadet.rank} onChange={(e) => setEditingCadet({...editingCadet, rank: e.target.value})} />
                             {editFormErrors?.rank && <p className="text-sm text-destructive mt-1">{editFormErrors.rank[0]}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="year-edit" className="text-right pt-2">Year</Label>
                        <div className="col-span-3">
                            <Select 
                                value={editingCadet.year?.toString()} 
                                onValueChange={(value) => setEditingCadet({...editingCadet, year: parseInt(value, 10)})}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1st Year</SelectItem>
                                    <SelectItem value="2">2nd Year</SelectItem>
                                    <SelectItem value="3">3rd Year</SelectItem>
                                </SelectContent>
                            </Select>
                             {editFormErrors?.year && <p className="text-sm text-destructive mt-1">{editFormErrors.year[0]}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="phone-edit" className="text-right pt-2">Phone</Label>
                        <div className="col-span-3">
                          <Input id="phone-edit" value={editingCadet.phone} onChange={(e) => setEditingCadet({...editingCadet, phone: e.target.value})} />
                          {editFormErrors?.phone && <p className="text-sm text-destructive mt-1">{editFormErrors.phone[0]}</p>}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" />Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )}
    
    <AddCadetDialog 
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
    />

    {deletingCadet && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the account for {deletingCadet.name} and remove their data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setDeletingCadet(null)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConfirm} className={buttonVariants({ variant: "destructive" })}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )}
    </>
  );
}
