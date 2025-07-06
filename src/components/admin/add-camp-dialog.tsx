"use client";

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { createCamp } from '@/lib/actions/camp.actions';

interface AddCampDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Camp
        </Button>
    )
}

export function AddCampDialog({ isOpen, onOpenChange }: AddCampDialogProps) {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 9),
  });

   const [state, formAction] = useActionState(async (prevState: any, formData: FormData) => {
        if (!dateRange?.from || !dateRange?.to) {
            return { type: 'error', message: 'Please select a valid date range.' };
        }
        formData.append('startDate', dateRange.from.toISOString());
        formData.append('endDate', dateRange.to.toISOString());

        const result = await createCamp(prevState, formData);
        if (result?.type === 'success') {
            toast({ title: 'Success', description: 'New camp has been created.' });
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
          <DialogTitle>Create New Camp</DialogTitle>
          <DialogDescription>Fill in the details for the new camp below.</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div>
            <Label htmlFor="name">Camp Name</Label>
            <Input id="name" name="name" required />
            {state?.errors?.name && <p className="text-sm text-destructive mt-1">{state.errors.name[0]}</p>}
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" required />
            {state?.errors?.location && <p className="text-sm text-destructive mt-1">{state.errors.location[0]}</p>}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" required />
            {state?.errors?.description && <p className="text-sm text-destructive mt-1">{state.errors.description[0]}</p>}
          </div>
          <div>
            <Label>Camp Dates</Label>
            <Popover>
                <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                    dateRange.to ? (
                        <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                        </>
                    ) : (
                        format(dateRange.from, "LLL dd, y")
                    )
                    ) : (
                    <span>Pick a date range</span>
                    )}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                />
                </PopoverContent>
            </Popover>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
