"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Wand2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

import { autocompleteCampRegistration } from '@/ai/flows/autocomplete-camp-registration';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { Camp } from '@/lib/types';

interface CampRegistrationFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  camp: Camp;
}

const registrationSchema = z.object({
    cadetName: z.string().min(1, 'Cadet name is required'),
    regimentalNumber: z.string().min(1, 'Regimental number is required'),
    studentId: z.string().min(1, 'Student ID is required'),
    otherInfo: z.string().optional(),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

// Assuming we have the current user's name
const currentCadetName = "Ankit Sharma";

export function CampRegistrationForm({ isOpen, setIsOpen, camp }: CampRegistrationFormProps) {
    const [isAutofilling, setIsAutofilling] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const form = useForm<RegistrationFormValues>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            cadetName: currentCadetName,
            regimentalNumber: '',
            studentId: '',
            otherInfo: '',
        }
    });

    const handleAutofill = async () => {
        setIsAutofilling(true);
        try {
            const result = await autocompleteCampRegistration({
                cadetName: currentCadetName,
                campDetails: `Camp: ${camp.title}, Location: ${camp.location}, Dates: ${format(camp.startDate, "P")} to ${format(camp.endDate, "P")}`,
            });

            form.setValue('regimentalNumber', result.regimentalNumber);
            form.setValue('studentId', result.studentId);
            form.setValue('otherInfo', result.otherKnownInformation);
            
            toast({
                title: "Information Autofilled",
                description: "Your details have been pre-filled using AI.",
            });
        } catch (error) {
            console.error("Autofill failed:", error);
            toast({
                variant: "destructive",
                title: "Autofill Failed",
                description: "Could not retrieve your information at this time.",
            });
        } finally {
            setIsAutofilling(false);
        }
    };
    
    const onSubmit = (data: RegistrationFormValues) => {
        setIsSubmitting(true);
        console.log("Form submitted:", data);
        
        // In a real app, you would save this data to localStorage or a database
        // localStorage.setItem(`camp_reg_${camp.id}`, JSON.stringify(data));
        
        setTimeout(() => {
            setIsSubmitting(false);
            setIsOpen(false);
            form.reset();
            toast({
                title: "Registration Successful!",
                description: `You have successfully registered for ${camp.title}.`,
            });
        }, 1500);
    }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Register for {camp.title}</DialogTitle>
          <DialogDescription>
            Fill in your details below. Use the AI assistant to speed things up!
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <Button type="button" variant="outline" onClick={handleAutofill} disabled={isAutofilling} className="w-full">
                    {isAutofilling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                    {isAutofilling ? 'Autofilling...' : 'Autofill with AI'}
                </Button>

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
                        <FormControl><Input {...field} placeholder="e.g., PB20SDA123456" /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="studentId" render={({field}) => (
                    <FormItem>
                        <FormLabel>Student ID</FormLabel>
                        <FormControl><Input {...field} placeholder="e.g., 20BCS1024" /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="otherInfo" render={({field}) => (
                    <FormItem>
                        <FormLabel>Other Known Information</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                
                 <DialogFooter>
                    <Button type="submit" disabled={isSubmitting} className="w-full">
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
