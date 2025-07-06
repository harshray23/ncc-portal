"use client";

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { UserProfile } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const cadetSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  regimentalNumber: z.string().min(1, "Regimental number is required"),
  studentId: z.string().min(1, "Student ID is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  whatsapp: z.string().min(10, "WhatsApp number must be at least 10 digits"),
  rank: z.string().min(1, "Rank is required"),
  year: z.string().regex(/^[1-3]$/, "Year must be 1, 2, or 3"),
});

interface AddCadetDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onCadetAdded: (newCadet: UserProfile) => void;
}

export function AddCadetDialog({ isOpen, onOpenChange, onCadetAdded }: AddCadetDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
        resolver: zodResolver(cadetSchema),
         defaultValues: {
            name: '',
            email: '',
            regimentalNumber: '',
            studentId: '',
            phone: '',
            whatsapp: '',
            rank: 'Cadet',
            year: '1',
        },
    });

    const onSubmit = (data: z.infer<typeof cadetSchema>) => {
        setIsSubmitting(true);
        const newCadet: UserProfile = {
            uid: `cadet-${Date.now()}`,
            name: data.name,
            email: data.email,
            regimentalNumber: data.regimentalNumber,
            studentId: data.studentId,
            phone: data.phone,
            whatsapp: data.whatsapp,
            rank: data.rank,
            year: parseInt(data.year, 10),
            role: 'cadet',
            approved: true,
            createdAt: new Date(),
            regimentalNumberEditCount: 0,
            profilePhotoUrl: `https://placehold.co/128x128.png?text=${data.name.charAt(0)}`,
        };

        // Simulate API call
        setTimeout(() => {
            onCadetAdded(newCadet);
            setIsSubmitting(false);
            onOpenChange(false);
            reset();
        }, 1000);
    };
    
    const handleOpenChange = (open: boolean) => {
        if (!open) {
            reset();
        }
        onOpenChange(open);
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Cadet</DialogTitle>
                    <DialogDescription>
                        The cadet's initial password will be their Regimental Number.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" placeholder="Ankit Sharma" {...register('name')} />
                            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" placeholder="name@example.com" {...register('email')} />
                            {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="rank">Rank</Label>
                            <Input id="rank" placeholder="Cadet" {...register('rank')} />
                            {errors.rank && <p className="text-sm text-destructive mt-1">{errors.rank.message}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="regimentalNumber">Regimental Number</Label>
                            <Input id="regimentalNumber" placeholder="PB20SDA123456" {...register('regimentalNumber')} />
                            {errors.regimentalNumber && <p className="text-sm text-destructive mt-1">{errors.regimentalNumber.message}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="studentId">Student ID</Label>
                            <Input id="studentId" placeholder="20BCS1024" {...register('studentId')} />
                            {errors.studentId && <p className="text-sm text-destructive mt-1">{errors.studentId.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="year-select">Year</Label>
                            <Controller
                                name="year"
                                control={control}
                                render={({ field }) => (
                                     <Select required onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger id="year-select">
                                            <SelectValue placeholder="Select Year" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1st Year</SelectItem>
                                            <SelectItem value="2">2nd Year</SelectItem>
                                            <SelectItem value="3">3rd Year</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.year && <p className="text-sm text-destructive mt-1">{errors.year.message}</p>}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" type="tel" {...register('phone')} />
                             {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>}
                        </div>
                         <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="whatsapp">WhatsApp Number</Label>
                            <Input id="whatsapp" type="tel" {...register('whatsapp')} />
                             {errors.whatsapp && <p className="text-sm text-destructive mt-1">{errors.whatsapp.message}</p>}
                        </div>
                    </div>
                     <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isSubmitting ? "Adding Cadet..." : "Add Cadet"}
                        </Button>
                     </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
