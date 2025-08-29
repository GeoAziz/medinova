
'use client';

import { useToast } from '@/hooks/use-toast';
import { Button } from '../ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Check, ShieldQuestion, X, Loader2 } from 'lucide-react';
import { approveAccessRequest, denyAccessRequest } from '@/lib/actions/access-request.actions';
import { useState } from 'react';

type AccessRequestActionsProps = {
    requestId: string;
    patientId: string;
    status: string;
}

export function AccessRequestActions({ requestId, patientId, status }: AccessRequestActionsProps) {
  const { toast } = useToast();
  const [isApproving, setIsApproving] = useState(false);
  const [isDenying, setIsDenying] = useState(false);

  const handleApprove = async () => {
    setIsApproving(true);
    const result = await approveAccessRequest(requestId, patientId);
    if (result.type === 'success') {
      toast({ title: 'Success!', description: result.message });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message });
    }
    setIsApproving(false);
  };
  
  const handleDeny = async () => {
    setIsDenying(true);
    const result = await denyAccessRequest(requestId, patientId);
     if (result.type === 'success') {
      toast({ title: 'Success!', description: result.message });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message });
    }
    setIsDenying(false);
  }

  const isPending = status === 'Pending';

  return (
    <div className="flex gap-2 justify-end">
       <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="icon" variant={isPending ? "default" : "outline"} disabled={!isPending || isApproving || isDenying}>
               { isApproving ? <Loader2 className="h-4 w-4 animate-spin"/> : <Check className="h-4 w-4" /> }
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Approve this request?</AlertDialogTitle>
              <AlertDialogDescription>
                This will grant the requesting user one-time access to the specified patient's record. This action will be logged.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleApprove}>Approve</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="icon" variant={isPending ? "destructive" : "outline"} disabled={!isPending || isApproving || isDenying}>
                { isDenying ? <Loader2 className="h-4 w-4 animate-spin"/> : <X className="h-4 w-4" /> }
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Deny this request?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently deny this access request. This action will be logged.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeny}>Deny</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <Button size="icon" variant="outline" disabled>
            <ShieldQuestion className="h-4 w-4" />
        </Button>
    </div>
  );
}
