"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import { LogIn, UserCheck, UserPlus, UserCog, FileUp, FileDown, Flame, Trash2, CheckSquare, GraduationCap } from 'lucide-react';
import type { AuditLog, AuditLogType } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const activityIcons: Record<AuditLogType, React.ReactElement> = {
    'Login': <LogIn className="h-5 w-5 text-blue-500" />,
    'Approval': <UserCheck className="h-5 w-5 text-green-500" />,
    'Registration': <UserCheck className="h-5 w-5 text-green-500" />,
    'Profile Update': <UserCog className="h-5 w-5 text-yellow-500" />,
    'Data Import': <FileUp className="h-5 w-5 text-purple-500" />,
    'Report Download': <FileDown className="h-5 w-5 text-indigo-500" />,
    'New User': <UserPlus className="h-5 w-5 text-cyan-500" />,
    'Camp Create': <Flame className="h-5 w-5 text-orange-500" />,
    'Camp Delete': <Trash2 className="h-5 w-5 text-red-600" />,
    'Attendance Update': <CheckSquare className="h-5 w-5 text-teal-500" />,
    'Year Update': <GraduationCap className="h-5 w-5 text-pink-500" />,
    'Staff Add': <UserPlus className="h-5 w-5 text-cyan-600" />,
    'Staff Delete': <Trash2 className="h-5 w-5 text-red-600" />,
};

type ActivityFilterType = AuditLogType | 'All';

export function ActivityClientPage({ initialActivities }: { initialActivities: AuditLog[] }) {
  const [activities] = useState<AuditLog[]>(initialActivities);
  const [filter, setFilter] = useState<ActivityFilterType>('All');

  const filteredActivities = filter === 'All'
    ? activities
    : activities.filter(a => a.type === filter);
  
  const allActivityTypes = Array.from(new Set(activities.map(a => a.type))).sort();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Monitor</CardTitle>
        <CardDescription>
          A log of important events happening across the system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
            <Label htmlFor="activity-filter">Filter by Type:</Label>
            <Select value={filter} onValueChange={(value) => setFilter(value as ActivityFilterType)}>
              <SelectTrigger id="activity-filter" className="w-[240px]">
                <SelectValue placeholder="Filter by type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Activities</SelectItem>
                {allActivityTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Type</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivities.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">No activities found.</TableCell>
                </TableRow>
              ) : (
                filteredActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                         {activityIcons[activity.type as AuditLogType] || <UserCog className="h-5 w-5 text-gray-500" />}
                         <span>{activity.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                        <div>{activity.user}</div>
                        <Badge variant="outline" className="mt-1">{activity.role}</Badge>
                    </TableCell>
                    <TableCell>{activity.details}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
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
