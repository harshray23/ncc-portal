"use client"

import { useState } from 'react';
import { format } from "date-fns";
import { Flame, MapPin, Calendar, CheckCircle, Hourglass, XCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Camp, RegistrationStatus, UserProfile } from "@/lib/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface CampCardProps {
  camp: Camp;
  registrationStatus?: RegistrationStatus;
  onRegister: () => Promise<void>;
  currentUser: UserProfile;
}

export function CampCard({ camp, registrationStatus, onRegister, currentUser }: CampCardProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const formattedStartDate = format(camp.startDate, "dd MMM yyyy");
  const formattedEndDate = format(camp.endDate, "dd MMM yyyy");

  const handleRegistration = async () => {
    setIsRegistering(true);
    await onRegister();
    setIsRegistering(false);
  }

  const renderFooter = () => {
    if (registrationStatus === 'Accepted') {
        return <Button disabled className="w-full bg-green-600 hover:bg-green-700"><CheckCircle className="mr-2" /> Registered</Button>
    }
    if (registrationStatus === 'Pending') {
        return <Button disabled className="w-full"><Hourglass className="mr-2" /> Registration Pending</Button>
    }
    if (registrationStatus === 'Rejected') {
        return <Button disabled variant="destructive" className="w-full"><XCircle className="mr-2" /> Registration Rejected</Button>
    }
    return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
             <Button className="w-full" disabled={isRegistering}>
                {isRegistering && <Loader2 className="mr-2 animate-spin" />}
                Register Now
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Registration for {camp.name}</AlertDialogTitle>
              <AlertDialogDescription>
                Please confirm your details below are correct before submitting your registration.
                <div className="mt-4 space-y-2 rounded-md border p-4 text-foreground">
                    <p><strong>Name:</strong> {currentUser.name}</p>
                    <p><strong>Regt. No:</strong> {currentUser.regimentalNumber}</p>
                    <p><strong>Year:</strong> {currentUser.year}</p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleRegistration}>Confirm & Register</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    )
  }

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Flame className="h-6 w-6" />
            </div>
            <div>
                <CardTitle className="font-headline">{camp.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 pt-1">
                    <MapPin className="h-4 w-4" /> {camp.location}
                </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground">{camp.description}</p>
          <div className="mt-4 flex items-center gap-2 text-sm font-medium">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{formattedStartDate} - {formattedEndDate}</span>
          </div>
        </CardContent>
        <CardFooter>
          {renderFooter()}
        </CardFooter>
      </Card>
    </>
  );
}
