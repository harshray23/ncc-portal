"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

export default function SettingsPage() {
    const { toast } = useToast();
    const [unitName, setUnitName] = useState("10 Bengal Battalion");
    const [collegeName, setCollegeName] = useState("Asansol Engineering College");
    const [allowRegistrations, setAllowRegistrations] = useState(true);
    const [autoApprove, setAutoApprove] = useState(false);
    const [notifyOnReg, setNotifyOnReg] = useState(true);
    const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true);
    
    const handleSave = () => {
        // In a real app, this would save to a config file or database.
        toast({
            title: "Settings Saved",
            description: "Your changes have been saved successfully.",
        });
    }

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                Manage system-wide configuration and preferences.
                </CardDescription>
            </CardHeader>
        </Card>

        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="auth">Authentication</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>Update basic information about your unit.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="unitName">Battalion/Unit Name</Label>
                  <Input id="unitName" value={unitName} onChange={(e) => setUnitName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="collegeName">College/Institution Name</Label>
                  <Input id="collegeName" value={collegeName} onChange={(e) => setCollegeName(e.target.value)} />
                </div>
              </CardContent>
              <CardFooter>
                 <Button onClick={handleSave}><Save className="mr-2"/>Save General Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="auth">
            <Card>
              <CardHeader>
                <CardTitle>Authentication Settings</CardTitle>
                <CardDescription>Configure how users register and get approved.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label htmlFor="allowRegistrations" className="text-base">Allow New Cadet Registrations</Label>
                    <p className="text-sm text-muted-foreground">Enable or disable the public registration form for new cadets.</p>
                  </div>
                  <Switch id="allowRegistrations" checked={allowRegistrations} onCheckedChange={setAllowRegistrations} />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label htmlFor="autoApprove" className="text-base">Automatically Approve New Cadets</Label>
                    <p className="text-sm text-muted-foreground">If enabled, new cadets can log in immediately after registration.</p>
                  </div>
                  <Switch id="autoApprove" checked={autoApprove} onCheckedChange={setAutoApprove} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage automated email notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label htmlFor="notifyOnReg" className="text-base">Notify Admin on New Registration</Label>
                    <p className="text-sm text-muted-foreground">Send an email to the admin when a new cadet registers.</p>
                  </div>
                  <Switch id="notifyOnReg" checked={notifyOnReg} onCheckedChange={setNotifyOnReg} />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label htmlFor="sendWelcomeEmail" className="text-base">Send Welcome Email to Approved Cadets</Label>
                    <p className="text-sm text-muted-foreground">Send a welcome email once a cadet's account is approved.</p>
                  </div>
                  <Switch id="sendWelcomeEmail" checked={sendWelcomeEmail} onCheckedChange={setSendWelcomeEmail} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
  );
}
