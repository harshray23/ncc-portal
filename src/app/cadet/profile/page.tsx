"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Save, X } from "lucide-react";
import type { UserProfile } from "@/lib/types";

const initialProfile: UserProfile = {
  name: "Ankit Sharma",
  email: "ankit.sharma@example.com",
  regimentalNumber: "PB20SDA123456",
  studentId: "20BCS1024",
  rank: "Cadet",
  unit: "1 PB BN NCC",
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(initialProfile);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfile((prev) => ({ ...prev, [id]: value }));
  };
  
  const handleSave = () => {
    // Here you would typically make an API call to save the profile
    console.log("Saving profile:", profile);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setProfile(initialProfile); // Reset changes
    setIsEditing(false);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="https://placehold.co/80x80.png" alt={profile.name} data-ai-hint="profile picture" />
            <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl font-headline">{profile.name}</CardTitle>
            <CardDescription>
              {profile.rank} | {profile.unit}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={profile.name} onChange={handleInputChange} disabled={!isEditing} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" value={profile.email} onChange={handleInputChange} disabled={!isEditing} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="regimentalNumber">Regimental Number</Label>
            <Input id="regimentalNumber" value={profile.regimentalNumber} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="studentId">Student ID</Label>
            <Input id="studentId" value={profile.studentId} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rank">Rank</Label>
            <Input id="rank" value={profile.rank} onChange={handleInputChange} disabled={!isEditing} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <Input id="unit" value={profile.unit} onChange={handleInputChange} disabled={!isEditing} />
          </div>
        </form>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        {isEditing ? (
          <>
            <Button variant="outline" onClick={handleCancel}><X className="mr-2 h-4 w-4" />Cancel</Button>
            <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" />Save Changes</Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)}><Edit className="mr-2 h-4 w-4" />Edit Profile</Button>
        )}
      </CardFooter>
    </Card>
  );
}
