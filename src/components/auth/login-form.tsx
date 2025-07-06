"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import type { UserRole } from "@/lib/types";

import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getEmailForRegimentalNumber } from "@/lib/actions/auth.actions";

const formSchema = z.object({
  identifier: z.string().min(1, { message: "This field is required." }),
  password: z
    .string()
    .min(1, { message: "Password is required." }),
});

function LoginFormComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const role = searchParams.get('role');
  const isCadetLogin = role === 'cadet';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const { identifier, password } = values;

    try {
        let emailToLogin = identifier;

        if (isCadetLogin) {
            const result = await getEmailForRegimentalNumber(identifier);
            if (result.error || !result.email) {
                toast({ variant: "destructive", title: "Login Failed", description: "Invalid Regimental Number." });
                setIsLoading(false);
                return;
            }
            emailToLogin = result.email;
        }

        const userCredential = await signInWithEmailAndPassword(auth, emailToLogin, password);
        const user = userCredential.user;

        const idTokenResult = await user.getIdTokenResult();
        const userRole = idTokenResult.claims.role as UserRole;

        const expectedRole = searchParams.get('role');
        if (expectedRole && userRole !== expectedRole) {
            await auth.signOut();
            toast({
                variant: "destructive",
                title: "Access Denied",
                description: `These credentials are not valid for the ${expectedRole} portal.`,
            });
            setIsLoading(false);
            return;
        }

        toast({ title: "Login Successful", description: "Redirecting..." });
        
        let path = "/";
        switch (userRole) {
            case "admin":
              path = "/admin/dashboard";
              break;
            case "manager":
              path = "/manager/dashboard";
              break;
            case "cadet":
              path = "/cadet/dashboard";
              break;
        }
        router.push(path);
    } catch (error: any) {
        let errorMessage = "Invalid credentials. Please try again.";
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
             errorMessage = "Invalid credentials. Please try again.";
        } else if (error.code) {
            errorMessage = error.code.replace('auth/', '').replace(/-/g, ' ');
        }
        toast({
            variant: "destructive",
            title: "Login Failed",
            description: errorMessage,
        });
    } finally {
        setIsLoading(false);
    }
  }

  const label = isCadetLogin ? "Regimental Number" : "Email";
  const placeholder = isCadetLogin ? "e.g. PB20SDA123456" : "name@example.com";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Input placeholder={placeholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Password</FormLabel>
                 <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot Password?
                </Link>
              </div>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full !mt-6" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>
      </form>
    </Form>
  );
}

export function LoginForm() {
  return (
    <Suspense>
      <LoginFormComponent />
    </Suspense>
  )
}
