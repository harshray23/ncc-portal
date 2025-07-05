import Image from 'next/image';
import Link from 'next/link';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-background/90 backdrop-blur-sm shadow-2xl border-border">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
             <Image src="/emblem.avif" alt="NCC Emblem" width={80} height={80} />
          </div>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>Enter your email to receive a password reset link.</CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
        <CardFooter className="flex-col gap-4">
            <p className="text-center text-sm text-muted-foreground">
                Remembered your password?{" "}
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
