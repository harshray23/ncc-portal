"use client";

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addCadet } from '@/lib/actions/user.actions';
import { useToast } from '@/hooks/use-toast';

interface AddCadetDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full md:w-auto" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {pending ? "Adding Cadet..." : "Add Cadet"}
        </Button>
    )
}

export function AddCadetDialog({ isOpen, onOpenChange }: AddCadetDialogProps) {
    const { toast } = useToast();
    
    const [state, formAction] = useActionState(async (prevState: any, formData: FormData) => {
        const result = await addCadet(prevState, formData);
        if (result?.type === 'success') {
            toast({ title: 'Success', description: result.message });
            onOpenChange(false);
        } else if (result?.type === 'error') {
            toast({ variant: 'destructive', title: 'Error', description: result.message });
        }
        return result;
    }, null);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Cadet</DialogTitle>
                    <DialogDescription>
                        The cadet's initial password will be their Regimental Number.
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" name="name" placeholder="Ankit Sharma" required />
                            {state?.errors?.name && <p className="text-sm text-destructive mt-1">{state.errors.name[0]}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" name="email" type="email" placeholder="name@example.com" required />
                            {state?.errors?.email && <p className="text-sm text-destructive mt-1">{state.errors.email[0]}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="rank">Rank</Label>
                            <Input id="rank" name="rank" placeholder="Cadet" defaultValue="Cadet" required />
                             {state?.errors?.rank && <p className="text-sm text-destructive mt-1">{state.errors.rank[0]}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="regimentalNumber">Regimental Number</Label>
                            <Input id="regimentalNumber" name="regimentalNumber" placeholder="PB20SDA123456" required />
                            {state?.errors?.regimentalNumber && <p className="text-sm text-destructive mt-1">{state.errors.regimentalNumber[0]}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="studentId">Student ID</Label>
                            <Input id="studentId" name="studentId" placeholder="20BCS1024" required />
                            {state?.errors?.studentId && <p className="text-sm text-destructive mt-1">{state.errors.studentId[0]}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="year">Year</Label>
                             <Select name="year" required defaultValue='1'>
                                <SelectTrigger id="year">
                                    <SelectValue placeholder="Select Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1st Year</SelectItem>
                                    <SelectItem value="2">2nd Year</SelectItem>
                                    <SelectItem value="3">3rd Year</SelectItem>
                                </SelectContent>
                            </Select>
                            {state?.errors?.year && <p className="text-sm text-destructive mt-1">{state.errors.year[0]}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" name="phone" type="tel" required />
                             {state?.errors?.phone && <p className="text-sm text-destructive mt-1">{state.errors.phone[0]}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="whatsapp">WhatsApp Number</Label>
                            <Input id="whatsapp" name="whatsapp" type="tel" required />
                             {state?.errors?.whatsapp && <p className="text-sm text-destructive mt-1">{state.errors.whatsapp[0]}</p>}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="unit">Unit/Battalion</Label>
                            <Input id="unit" name="unit" required />
                             {state?.errors?.unit && <p className="text-sm text-destructive mt-1">{state.errors.unit[0]}</p>}
                        </div>
                    </div>
                     <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <SubmitButton />
                     </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
