"use client";

import { useState } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { PlusCircle, Search } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import type { Camp } from "@/lib/types";
import { AddCampDialog } from "@/components/admin/add-camp-dialog";
import { deleteCamp } from "@/lib/actions/camp.actions";

export function CampsClientPage({ initialCamps }: { initialCamps: Camp[] }) {
    const [camps, setCamps] = useState<Camp[]>(initialCamps);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [deletingCamp, setDeletingCamp] = useState<Camp | null>(null);
    const { toast } = useToast();

    const handleDeleteClick = (camp: Camp) => {
        setDeletingCamp(camp);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deletingCamp) return;
        const result = await deleteCamp(deletingCamp.id);
        if (result.success) {
            setCamps(currentCamps => currentCamps.filter(c => c.id !== deletingCamp.id));
            toast({ title: "Success", description: "Camp has been deleted." });
        } else {
            toast({ variant: 'destructive', title: "Error", description: result.message });
        }
        setIsDeleteDialogOpen(false);
        setDeletingCamp(null);
    };

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <CardTitle>Camp Management</CardTitle>
                <CardDescription>Oversee all upcoming, ongoing, and past camps.</CardDescription>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}><PlusCircle className="mr-2"/> Create New Camp</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Search camps by name or location..." className="pl-10" />
            </div>
        </div>
        <div className="overflow-hidden rounded-md border">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Camp ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {camps.map((camp) => (
                <TableRow key={camp.id}>
                    <TableCell className="font-medium">{camp.id}</TableCell>
                    <TableCell>{camp.name}</TableCell>
                    <TableCell>{camp.location}</TableCell>
                    <TableCell>{`${format(new Date(camp.startDate), "dd MMM yyyy")} - ${format(new Date(camp.endDate), "dd MMM yyyy")}`}</TableCell>
                    <TableCell>
                        <Badge variant={camp.status === 'Upcoming' ? 'default' : (camp.status === 'Completed' ? 'secondary' : 'outline')}>
                            {camp.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                    <Link href={`/admin/manage-camps/${camp.id}`} passHref>
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDeleteClick(camp)}>Delete</Button>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>

    <AddCampDialog 
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
    />

    {deletingCamp && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the camp &quot;{deletingCamp.name}&quot; and all related data.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setDeletingCamp(null)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConfirm} className={buttonVariants({ variant: "destructive" })}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )}
    </>
  );
}
