"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import { LogIn, UserCheck, UserPlus, UserCog, FileUp, FileDown } from 'lucide-react';

const mockActivities = [
  { id: 'act-1', timestamp: new Date(Date.now() - 120000), user: 'Cdt. Ankit Sharma', role: 'cadet', type: 'Login', details: 'Successful login to cadet portal.' },
  { id: 'act-2', timestamp: new Date(Date.now() - 3600000), user: 'Col. Elvish Ray', role: 'admin', type: 'Approval', details: 'Approved cadet: Priya Verma.' },
  { id: 'act-3', timestamp: new Date(Date.now() - 7200000), user: 'Cdt. Priya Verma', role: 'cadet', type: 'Registration', details: 'Registered for Annual Training Camp.' },
  { id: 'act-4', timestamp: new Date(Date.now() - 86400000), user: 'Maj. Vikram Batra', role: 'manager', type: 'Login', details: 'Successful login to manager portal.' },
  { id: 'act-5', timestamp: new Date(Date.now() - 90000000), user: 'Cdt. Rahul Singh', role: 'cadet', type: 'Profile Update', details: 'Updated phone number.' },
  { id: 'act-6', timestamp: new Date(Date.now() - 172800000), user: 'Col. Elvish Ray', role: 'admin', type: 'Data Import', details: 'Imported 50 new cadet records from XLSX.' },
  { id: 'act-7', timestamp: new Date(Date.now() - 259200000), user: 'Maj. Vikram Batra', role: 'manager', type: 'Report Download', details: 'Downloaded monthly attendance report.' },
  { id: 'act-8', timestamp: new Date(Date.now() - 604800000), user: 'Cdt. Sneha Gupta', role: 'cadet', type: 'New User', details: 'New cadet registration submitted for approval.' },
];

const activityIcons = {
    'Login': <LogIn className="h-5 w-5 text-blue-500" />,
    'Approval': <UserCheck className="h-5 w-5 text-green-500" />,
    'Registration': <UserCheck className="h-5 w-5 text-green-500" />, // Using same as Approval for camp reg
    'Profile Update': <UserCog className="h-5 w-5 text-yellow-500" />,
    'Data Import': <FileUp className="h-5 w-5 text-purple-500" />,
    'Report Download': <FileDown className="h-5 w-5 text-indigo-500" />,
    'New User': <UserPlus className="h-5 w-5 text-cyan-500" />,
};

type ActivityType = keyof typeof activityIcons;

export default function ActivityMonitorPage() {
  const [filter, setFilter] = useState<ActivityType | 'All'>('All');
  
  const filteredActivities = filter === 'All' 
    ? mockActivities 
    : mockActivities.filter(a => a.type.replace(' ', '') === filter);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Monitor</CardTitle>
        <CardDescription>
          A real-time log of important events happening across the system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="All" onValueChange={(value) => setFilter(value as ActivityType | 'All')}>
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 lg:grid-cols-8 mb-4">
            <TabsTrigger value="All">All</TabsTrigger>
            <TabsTrigger value="Login">Logins</TabsTrigger>
            <TabsTrigger value="Approval">Approvals</TabsTrigger>
            <TabsTrigger value="Registration">Camp Reg.</TabsTrigger>
            <TabsTrigger value="ProfileUpdate">Updates</TabsTrigger>
            <TabsTrigger value="DataImport">Imports</TabsTrigger>
            <TabsTrigger value="ReportDownload">Downloads</TabsTrigger>
            <TabsTrigger value="NewUser">New Users</TabsTrigger>
          </TabsList>
          <TabsContent value={filter}>
            <div className="overflow-hidden rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Type</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                           {activityIcons[activity.type as ActivityType]}
                           <span>{activity.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                          <div>{activity.user}</div>
                          <Badge variant="outline" className="mt-1">{activity.role}</Badge>
                      </TableCell>
                      <TableCell>{activity.details}</TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
