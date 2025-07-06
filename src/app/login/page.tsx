import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

function LoginPageContent() {
  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-background/90 backdrop-blur-sm shadow-2xl border-border">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
             <Image src="/emblem.avif" alt="NCC Emblem" width={80} height={80} />
          </div>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Sign in to access your portal</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="flex-col gap-4">
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


export default function LoginPage() {
  // Wrap with Suspense because LoginForm uses useSearchParams
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-4 text-xl font-semibold text-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
          Loading...
        </div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  )
}
