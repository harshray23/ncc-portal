
"use client";

import { useState, useEffect } from "react";
import { Shield, User, Briefcase } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";


export default function PortalSelectionPage() {
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 3500); // Splash screen duration

        return () => clearTimeout(timer);
    }, []);

    if (showSplash) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-background text-foreground">
                <div className="flex flex-col items-center gap-8 animate-pulse">
                    <Image src="/emblem.avif" alt="NCC Emblem" width={120} height={120} priority />
                    <Image src="/ncc.png" alt="NCC Logo" width={120} height={120} className="rounded-md" priority/>
                    <h1 className="text-3xl font-bold text-primary tracking-wider text-center">
                        10 Bengal Battalion<br />-- NCC --
                    </h1>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cover bg-center">
            <header className="py-4 bg-black/20 backdrop-blur-sm">
                <div className="container mx-auto flex justify-center items-center">
                     <Image src="/emblem.avif" alt="NCC Emblem" width={100} height={100} />
                </div>
            </header>

            <main className="flex flex-col justify-center items-center py-12 px-4 space-y-12">
                <div className="relative w-full max-w-4xl bg-background/90 backdrop-blur-sm rounded-lg p-8 shadow-2xl border border-border">
                    <Link href="/login?role=manager" className="absolute top-8 right-8 text-muted-foreground hover:text-primary" title="Manager Portal">
                        <Briefcase className="h-6 w-6" />
                    </Link>
                    <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                        <Image src="/ncc.png" alt="NCC Logo" width={150} height={150} className="rounded-md" />
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl font-bold text-primary">Welcome to NCC Portal</h1>
                            <p className="text-lg text-foreground mt-2">10 Bengal Battalion</p>
                            <p className="text-lg text-accent font-semibold">Asansol Engineering College</p>
                            <p className="text-muted-foreground mt-4">Please select your portal to continue.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="text-center bg-card/80 hover:shadow-lg transition-shadow">
                             <CardHeader>
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <User className="h-8 w-8" />
                                </div>
                                <CardTitle className="mt-4">Cadet Portal</CardTitle>
                                <CardDescription>Access your profile and other cadet services.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2">
                                <Link href="/login?role=cadet" className="w-full" passHref>
                                     <Button variant="default" className="w-full">Login as Cadet</Button>
                                </Link>
                            </CardContent>
                        </Card>
                        <Card className="text-center bg-card/80 hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Shield className="h-8 w-8" />
                                </div>
                                <CardTitle className="mt-4">Admin Portal</CardTitle>
                                <CardDescription>Manage registrations and administrative tasks.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link href="/login?role=admin" className="w-full" passHref>
                                    <Button variant="outline" className="w-full">Login as Admin</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
