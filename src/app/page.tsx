import { ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <CardTitle className="font-headline text-3xl">CadetLink</CardTitle>
            <CardDescription>
              Secure login for Cadets, Management, and Admins.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} CadetLink. All rights reserved.</p>
        <p className="mt-1">
          A modern solution for National Cadet Corps units.
        </p>
      </footer>
    </main>
  );
}
