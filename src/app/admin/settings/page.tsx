import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Wrench } from "lucide-react";

export default function SettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
        <CardDescription>
          Manage system-wide configuration and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
            <Wrench className="h-4 w-4" />
            <AlertTitle>Under Construction</AlertTitle>
            <AlertDescription>
                This page is currently under development. More settings will be available soon.
            </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
