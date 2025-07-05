import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";

const camps = [
  { id: 'CAMP-01', name: 'Annual Training Camp', location: 'Ropar, Punjab', startDate: new Date(2024, 7, 1), endDate: new Date(2024, 7, 10), status: 'Upcoming', description: "A comprehensive 10-day camp focusing on drill, weapon training, and map reading." },
  { id: 'CAMP-02', name: 'Thal Sainik Camp', location: 'Delhi Cantt', startDate: new Date(2024, 8, 15), endDate: new Date(2024, 8, 25), status: 'Upcoming', description: "National level camp for shooting, obstacle course, and other competitions." },
  { id: 'CAMP-03', name: 'Basic Leadership Camp', location: 'Dehradun, UK', startDate: new Date(2024, 5, 20), endDate: new Date(2024, 5, 30), status: 'Completed', description: "Develop leadership qualities and decision-making skills." },
  { id: 'CAMP-04', name: 'Republic Day Camp', location: 'Delhi', startDate: new Date(2024, 0, 1), endDate: new Date(2024, 0, 29), status: 'Completed', description: "The most prestigious camp, involving parades and cultural events at the national level." },
  { id: 'CAMP-05', name: 'Rock Climbing Camp', location: 'Manali, HP', startDate: new Date(2024, 9, 5), endDate: new Date(2024, 9, 15), status: 'Planning', description: "An adventure camp designed to build courage and physical fitness." },
];

export default function ManageCampsPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <CardTitle>Camp Management</CardTitle>
                <CardDescription>Oversee all upcoming, ongoing, and past camps.</CardDescription>
            </div>
            <Button><PlusCircle className="mr-2"/> Create New Camp</Button>
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
                    <TableCell>{`${format(camp.startDate, "dd MMM yyyy")} - ${format(camp.endDate, "dd MMM yyyy")}`}</TableCell>
                    <TableCell>
                        <Badge variant={camp.status === 'Upcoming' ? 'default' : (camp.status === 'Completed' ? 'secondary' : 'outline')}>
                            {camp.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                    <Link href={`/admin/manage-camps/${camp.id}`} passHref>
                      <Button variant="ghost" size="sm">View Details</Button>
                    </Link>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
