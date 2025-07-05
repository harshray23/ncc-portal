import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileDown, FileUp, PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const cadets = [
  { id: 'NCC-001', name: 'Ankit Sharma', rank: 'Cadet', unit: '1 PB BN NCC', status: 'Active' },
  { id: 'NCC-002', name: 'Priya Verma', rank: 'Sgt', unit: '2 HAR NAVAL', status: 'Active' },
  { id: 'NCC-003', name: 'Rahul Singh', rank: 'Cpl', unit: '3 RAJ AIR SQN', status: 'On-Leave' },
  { id: 'NCC-004', name: 'Sneha Gupta', rank: 'Cadet', unit: '1 PB BN NCC', status: 'Active' },
  { id: 'NCC-005', name: 'Amit Kumar', rank: 'LCpl', unit: '4 DELHI GIRLS', status: 'Inactive' },
];

export default function ManageCadetsPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Cadet Roster</CardTitle>
            <CardDescription>View, manage, and update cadet profiles.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><FileDown className="mr-2"/> Download CSV</Button>
            <Button variant="outline"><FileUp className="mr-2"/> Upload CSV</Button>
            <Button><PlusCircle className="mr-2"/> Add Cadet</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Search cadets by name or ID..." className="pl-10" />
            </div>
        </div>
        <div className="overflow-hidden rounded-md border">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Regimental No.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {cadets.map((cadet) => (
                <TableRow key={cadet.id}>
                    <TableCell className="font-medium">{cadet.id}</TableCell>
                    <TableCell>{cadet.name}</TableCell>
                    <TableCell>{cadet.rank}</TableCell>
                    <TableCell>{cadet.unit}</TableCell>
                    <TableCell>
                        <Badge variant={cadet.status === 'Active' ? 'default' : (cadet.status === 'On-Leave' ? 'secondary' : 'destructive')}>
                            {cadet.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>
        <div className="mt-4 flex justify-end">
            <div className="flex gap-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
