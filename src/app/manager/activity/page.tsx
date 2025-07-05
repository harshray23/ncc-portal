import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Wrench } from "lucide-react";

export default function ActivityMonitorPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Monitor</CardTitle>
        <CardDescription>
          This page is intended for monitoring real-time system activities.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
            <Wrench className="h-4 w-4" />
            <AlertTitle>Under Construction</AlertTitle>
            <AlertDescription>
                This feature is currently under development and will be available soon.
            </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
