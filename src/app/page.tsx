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
    return (
        <div className="min-h-screen bg-cover bg-center">
            <header className="py-4 bg-black/20 backdrop-blur-sm">
                <div className="container mx-auto flex justify-center items-center">
                     <Image src="/emblem.avif" alt="NCC Emblem" width={100} height={100} />
                </div>
            </header>

            <main className="flex flex-col justify-center items-center py-12 px-4">
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                         <Card className="text-center bg-card/80 hover:shadow-lg transition-shadow">
                             <CardHeader>
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Briefcase className="h-8 w-8" />
                                </div>
                                <CardTitle className="mt-4">Manager Portal</CardTitle>
                                <CardDescription>Monitor activities and view key reports.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link href="/login?role=manager" className="w-full" passHref>
                                     <Button variant="outline" className="w-full">Login as Manager</Button>
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
                            <CardContent className="flex flex-col gap-2">
                                <Link href="/login?role=cadet" className="w-full" passHref>
                                     <Button variant="outline" className="w-full">Login as Cadet</Button>
                                </Link>
                                <Link href="/register" className="w-full" passHref>
                                     <Button variant="default" className="w-full">Register as Cadet</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="mt-12 w-full max-w-4xl bg-background/90 backdrop-blur-sm rounded-lg p-8 shadow-2xl border border-border">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-primary">Login Credentials</h2>
                         <p className="text-muted-foreground mt-2">
                            New cadets must register and be approved by an administrator.
                        </p>
                    </div>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div className="rounded-md border p-4">
                            <h3 className="font-semibold text-lg">Admin</h3>
                            <p className="mt-2 text-muted-foreground">Email: <span className="font-mono">elvishray007@gmail.com</span></p>
                            <p className="text-muted-foreground">Password: <span className="font-mono">123456</span></p>
                        </div>
                        <div className="rounded-md border p-4">
                            <h3 className="font-semibold text-lg">Manager</h3>
                             <p className="mt-2 text-muted-foreground">To use the Manager Portal, you can create a user in your Firebase Authentication console and then create a corresponding document in the 'users' collection with `role: "manager"`.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
