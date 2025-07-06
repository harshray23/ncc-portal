"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";

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
import { getFirebase } from "@/lib/firebase";
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
      const { auth } = getFirebase();
      let emailToLogin = identifier;

      if (isCadetLogin) {
        const result = await getEmailForRegimentalNumber(identifier);
        if (result.email) {
          emailToLogin = result.email;
        } else {
          throw new Error(result.error || "Invalid Regimental Number.");
        }
      }

      const userCredential = await signInWithEmailAndPassword(auth, emailToLogin, password);
      // Force refresh of the token to get latest custom claims.
      const token = await userCredential.user.getIdTokenResult(true);
      const userRole = token.claims.role;

      let path = "/";
      if (userRole === 'admin') {
        path = '/admin/dashboard';
      } else if (userRole === 'manager') {
        path = '/manager/dashboard';
      } else if (userRole === 'cadet') {
        path = '/cadet/dashboard';
      } else {
        // This should not happen for a valid user
        throw new Error("Your account does not have a role assigned. Please contact an administrator.");
      }
      
      toast({ title: "Login Successful", description: "Redirecting..." });
      router.push(path);
      router.refresh(); // Refresh server components

    } catch (error: any) {
        console.error("Login failed:", error);
        let description = "Invalid credentials. Please try again.";
        if (error.code === 'auth/invalid-credential') {
            description = "The email or password you entered is incorrect.";
        } else if (error.message.includes("permission")) {
            description = error.message;
        } else if (error.message.includes("Regimental Number")) {
          description = error.message;
        } else if (error.message.includes("role assigned")) {
          description = error.message;
        }
        
        toast({
            variant: "destructive",
            title: "Login Failed",
            description,
        });
    } finally {
        setIsLoading(false);
    }
  }

  const label = isCadetLogin ? "Regimental Number" : "Email";
  const placeholder = isCadetLogin ? "e.g. WB2024SDIA9160860" : "name@example.com";

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
