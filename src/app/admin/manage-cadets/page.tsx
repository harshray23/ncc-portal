"use client";

import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { UserProfile } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileDown, FileUp, PlusCircle, Search, CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { approveCadet } from "@/lib/actions/user.actions";

function ApproveButton({ userId }: { userId: string }) {
  const [isApproving, setIsApproving] = useState(false);
  const { toast } = useToast();

  const handleApprove = async () => {
    setIsApproving(true);
    const result = await approveCadet(userId);
    if (result.success) {
      toast({ title: "Success", description: result.message });
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
    setIsApproving(false);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleApprove} disabled={isApproving}>
      {isApproving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
      {isApproving ? "Approving..." : "Approve"}
    </Button>
  );
}

export default function ManageCadetsPage() {
  const [cadets, setCadets] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, "users"), where("role", "==", "cadet"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const cadetsData: UserProfile[] = [];
      querySnapshot.forEach((doc) => {
        cadetsData.push({ uid: doc.id, ...doc.data() } as UserProfile);
      });
      setCadets(cadetsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching cadets: ", error);
      toast({ variant: "destructive", title: "Error", description: "Could not fetch cadet data." });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);
  
  const filteredCadets = cadets.filter(cadet => 
    cadet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cadet.regimentalNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Cadet Roster</CardTitle>
            <CardDescription>View, manage, and approve cadet profiles.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><FileDown className="mr-2"/> Download CSV</Button>
            <Button variant="outline"><FileUp className="mr-2"/> Upload CSV</Button>
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
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center">
                            <Loader2 className="mx-auto my-4 h-6 w-6 animate-spin" />
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
                        <TableCell>
                            <Badge variant={cadet.approved ? 'default' : 'destructive'}>
                                {cadet.approved ? 'Approved' : 'Pending'}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                        {!cadet.approved ? (
                          <ApproveButton userId={cadet.uid} />
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
