"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { registerCadet } from "@/lib/actions/user.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";


function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {pending ? "Registering..." : "Register"}
        </Button>
    )
}


export function RegisterForm() {
    const router = useRouter();
    const { toast } = useToast();
    const [state, formAction] = useFormState(registerCadet, {
        type: "",
        message: "",
    });

    useEffect(() => {
        if (state.type === "success") {
            toast({
                title: "Registration Submitted",
                description: state.message,
            });
            router.push('/login');
        }
    }, [state, router, toast]);

  return (
    <form action={formAction} className="space-y-4">
        {state.type === 'error' && (
            <Alert variant="destructive">
                <AlertTitle>Registration Failed</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
            </Alert>
        )}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="Ankit Sharma" required />
                {state.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" placeholder="name@example.com" required />
                {state.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
                 {state.errors?.password && <p className="text-sm text-destructive">{state.errors.password[0]}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="rank">Rank</Label>
                <Input id="rank" name="rank" placeholder="Cadet" required />
                {state.errors?.rank && <p className="text-sm text-destructive">{state.errors.rank[0]}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="regimentalNumber">Regimental Number</Label>
                <Input id="regimentalNumber" name="regimentalNumber" placeholder="PB20SDA123456" required />
                {state.errors?.regimentalNumber && <p className="text-sm text-destructive">{state.errors.regimentalNumber[0]}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input id="studentId" name="studentId" placeholder="20BCS1024" required />
                {state.errors?.studentId && <p className="text-sm text-destructive">{state.errors.studentId[0]}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" required />
                {state.errors?.phone && <p className="text-sm text-destructive">{state.errors.phone[0]}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                <Input id="whatsapp" name="whatsapp" type="tel" required />
                {state.errors?.whatsapp && <p className="text-sm text-destructive">{state.errors.whatsapp[0]}</p>}
            </div>
        </div>
        <SubmitButton />
    </form>
  );
}
