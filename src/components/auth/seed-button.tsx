"use client";

import { useEffect, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Database } from "lucide-react";

import { seedDatabase } from "@/lib/actions/seed.actions";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="destructive" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Seeding...
        </>
      ) : (
        <>
          <Database className="mr-2 h-4 w-4" />
          Seed Database
        </>
      )}
    </Button>
  );
}

export function SeedButton() {
  const { toast } = useToast();
  const [state, formAction] = useActionState(seedDatabase, null);

  useEffect(() => {
    if (!state) return;
    if (state.type === "success" || state.type === 'info') {
      toast({
        title: state.type === 'success' ? "Success" : "Info",
        description: state.message,
      });
    } else if (state.type === 'error') {
        toast({
            variant: 'destructive',
            title: 'Seeding Failed',
            description: state.message,
        });
    }
  }, [state, toast]);

  return (
    <form action={formAction}>
      {state?.type === "error" && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Seeding Failed</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
      <SubmitButton />
    </form>
  );
}
