"use client";

import { useState, useEffect } from "react";
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
import { useAuth } from "@/components/providers/auth-provider";
import { updateUserProfile } from "@/lib/actions/user.actions";

export default function ProfilePage() {
  const { user, loading, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<Partial<UserProfile>>(user || {});
  const [initialData, setInitialData] = useState<Partial<UserProfile>>(user || {});
  const [formErrors, setFormErrors] = useState<Record<string, string[] | undefined>>({});
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setProfile(user);
      setInitialData(user);
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfile((prev) => ({ ...prev, [id]: value }));
    if (formErrors[id]) {
      setFormErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  };
  
  const handleSave = async () => {
    if (!profile.uid) return;
    setFormErrors({});

    const result = await updateUserProfile(profile as UserProfile);

    if (result.success) {
      toast({ title: "Success", description: "Profile updated successfully." });
      await refreshUser(); // Refreshes user data from provider
      setIsEditing(false);
    } else {
      if (result.errors) {
        setFormErrors(result.errors);
      }
      toast({ variant: 'destructive', title: "Error", description: result.message });
    }
  };
  
  const handleCancel = () => {
    setProfile(initialData);
    setFormErrors({});
    setIsEditing(false);
  };

  if (loading || !user) {
    return <p>Loading profile...</p>
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.profilePhotoUrl} alt={user.name} data-ai-hint="profile picture" />
            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl font-headline">{user.name}</CardTitle>
            <CardDescription>
              {user.rank} | {user.unit || 'N/A'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={profile.name || ''} onChange={handleInputChange} disabled={!isEditing} />
            {formErrors.name && <p className="text-sm text-destructive mt-1">{formErrors.name[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" value={profile.email || ''} onChange={handleInputChange} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="regimentalNumber">
                Regimental Number
                 <span className="text-xs text-muted-foreground ml-2">
                    ({(profile.regimentalNumberEditCount ?? 0) < 2 ? `${2 - (profile.regimentalNumberEditCount ?? 0)} edits remaining` : 'No edits remaining'})
                </span>
            </Label>
            <Input id="regimentalNumber" value={profile.regimentalNumber || ''}  onChange={handleInputChange} disabled={!isEditing || (profile.regimentalNumberEditCount ?? 0) >= 2} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="studentId">Student ID</Label>
            <Input id="studentId" value={profile.studentId || ''} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rank">Rank</Label>
            <Input id="rank" value={profile.rank || ''} onChange={handleInputChange} disabled={!isEditing} />
            {formErrors.rank && <p className="text-sm text-destructive mt-1">{formErrors.rank[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <Input id="unit" value={profile.unit || ''} onChange={handleInputChange} disabled={!isEditing} />
            {formErrors.unit && <p className="text-sm text-destructive mt-1">{formErrors.unit[0]}</p>}
          </div>
           <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={profile.phone || ''} onChange={handleInputChange} disabled={!isEditing} />
            {formErrors.phone && <p className="text-sm text-destructive mt-1">{formErrors.phone[0]}</p>}
          </div>
           <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input id="whatsapp" value={profile.whatsapp || ''} onChange={handleInputChange} disabled={!isEditing} />
            {formErrors.whatsapp && <p className="text-sm text-destructive mt-1">{formErrors.whatsapp[0]}</p>}
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
