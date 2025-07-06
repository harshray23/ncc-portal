import Link from 'next/link';
import { SeedButton } from '@/components/auth/seed-button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Database, Info } from 'lucide-react';

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-background/90 backdrop-blur-sm shadow-2xl border-border">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
             <Database className="h-16 w-16 text-primary" />
          </div>
          <CardTitle>First-Time Setup</CardTitle>
          <CardDescription>Seed the database with initial users.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                    This will create an admin, manager, and cadet user. This should only be done once. Before clicking, ensure your .env.local file is filled with your Firebase credentials.
                </AlertDescription>
            </Alert>
            <SeedButton />
        </CardContent>
        <CardFooter className="flex-col gap-4">
            <p className="text-center text-sm text-muted-foreground">
                After seeding, you can log in.
                <br />
                <Link href="/" className="font-semibold text-primary hover:underline">
                    &larr; Back to Portal Selection
                </Link>
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
