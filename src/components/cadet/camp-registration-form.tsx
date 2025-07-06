"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { Camp, CampRegistration } from '@/lib/types';

interface CampRegistrationFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  camp: Camp;
  onRegister: (newRegistration: Omit<CampRegistration, 'id' | 'registeredAt'>) => void;
}

const registrationSchema = z.object({
    cadetName: z.string().min(1, 'Cadet name is required'),
    regimentalNumber: z.string().min(1, 'Regimental number is required'),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

// Mock current cadet data
const currentCadet = {
    id: 'cadet-1',
    name: "Cdt. Harsh Home",
    regimentalNumber: 'PB20SDA123457',
    year: 2,
};

export function CampRegistrationForm({ isOpen, setIsOpen, camp, onRegister }: CampRegistrationFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const form = useForm<RegistrationFormValues>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            cadetName: currentCadet.name,
            regimentalNumber: currentCadet.regimentalNumber,
        }
    });
    
    const onSubmit = (data: RegistrationFormValues) => {
        setIsSubmitting(true);
        
        const newRegistration: Omit<CampRegistration, 'id' | 'registeredAt'> = {
            campId: camp.id,
            cadetId: currentCadet.id,
            cadetName: currentCadet.name,
            cadetYear: currentCadet.year,
            cadetRegimentalNumber: currentCadet.regimentalNumber,
            status: 'Pending',
        };

        // Simulate API call
        setTimeout(() => {
            onRegister(newRegistration);
            setIsSubmitting(false);
            setIsOpen(false);
            form.reset();
            toast({
                title: "Registration Submitted!",
                description: `Your registration for ${camp.name} is pending approval.`,
            });
        }, 1000);
    }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Registration for {camp.name}</DialogTitle>
          <DialogDescription>
            Please confirm your details below before submitting your registration.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField control={form.control} name="cadetName" render={({field}) => (
                    <FormItem>
                        <FormLabel>Cadet Name</FormLabel>
                        <FormControl><Input {...field} disabled /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="regimentalNumber" render={({field}) => (
                    <FormItem>
                        <FormLabel>Regimental Number</FormLabel>
                        <FormControl><Input {...field} disabled /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                
                 <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                         {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                         {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
