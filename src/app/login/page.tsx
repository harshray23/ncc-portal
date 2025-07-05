import { Suspense } from 'react';
import Image from 'next/image';
import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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
      </Card>
    </div>
  );
}


export default function LoginPage() {
  // Wrap with Suspense because LoginForm uses useSearchParams
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  )
}
