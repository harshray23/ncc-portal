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
import { useToast } from '@/hooks/use-toast';
import { addStaff } from '@/lib/actions/staff.actions';

interface AddStaffDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {pending ? "Adding..." : "Add Staff Member"}
        </Button>
    )
}

export function AddStaffDialog({ isOpen, onOpenChange }: AddStaffDialogProps) {
    const { toast } = useToast();
    
    const [state, formAction] = useActionState(async (prevState: any, formData: FormData) => {
        const result = await addStaff(prevState, formData);
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
                    <DialogTitle>Add New Staff Member</DialogTitle>
                    <DialogDescription>
                        Fill in the details below. The initial password will be `password123`.
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" name="name" placeholder="John Doe" required />
                            {state?.errors?.name && <p className="text-sm text-destructive mt-1">{state.errors.name[0]}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" name="email" type="email" placeholder="name@example.com" required />
                            {state?.errors?.email && <p className="text-sm text-destructive mt-1">{state.errors.email[0]}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="rank">Rank</Label>
                            <Input id="rank" name="rank" placeholder="Major" required />
                             {state?.errors?.rank && <p className="text-sm text-destructive mt-1">{state.errors.rank[0]}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                             <Select name="role" required defaultValue="manager">
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Select Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="manager">Manager</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                            {state?.errors?.role && <p className="text-sm text-destructive mt-1">{state.errors.role[0]}</p>}
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="unit">Unit/Battalion</Label>
                            <Input id="unit" name="unit" placeholder="10 Bengal Battalion" required />
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
