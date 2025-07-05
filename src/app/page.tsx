import { Shield, User } from "lucide-react";
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
    return (
        <div className="min-h-screen bg-cover bg-center">
            <header className="py-4 bg-black/20 backdrop-blur-sm">
                <div className="container mx-auto flex justify-center items-center">
                     <Image src="/emblem.avif" alt="NCC Emblem" width={100} height={100} />
                </div>
            </header>

            <main className="flex justify-center items-center py-12 px-4">
                <div className="w-full max-w-4xl bg-background/90 backdrop-blur-sm rounded-lg p-8 shadow-2xl border border-border">
                    <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                        <Image src="/ncc.png" alt="NCC Logo" width={150} height={150} className="rounded-md" />
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl font-bold text-primary">Welcome to NCC Portal</h1>
                            <p className="text-lg text-foreground mt-2">10 Bengal Battalion</p>
                            <p className="text-lg text-accent font-semibold">Asansol Engineering College</p>
                            <p className="text-muted-foreground mt-4">Please select your portal to continue.</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <Card className="text-center bg-card/80 hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Shield className="h-8 w-8" />
                                </div>
                                <CardTitle className="mt-4">Admin Portal</CardTitle>
                                <CardDescription>Manage registrations and administrative tasks.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link href="/admin/dashboard" className="w-full" passHref>
                                    <Button variant="outline" className="w-full">Login as Admin</Button>
                                </Link>
                            </CardContent>
                        </Card>
                        <Card className="text-center bg-card/80 hover:shadow-lg transition-shadow">
                             <CardHeader>
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <User className="h-8 w-8" />
                                </div>
                                <CardTitle className="mt-4">Cadet Portal</CardTitle>
                                <CardDescription>Access your profile and other cadet services.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link href="/cadet/dashboard" className="w-full" passHref>
                                     <Button variant="outline" className="w-full">Login as Cadet</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
