"use client";

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { seedDatabase } from '@/services/seed';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Database } from 'lucide-react';

const initialState: { message: string, success: boolean } = {
  message: '',
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="destructive" aria-disabled={pending} disabled={pending}>
      <Database className="mr-2" />
      {pending ? 'Seeding...' : 'Seed Database'}
    </Button>
  );
}

export function SeedButton() {
  const [state, formAction] = useActionState(seedDatabase, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.message) {
      toast({
        title: state.success ? 'Success' : 'Error',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
    }
  }, [state, toast]);

  return (
    <form action={formAction}>
      <SubmitButton />
    </form>
  );
}
