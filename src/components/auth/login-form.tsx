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
  email: z.string().min(1, { message: "This field is required." }),
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
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    // Mock user database
    const mockUsers = {
        "elvishray007@gmail.com": { role: "admin", password: "password123" },
        "harshray2007@gmail.com": { role: "manager", password: "password123" },
        "homeharshit001@gmail.com": { role: "cadet", password: "password123" }
    };
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    let loginSuccess = false;
    let userRole = '';
    const { email: identifier, password } = values;

    const userByEmail = mockUsers[identifier as keyof typeof mockUsers];

    if (userByEmail && userByEmail.password === password) {
        // Standard email login for any role
        loginSuccess = true;
        userRole = userByEmail.role;
    } else if (!identifier.includes('@') && identifier === password) {
        // Regimental number login where password is the same, assume cadet
        loginSuccess = true;
        userRole = 'cadet';
    }


    if (loginSuccess) {
        const expectedRole = searchParams.get('role');
        if (expectedRole && userRole !== expectedRole) {
            toast({
                variant: "destructive",
                title: "Access Denied",
                description: `These are not valid credentials for the ${expectedRole} portal.`,
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
    } else {
        toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Invalid credentials. Please try again.",
        });
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
          name="email"
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
