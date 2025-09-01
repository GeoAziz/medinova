
'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Check, X, MessageSquare, Loader2 } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { fulfillPrescription, rejectPrescription } from '@/lib/actions/prescription.actions';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

type PrescriptionActionsProps = {
  prescriptionId: string;
  status: string;
};

export function PrescriptionActions({ prescriptionId, status }: PrescriptionActionsProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  const handleFulfill = async () => {
    setIsLoading(true);
    const result = await fulfillPrescription(prescriptionId);
    if (result.type === 'success') {
      toast({ title: 'Success', description: result.message });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message });
    }
    setIsLoading(false);
  };

  const handleReject = async () => {
    if (!rejectionReason) {
        toast({ variant: 'destructive', title: 'Error', description: "Rejection reason cannot be empty." });
        return;
    }
    setIsLoading(true);
    const result = await rejectPrescription(prescriptionId, rejectionReason);
    if (result.type === 'success') {
      toast({ title: 'Success', description: result.message });
      setIsRejectDialogOpen(false);
      setRejectionReason('');
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message });
    }
    setIsLoading(false);
  };

  const isPending = status === 'Pending';

  return (
    <div className="flex gap-2 justify-end">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="icon" variant="outline" disabled={!isPending || isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Fulfillment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this prescription as "Fulfilled"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleFulfill}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogTrigger asChild>
            <Button size="icon" variant="destructive" disabled={!isPending || isLoading}>
                <X className="h-4 w-4" />
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Reject Prescription</DialogTitle>
                <DialogDescription>
                    Please provide a reason for rejecting this prescription. This will be logged.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <Label htmlFor="rejectionReason" className="sr-only">Rejection Reason</Label>
                <Textarea 
                    id="rejectionReason" 
                    value={rejectionReason} 
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g., Potential drug interaction, requires doctor clarification..."
                />
            </div>
            <DialogFooter>
                <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                <Button onClick={handleReject} disabled={isLoading || !rejectionReason}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Reject Prescription
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Button size="icon" variant="outline">
        <MessageSquare className="h-4 w-4" />
      </Button>
    </div>
  );
}
