'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FilePlus, Loader2, Sparkles } from 'lucide-react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { generatePrescriptionNotes } from '@/ai/flows/generate-prescription-notes';
import { mockDoctor, mockDoctorPatients, mockMedicalHistory } from '@/lib/data';

const prescriptionSchema = z.object({
  patientName: z.string().min(1, 'Patient name is required'),
  medicationName: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
});

type PrescriptionFormValues = z.infer<typeof prescriptionSchema>;

export function PrescriptionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedNotes, setGeneratedNotes] = useState('');
  const { toast } = useToast();

  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionSchema),
  });

  const handleGenerateNotes = async () => {
    const { patientName, medicationName } = form.getValues();
    if (!patientName || !medicationName) {
      form.trigger();
      return;
    }
    
    setIsLoading(true);
    setGeneratedNotes('');

    try {
      const result = await generatePrescriptionNotes({
        medicationName,
        patientName,
        patientAge: 32, // Mock data
        patientMedicalHistory: mockMedicalHistory.map(r => r.summary).join('\n'), // Mock data
        doctorName: mockDoctor.name,
      });
      setGeneratedNotes(result.notes);
      toast({ title: 'AI Notes Generated', description: 'Patient notes have been successfully generated.' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error Generating Notes',
        description: 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit: SubmitHandler<PrescriptionFormValues> = (data) => {
    console.log({ ...data, notes: generatedNotes });
    toast({ title: 'Prescription Saved', description: `Prescription for ${data.medicationName} has been saved for ${data.patientName}.` });
    setIsOpen(false);
    form.reset();
    setGeneratedNotes('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"><FilePlus className="mr-2 h-4 w-4" /> Write Prescription</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>New Prescription</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new prescription. Use the AI assistant to generate patient notes.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="patientName" className="text-right">Patient</Label>
              <Input id="patientName" {...form.register('patientName')} className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="medicationName" className="text-right">Medication</Label>
              <Input id="medicationName" {...form.register('medicationName')} className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dosage" className="text-right">Dosage</Label>
              <Input id="dosage" {...form.register('dosage')} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <div className="text-right mt-2">
                <Label htmlFor="notes">AI Notes</Label>
                <Button type="button" size="sm" variant="ghost" onClick={handleGenerateNotes} disabled={isLoading} className="mt-2 w-full">
                  {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <><Sparkles className="mr-2 h-4 w-4"/> Generate</>}
                </Button>
              </div>
              <Textarea id="notes" value={generatedNotes} onChange={e => setGeneratedNotes(e.target.value)} placeholder="Click 'Generate' to create AI-powered patient notes..." className="col-span-3 min-h-32" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Prescription</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
