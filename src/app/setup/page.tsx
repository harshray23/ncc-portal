"use client";

import { useFormStatus, useFormState } from "react-dom";
import { Loader2, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { seedDatabaseAction } from './actions';

// This component uses the form status to show a loading state on the button.
function SeedButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? "Seeding..." : "Seed Database"}
    </Button>
  );
}

export default function SetupPage() {
  const [state, formAction] = useFormState(seedDatabaseAction, null as {success: boolean, message: string} | null);
  
  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-background/90 backdrop-blur-sm shadow-2xl border-border">
        <CardHeader>
          <CardTitle>Database Initial Setup</CardTitle>
          <CardDescription>
            Click the button below to seed your Firestore database with initial users and data.
            This is a one-time operation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Important!</AlertTitle>
            <AlertDescription>
              Ensure you have set up your Firebase credentials in the <code>.env.local</code> file before proceeding. The app will not work without them.
            </AlertDescription>
          </Alert>
          <form action={formAction}>
            <SeedButton />
          </form>
          {state?.message && (
             <Alert variant={state.success ? 'default' : 'destructive'} className="mt-4">
              <Terminal className="h-4 w-4" />
              <AlertTitle>{state.success ? 'Success' : 'Error'}</AlertTitle>
              <AlertDescription>
                {state.message}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
