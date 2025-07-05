"use client";

import { useState, useRef } from "react";
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
import { Edit, Save, X, Upload } from "lucide-react";
import type { UserProfile } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const mockProfile: UserProfile = {
  uid: 'manager-1',
  name: 'Maj. Vikram Batra',
  email: 'harshray2007@gmail.com',
  role: 'manager',
  regimentalNumber: 'MANAGER-001',
  regimentalNumberEditCount: 0,
  studentId: 'N/A',
  rank: 'Major',
  unit: 'HQ',
  phone: '1234567890',
  whatsapp: '1234567890',
  approved: true,
  createdAt: new Date(),
  profilePhotoUrl: "https://placehold.co/128x128.png"
};

export default function ManagerProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(mockProfile);
  const [initialData, setInitialData] = useState<UserProfile>(mockProfile);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
            updatedProfile.regimentalNumber = initialData.regimentalNumber; // Revert if somehow edited
        }
    }
    
    setProfile(updatedProfile);
    toast({ title: "Success", description: "Profile updated successfully." });
    setInitialData(updatedProfile);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setProfile(initialData);
    setIsEditing(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhotoUrl = reader.result as string;
        setProfile(prev => ({...prev, profilePhotoUrl: newPhotoUrl}));
        toast({ title: "Profile Picture Updated", description: "Click 'Save Changes' to apply." });
        if (!isEditing) setIsEditing(true);
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="relative group">
                <Avatar className="h-32 w-32 cursor-pointer" onClick={handleAvatarClick}>
                    <AvatarImage src={profile.profilePhotoUrl} alt={profile.name} data-ai-hint="profile picture"/>
                    <AvatarFallback>{profile.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload className="h-8 w-8 text-white" />
                </div>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>
          <div>
            <CardTitle className="text-3xl font-headline">{profile.name}</CardTitle>
            <CardDescription>
              {profile.rank} | Manager
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
            <Input id="regimentalNumber" value={profile.regimentalNumber} onChange={handleInputChange} disabled={!isEditing || (profile.regimentalNumberEditCount ?? 0) >= 2} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rank">Rank</Label>
            <Input id="rank" value={profile.rank} onChange={handleInputChange} disabled={!isEditing} />
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
