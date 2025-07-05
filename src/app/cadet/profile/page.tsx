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
import { useToast } from "@/hooks/use-toast";

const mockProfile: UserProfile = {
  uid: 'cadet-1',
  name: "Cdt. Harsh Home",
  email: "homeharshit001@gmail.com",
  role: 'cadet',
  regimentalNumber: "PB20SDA123457",
  regimentalNumberEditCount: 0,
  studentId: "20BCS1025",
  rank: "Cadet",
  unit: "10 Bengal Battalion",
  phone: "0987654321",
  whatsapp: "0987654321",
  approved: true,
  createdAt: new Date(),
  profilePhotoUrl: "https://placehold.co/80x80.png"
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(mockProfile);
  const [initialData, setInitialData] = useState<UserProfile>(mockProfile);
  const { toast } = useToast();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfile((prev) => ({ ...prev, [id]: value } as UserProfile));
  };
  
  const handleSave = async () => {
    let updatedProfile = { ...profile };
    if (profile.regimentalNumber !== initialData.regimentalNumber) {
        if ((initialData.regimentalNumberEditCount || 0) < 2) {
            updatedProfile.regimentalNumberEditCount = (initialData.regimentalNumberEditCount || 0) + 1;
        } else {
             updatedProfile.regimentalNumber = initialData.regimentalNumber; // Revert
        }
    }
    
    setProfile(updatedProfile);
    toast({ title: "Success", description: "Profile updated successfully." });
    setInitialData(updatedProfile);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setProfile(initialData); // Reset changes
    setIsEditing(false);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile.profilePhotoUrl} alt={profile.name} data-ai-hint="profile picture" />
            <AvatarFallback>{profile.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl font-headline">{profile.name}</CardTitle>
            <CardDescription>
              {profile.rank} | {profile.unit || 'N/A'}
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
            <Label htmlFor="regimentalNumber">
                Regimental Number
                 <span className="text-xs text-muted-foreground ml-2">
                    ({(profile.regimentalNumberEditCount ?? 0) < 2 ? `${2 - (profile.regimentalNumberEditCount ?? 0)} edits remaining` : 'No edits remaining'})
                </span>
            </Label>
            <Input id="regimentalNumber" value={profile.regimentalNumber}  onChange={handleInputChange} disabled={!isEditing || (profile.regimentalNumberEditCount ?? 0) >= 2} />
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
           <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={profile.phone} onChange={handleInputChange} disabled={!isEditing} />
          </div>
           <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input id="whatsapp" value={profile.whatsapp} onChange={handleInputChange} disabled={!isEditing} />
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
