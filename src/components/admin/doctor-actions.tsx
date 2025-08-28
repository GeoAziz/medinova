
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
import { UserPlus, Edit, Trash2, Users, Copy } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import type { Doctor } from '@/app/(main)/admin/doctors/page';
import { addDoctor, updateDoctor, deleteDoctor } from '@/lib/actions/doctor.actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const specialties = ["Cardiology", "Neurology", "Dermatology", "Orthopedics", "Pediatrics", "Oncology", "Radiology", "Emergency Medicine"];
const departments = ["Medical", "Surgical", "Pediatrics", "Emergency", "Diagnostics", "Outpatient"];
const schedules = ["Mon-Fri (9am-5pm)", "Rotating Shifts", "Night Shift (7pm-7am)", "Weekend Coverage", "On-Call"];


type DoctorActionsProps = 
  | { mode: 'add'; }
  | { mode: 'edit'; doctor: Doctor; };

export function DoctorActions(props: DoctorActionsProps) {
  const { mode } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null | undefined>(null);

  const { toast } = useToast();

  const initialState: { message: string | null, errors?: any, type: string, link?: string | null } = { message: null, type: '' };
  const action = mode === 'add' ? addDoctor : updateDoctor.bind(null, props.mode === 'edit' ? props.doctor.id : '');
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
    const result = await deleteDoctor(props.doctor.id);
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

  const defaultValues = mode === 'edit' ? props.doctor : {} as Doctor;

  return (
    <div className="flex gap-2 justify-end">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {mode === 'add' ? (
            <Button><UserPlus className="mr-2 h-4 w-4" /> Add Doctor</Button>
          ) : (
            <Button size="icon" variant="outline"><Edit className="h-4 w-4" /></Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{mode === 'add' ? 'Add New Doctor' : 'Edit Doctor Profile'}</DialogTitle>
            <DialogDescription>
              {mode === 'add' ? 'Fill in the details for the new doctor.' : `Editing profile for ${defaultValues.name}.`}
            </DialogDescription>
          </DialogHeader>
          <form action={dispatch}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" defaultValue={defaultValues.name} required />
              </div>
               <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={defaultValues.email} required readOnly={mode === 'edit'} />
                 { mode === 'add' && <p className="text-xs text-muted-foreground">The user will be invited via this email.</p> }
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialty">Specialty</Label>
                <Select name="specialty" defaultValue={defaultValues.specialty} required>
                    <SelectTrigger id="specialty">
                        <SelectValue placeholder="Select specialty..." />
                    </SelectTrigger>
                    <SelectContent>
                        {specialties.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                 <Select name="department" defaultValue={defaultValues.department} required>
                    <SelectTrigger id="department">
                        <SelectValue placeholder="Select department..." />
                    </SelectTrigger>
                    <SelectContent>
                         {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                </Select>
              </div>
               <div className="space-y-2 md:col-span-2">
                <Label htmlFor="schedule">Schedule</Label>
                <Select name="schedule" defaultValue={defaultValues.schedule}>
                    <SelectTrigger id="schedule">
                        <SelectValue placeholder="Select schedule..." />
                    </SelectTrigger>
                    <SelectContent>
                         {schedules.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                </Select>
              </div>
               <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" name="bio" defaultValue={defaultValues.bio} className="min-h-24" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{mode === 'add' ? 'Create Doctor Profile' : 'Save Changes'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
       <AlertDialog open={showLink} onOpenChange={setShowLink}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Doctor Created Successfully!</AlertDialogTitle>
            <AlertDialogDescription>
              Please share this secure link with the new doctor to allow them to set their password. This link will only be shown once.
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
        <>
          <Button size="icon" variant="outline" disabled>
            <Users className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="icon" variant="destructive"><Trash2 className="h-4 w-4" /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the doctor's profile and user record.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}
