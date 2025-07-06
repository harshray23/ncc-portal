"use client";

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import type { Camp } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const campSchema = z.object({
  name: z.string().min(1, 'Camp name is required.'),
  location: z.string().min(1, 'Location is required.'),
  description: z.string().min(1, 'Description is required.'),
  dates: z.object({
    from: z.date(),
    to: z.date(),
  }),
});

interface AddCampDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onCampAdded: (newCamp: Camp) => void;
}

export function AddCampDialog({ isOpen, onOpenChange, onCampAdded }: AddCampDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
    resolver: zodResolver(campSchema),
    defaultValues: {
      name: '',
      location: '',
      description: '',
      dates: {
        from: new Date(),
        to: addDays(new Date(), 9),
      },
    },
  });

  const onSubmit = (data: z.infer<typeof campSchema>) => {
    setIsSubmitting(true);
    const newCamp: Camp = {
      id: `CAMP-${Date.now()}`,
      name: data.name,
      location: data.location,
      description: data.description,
      startDate: data.dates.from,
      endDate: data.dates.to,
      status: 'Upcoming',
    };
    
    // Simulate API call
    setTimeout(() => {
        onCampAdded(newCamp);
        toast({ title: "Success", description: "New camp has been created." });
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
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Camp</DialogTitle>
          <DialogDescription>Fill in the details for the new camp below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Camp Name</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...register('location')} />
            {errors.location && <p className="text-sm text-destructive mt-1">{errors.location.message}</p>}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} />
            {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
          </div>
          <div>
            <Label>Camp Dates</Label>
            <Controller
              name="dates"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value?.from ? (
                        field.value.to ? (
                          <>
                            {format(field.value.from, "LLL dd, y")} -{" "}
                            {format(field.value.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(field.value.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      defaultMonth={field.value.from}
                      selected={{ from: field.value.from, to: field.value.to }}
                      onSelect={(range) => field.onChange({ from: range?.from, to: range?.to })}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Camp
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
