"use client"

import { useState } from 'react';
import { format } from "date-fns";
import { Flame, MapPin, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VerifyLinkDialog } from "@/components/cadet/verify-link-dialog";
import type { Camp } from "@/lib/types";

interface CampCardProps {
  camp: Camp;
}

export function CampCard({ camp }: CampCardProps) {
    const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);

  const formattedStartDate = format(camp.startDate, "dd MMM yyyy");
  const formattedEndDate = format(camp.endDate, "dd MMM yyyy");

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
          <Button className="w-full" onClick={() => setIsVerifyDialogOpen(true)}>
            Register Now
          </Button>
        </CardFooter>
      </Card>
      <VerifyLinkDialog 
        isOpen={isVerifyDialogOpen}
        setIsOpen={setIsVerifyDialogOpen}
        camp={camp}
      />
    </>
  );
}
