'use server';

/**
 * @fileOverview An AI agent to generate prescription notes for doctors to inform patients.
 *
 * - generatePrescriptionNotes - A function that handles the generation of prescription notes.
 * - GeneratePrescriptionNotesInput - The input type for the generatePrescriptionNotes function.
 * - GeneratePrescriptionNotesOutput - The return type for the generatePrescriptionNotes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePrescriptionNotesInputSchema = z.object({
  medicationName: z.string().describe('The name of the medication.'),
  patientName: z.string().describe('The name of the patient.'),
  patientAge: z.number().describe('The age of the patient.'),
  patientMedicalHistory: z
    .string()
    .describe('The medical history of the patient.'),
  doctorName: z.string().describe('The name of the doctor.'),
});
export type GeneratePrescriptionNotesInput = z.infer<
  typeof GeneratePrescriptionNotesInputSchema
>;

const GeneratePrescriptionNotesOutputSchema = z.object({
  notes: z
    .string()
    .describe(
      'Notes about possible side effects and other considerations for the patient.'
    ),
});
export type GeneratePrescriptionNotesOutput = z.infer<
  typeof GeneratePrescriptionNotesOutputSchema
>;

export async function generatePrescriptionNotes(
  input: GeneratePrescriptionNotesInput
): Promise<GeneratePrescriptionNotesOutput> {
  return generatePrescriptionNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePrescriptionNotesPrompt',
  input: {schema: GeneratePrescriptionNotesInputSchema},
  output: {schema: GeneratePrescriptionNotesOutputSchema},
  prompt: `You are a medical AI assistant helping doctors inform patients about their prescriptions.

  Based on the medication, patient details, and medical history, generate notes about possible side effects and other considerations for the patient.

  Medication: {{{medicationName}}}
  Patient Name: {{{patientName}}}
  Patient Age: {{{patientAge}}}
  Patient Medical History: {{{patientMedicalHistory}}}
  Doctor Name: {{{doctorName}}}

  Notes:`,
});

const generatePrescriptionNotesFlow = ai.defineFlow(
  {
    name: 'generatePrescriptionNotesFlow',
    inputSchema: GeneratePrescriptionNotesInputSchema,
    outputSchema: GeneratePrescriptionNotesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
