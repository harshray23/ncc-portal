"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";

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

const formSchema = z.object({
  identifier: z.string().min(1, { message: "This field is required." }),
  password: z
    .string()
    .min(1, { message: "Password is required." }),
});

const mockUsers = {
    'admin': { email: 'elvishray007@gmail.com', password: 'password123' },
    'manager': { email: 'harshray2007@gmail.com', password: 'password123' },
    'cadet': { regimentalNumber: 'PB20SDA123457', email: 'homeharshit001@gmail.com', password: 'password123' }
}

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

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const { identifier, password } = values;

    setTimeout(() => {
        let isAuthenticated = false;
        let path = "/";

        if (role === 'admin' && identifier === mockUsers.admin.email && password === mockUsers.admin.password) {
            isAuthenticated = true;
            path = '/admin/dashboard';
        } else if (role === 'manager' && identifier === mockUsers.manager.email && password === mockUsers.manager.password) {
            isAuthenticated = true;
            path = '/manager/dashboard';
        } else if (role === 'cadet' && (identifier === mockUsers.cadet.regimentalNumber || identifier === mockUsers.cadet.email) && password === mockUsers.cadet.password) {
            isAuthenticated = true;
            path = '/cadet/dashboard';
        }

        if (isAuthenticated) {
            toast({ title: "Login Successful", description: "Redirecting..." });
            router.push(path);
        } else {
             toast({
                variant: "destructive",
                title: "Login Failed",
                description: "Invalid credentials. Please try again.",
            });
        }
        setIsLoading(false);
    }, 1000);
  }

  const label = isCadetLogin ? "Regimental Number" : "Email";
  const placeholder = isCadetLogin ? "e.g. PB20SDA123457" : "name@example.com";

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
