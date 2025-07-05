"use client";

import { useState } from 'react';
import { Loader2, ShieldCheck, ShieldAlert, ExternalLink, ThumbsUp, ThumbsDown } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { CampRegistrationForm } from "@/components/cadet/camp-registration-form";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { verifyCampLinkIntegrity, type CampLinkIntegrityOutput } from '@/ai/flows/camp-link-integrity-verification';
import type { Camp } from "@/lib/types";

interface VerifyLinkDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  camp: Camp;
}

type VerificationStatus = 'idle' | 'loading' | 'success' | 'error';

export function VerifyLinkDialog({ isOpen, setIsOpen, camp }: VerifyLinkDialogProps) {
  const [status, setStatus] = useState<VerificationStatus>('idle');
  const [result, setResult] = useState<CampLinkIntegrityOutput | null>(null);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  const handleVerify = async () => {
    setStatus('loading');
    try {
      const res = await verifyCampLinkIntegrity({
        campName: camp.name,
        campRegistrationLink: camp.registrationLink,
      });
      setResult(res);
      setStatus('success');
    } catch (error) {
      console.error("Verification failed:", error);
      setStatus('error');
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
        setStatus('idle');
        setResult(null);
    }
    setIsOpen(open);
  }

  const handleProceed = () => {
    setIsOpen(false);
    setIsRegistrationOpen(true);
  }

  return (
    <>
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Security Check</DialogTitle>
          <DialogDescription>
            We are verifying the integrity of the registration link for your safety.
          </DialogDescription>
        </DialogHeader>
        
        {status === 'idle' && (
             <div className="flex flex-col items-center justify-center gap-4 py-8">
                <ShieldCheck className="h-16 w-16 text-primary" />
                <p className="text-center text-muted-foreground">Click the button below to verify the link for <br/><strong>{camp.name}</strong>.</p>
             </div>
        )}
        
        {status === 'loading' && (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <p>Verifying link...</p>
            </div>
        )}

        {status === 'error' && (
             <Alert variant="destructive">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Verification Failed</AlertTitle>
                <AlertDescription>
                    We couldn't verify the link. Please contact your unit administrator.
                </AlertDescription>
            </Alert>
        )}

        {status === 'success' && result && (
            <Alert variant={result.isValid ? 'default' : 'destructive'} className="border-2">
                {result.isValid ? <ThumbsUp className="h-4 w-4" /> : <ThumbsDown className="h-4 w-4" />}
                <AlertTitle>{result.isValid ? 'Link is Secure' : 'Potential Risk Detected'}</AlertTitle>
                <AlertDescription>
                    {result.reason}
                </AlertDescription>
            </Alert>
        )}

        <DialogFooter className="gap-2 sm:justify-end">
            {status === 'idle' && <Button onClick={handleVerify}>Verify Link</Button>}
            {status === 'success' && result?.isValid && <Button onClick={handleProceed}>Proceed to Registration</Button>}
            {status === 'success' && !result?.isValid && (
                <a href={camp.registrationLink} target="_blank" rel="noopener noreferrer">
                    <Button variant="destructive" className="w-full"><ExternalLink className="mr-2 h-4 w-4"/>Proceed Anyway</Button>
                </a>
            )}
             <Button variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <CampRegistrationForm 
        isOpen={isRegistrationOpen}
        setIsOpen={setIsRegistrationOpen}
        camp={camp}
    />
    </>
  );
}
