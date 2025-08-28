
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
import { UserPlus, Edit, Trash2, Copy } from 'lucide-react';
import type { LabScientist } from '@/app/(main)/admin/lab-scientists/page';
import { addLabScientist, updateLabScientist, deleteLabScientist } from '@/lib/actions/lab-scientist.actions';

type LabScientistActionsProps = 
  | { mode: 'add'; }
  | { mode: 'edit'; scientist: LabScientist; };

export function LabScientistActions(props: LabScientistActionsProps) {
  const { mode } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null | undefined>(null);
  const { toast } = useToast();

  const initialState: { message: string | null, errors?: any, type: string, link?: string | null } = { message: null, type: '' };
  const action = mode === 'add' ? addLabScientist : updateLabScientist.bind(null, props.mode === 'edit' ? props.scientist.id : '');
  const [state, dispatch] = useActionState(action, initialState);

  useEffect(() => {
    if (state.type === 'success' && mode === 'add') {
      setGeneratedLink(state.link);
      setShowLink(true);
      setIsOpen(false);
    } else if (state.type === 'success') {
       toast({ title: 'Success!', description: state.message });
       setIsOpen(false);
    } else if (state.type === 'error') {
      toast({ variant: 'destructive', title: 'Error', description: state.message });
    }
  }, [state, toast, mode]);

   const handleDelete = async () => {
    if (props.mode !== 'edit') return;
    const result = await deleteLabScientist(props.scientist.id);
    if (result.type === 'success') {
      toast({ title: 'Success!', description: result.message });
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message });
    }
  };

  const copyToClipboard = () => {
    if (generatedLink) {
        navigator.clipboard.writeText(generatedLink);
        toast({ title: 'Copied to clipboard!' });
    }
  }

  const defaultValues = mode === 'edit' ? props.scientist : {} as LabScientist;

  return (
    <div className="flex gap-2 justify-end">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {mode === 'add' ? (
            <Button><UserPlus className="mr-2 h-4 w-4" /> Add Scientist</Button>
          ) : (
            <Button size="icon" variant="outline"><Edit className="h-4 w-4" /></Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{mode === 'add' ? 'Add New Lab Scientist' : 'Edit Lab Scientist Profile'}</DialogTitle>
            <DialogDescription>
              {mode === 'add' ? 'Fill in the details for the new scientist.' : `Editing profile for ${defaultValues.name}.`}
            </DialogDescription>
          </DialogHeader>
          <form action={dispatch} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" defaultValue={defaultValues.name} required />
            </div>
             <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={defaultValues.email} required readOnly={mode==='edit'} />
            </div>
            <div>
              <Label htmlFor="labType">Lab Type</Label>
              <Input id="labType" name="labType" defaultValue={defaultValues.labType} required />
            </div>
             <div>
              <Label htmlFor="recentTests">Tests This Month</Label>
              <Input id="recentTests" name="recentTests" type="number" defaultValue={defaultValues.recentTests} required />
            </div>
            <DialogFooter>
              <Button type="submit">{mode === 'add' ? 'Add Scientist' : 'Save Changes'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
       <AlertDialog open={showLink} onOpenChange={setShowLink}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Scientist Created Successfully!</AlertDialogTitle>
            <AlertDialogDescription>
              Please share this secure link with the new scientist to allow them to set their password. This link will only be shown once.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="relative">
            <Input readOnly value={generatedLink || ''} className="pr-10"/>
            <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
            </Button>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowLink(false)}>Done</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {mode === 'edit' && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
             <Button size="icon" variant="destructive"><Trash2 className="h-4 w-4" /></Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the scientist's profile and user record.
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
