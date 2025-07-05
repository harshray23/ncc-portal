import Image from 'next/image';
import Link from 'next/link';
import { RegisterForm } from '@/components/auth/register-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-background/90 backdrop-blur-sm shadow-2xl border-border">
        <CardHeader className="text-center">
           <div className="mx-auto mb-4">
             <Image src="/emblem.avif" alt="NCC Emblem" width={80} height={80} />
          </div>
          <CardTitle>Cadet Registration</CardTitle>
          <CardDescription>Create your account to get started with CadetLink.</CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
         <CardFooter className="flex-col gap-4">
            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-primary hover:underline">
                    Login here
                </Link>
            </p>
            <p className="text-center text-sm text-muted-foreground">
                <Link href="/" className="font-semibold text-primary hover:underline">
                    &larr; Back to Portal Selection
                </Link>
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
