"use client";

import { useState } from "react";
import type { UserProfile } from "@/lib/types";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AddStaffDialog } from "@/components/manager/add-staff-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { deleteStaff } from "@/lib/actions/staff.actions";

interface StaffClientPageProps {
  initialAdmins: UserProfile[];
  initialManagers: UserProfile[];
}

export function StaffClientPage({ initialAdmins, initialManagers }: StaffClientPageProps) {
  const [admins, setAdmins] = useState<UserProfile[]>(initialAdmins);
  const [managers, setManagers] = useState<UserProfile[]>(initialManagers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingStaffMember, setDeletingStaffMember] = useState<{ user: UserProfile, role: 'admin' | 'manager' } | null>(null);
  const { toast } = useToast();

  const handleDeleteClick = (user: UserProfile, role: 'admin' | 'manager') => {
    setDeletingStaffMember({ user, role });
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingStaffMember) return;
    const { user, role } = deletingStaffMember;
    const result = await deleteStaff(user.uid, role);

    if (result.success) {
      if (role === 'admin') {
        setAdmins(current => current.filter(u => u.uid !== user.uid));
      } else {
        setManagers(current => current.filter(u => u.uid !== user.uid));
      }
      toast({ title: "Success", description: "Staff member has been deleted." });
    } else {
      toast({ variant: 'destructive', title: "Error", description: result.message });
    }
    setIsDeleteDialogOpen(false);
    setDeletingStaffMember(null);
  };

  const StaffTable = ({ users, role }: { users: UserProfile[], role: 'admin' | 'manager' }) => (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rank</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">No {role}s found.</TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.uid}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.rank}</TableCell>
                <TableCell>{user.unit}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDeleteClick(user, role)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Manage Staff</CardTitle>
              <CardDescription>Add or remove administrators and managers.</CardDescription>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}><PlusCircle className="mr-2"/> Add Staff</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="managers" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="managers">Managers</TabsTrigger>
              <TabsTrigger value="admins">Admins</TabsTrigger>
            </TabsList>
            <TabsContent value="managers" className="mt-4">
              <StaffTable users={managers} role="manager" />
            </TabsContent>
            <TabsContent value="admins" className="mt-4">
              <StaffTable users={admins} role="admin" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <AddStaffDialog 
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
      />

      {deletingStaffMember && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the account for {deletingStaffMember.user.name} and remove their data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeletingStaffMember(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className={buttonVariants({ variant: "destructive" })}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
