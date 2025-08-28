
'use client';

import { useState, useEffect } from 'react';
import { useActionState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { UserPlus, Edit, Trash2 } from 'lucide-react';
import type { Receptionist } from '@/app/(main)/admin/receptionists/page';
import { addReceptionist, updateReceptionist, deleteReceptionist } from '@/lib/actions/receptionist.actions';

type ReceptionistActionsProps = 
  | { mode: 'add'; }
  | { mode: 'edit'; receptionist: Receptionist; };

export function ReceptionistActions(props: ReceptionistActionsProps) {
  const { mode } = props;
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const initialState = { message: null, errors: {}, type: '' };
  const action = mode === 'add' ? addReceptionist : updateReceptionist.bind(null, props.mode === 'edit' ? props.receptionist.id : '');
  const [state, dispatch] = useActionState(action, initialState);

  useEffect(() => {
    if (state.type === 'success') {
      toast({ title: 'Success!', description: state.message });
      setIsOpen(false);
    } else if (state.type === 'error') {
      toast({ variant: 'destructive', title: 'Error', description: state.message });
    }
  }, [state, toast]);

   const handleDelete = async () => {
    if (props.mode !== 'edit') return;
    const result = await deleteReceptionist(props.receptionist.id);
    if (result.type === 'success') {
      toast({ title: 'Success!', description: result.message });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message });
    }
  };

  const defaultValues = mode === 'edit' ? props.receptionist : {} as Receptionist;

  return (
    <div className="flex gap-2 justify-end">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {mode === 'add' ? (
            <Button><UserPlus className="mr-2 h-4 w-4" /> Add Receptionist</Button>
          ) : (
            <Button size="icon" variant="outline"><Edit className="h-4 w-4" /></Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{mode === 'add' ? 'Add New Receptionist' : 'Edit Receptionist Profile'}</DialogTitle>
            <DialogDescription>
              {mode === 'add' ? 'Fill in the details for the new receptionist.' : `Editing profile for ${defaultValues.name}.`}
            </DialogDescription>
          </DialogHeader>
          <form action={dispatch} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" defaultValue={defaultValues.name} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" defaultValue={defaultValues.email} readOnly={mode==='edit'} />
                    { mode === 'add' && <p className="text-xs text-muted-foreground">Password will be sent to this email.</p> }
                </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
                <div>
                    <Label htmlFor="appointmentsHandled">Appointments Handled</Label>
                    <Input id="appointmentsHandled" name="appointmentsHandled" type="number" defaultValue={defaultValues.appointmentsHandled} />
                </div>
                <div>
                    <Label htmlFor="incomingCalls">Incoming Calls</Label>
                    <Input id="incomingCalls" name="incomingCalls" type="number" defaultValue={defaultValues.incomingCalls} />
                </div>
            </div>
            <DialogFooter>
              <Button type="submit">{mode === 'add' ? 'Add Receptionist' : 'Save Changes'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {mode === 'edit' && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
             <Button size="icon" variant="destructive"><Trash2 className="h-4 w-4" /></Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the receptionist's profile.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
