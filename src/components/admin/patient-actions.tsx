
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
import { UserPlus, Edit, Trash2, FileText, Copy } from 'lucide-react';
import type { Patient } from '@/app/(main)/admin/patients/page';
import type { Doctor } from '@/app/(main)/admin/doctors/page';
import { addPatient, updatePatient, deletePatient } from '@/lib/actions/patient.actions';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { PatientDetailsSheet } from './patient-details-sheet';

type PatientActionsProps = 
  ( { mode: 'add'; doctors: Doctor[] } )
  | { mode: 'edit'; patient: Patient; doctors: Doctor[] };

export function PatientActions(props: PatientActionsProps) {
  const { mode, doctors } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null | undefined>(null);
  const { toast } = useToast();

  const initialState: { message: string | null, errors?: any, type: string, link?: string | null } = { message: null, type: '' };
  const action = mode === 'add' ? addPatient : updatePatient.bind(null, props.mode === 'edit' ? props.patient.id : '');
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
    const result = await deletePatient(props.patient.id);
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

  const defaultValues = mode === 'edit' ? props.patient : {} as Patient;

  return (
    <div className="flex gap-2 justify-end">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {mode === 'add' ? (
                    <Button><UserPlus className="mr-2 h-4 w-4" /> Add Patient</Button>
                ) : (
                    <Button size="icon" variant="outline"><Edit className="h-4 w-4" /></Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{mode === 'add' ? 'Add New Patient' : 'Edit Patient Profile'}</DialogTitle>
                    <DialogDescription>
                        {mode === 'add' ? 'Fill in the details for the new patient.' : `Editing profile for ${defaultValues.name}.`}
                    </DialogDescription>
                </DialogHeader>
                <form action={dispatch} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                     <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" defaultValue={defaultValues.name} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" defaultValue={defaultValues.email} required readOnly={mode === 'edit'}/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" name="phone" type="tel" defaultValue={defaultValues.phone} required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="nationalId">National ID</Label>
                        <Input id="nationalId" name="nationalId" defaultValue={defaultValues.nationalId} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                            <Label htmlFor="age">Age</Label>
                            <Input id="age" name="age" type="number" defaultValue={defaultValues.age} required/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                                <Select name="gender" defaultValue={defaultValues.gender} required>
                                <SelectTrigger id="gender">
                                    <SelectValue placeholder="Select gender..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="room">Room Assignment</Label>
                            <Input id="room" name="room" defaultValue={defaultValues.room} required/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select name="status" defaultValue={defaultValues.status}>
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Select status..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="In-Patient">In-Patient</SelectItem>
                                    <SelectItem value="Out-Patient">Out-Patient</SelectItem>
                                    <SelectItem value="Critical">Critical</SelectItem>
                                    <SelectItem value="Discharged">Discharged</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                     <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="assignedDoctor">Assigned Doctor</Label>
                        <Select name="assignedDoctor" defaultValue={defaultValues.assignedDoctor}>
                            <SelectTrigger id="assignedDoctor">
                                <SelectValue placeholder="Select a doctor..." />
                            </SelectTrigger>
                            <SelectContent>
                                {doctors.map(doctor => (
                                    <SelectItem key={doctor.id} value={doctor.id}>{doctor.name} - {doctor.specialty}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="diagnosis">Primary Diagnosis</Label>
                        <Input id="diagnosis" name="diagnosis" defaultValue={defaultValues.diagnosis} />
                    </div>
                     <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea id="notes" name="notes" defaultValue={defaultValues.notes} placeholder="Add any relevant notes..." />
                    </div>
                    <DialogFooter className="md:col-span-2">
                        <Button type="submit">{mode === 'add' ? 'Add Patient' : 'Save Changes'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
        
        <AlertDialog open={showLink} onOpenChange={setShowLink}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Patient Created Successfully!</AlertDialogTitle>
              <AlertDialogDescription>
                Please share this secure link with the new patient to allow them to set their password. This link will only be shown once.
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
                <PatientDetailsSheet patient={props.patient} doctors={doctors} />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="icon" variant="destructive"><Trash2 className="h-4 w-4" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the patient's record.
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
