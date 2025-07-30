'use server';
/**
 * @fileOverview Summarizes a patient's medical history.
 *
 * - summarizeMedicalHistory - A function that handles the summarization of a patient's medical history.
 * - SummarizeMedicalHistoryInput - The input type for the summarizeMedicalHistory function.
 * - SummarizeMedicalHistoryOutput - The return type for the summarizeMedicalHistory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeMedicalHistoryInputSchema = z.object({
  medicalHistory: z
    .string()
    .describe('The complete medical history of the patient.'),
});
export type SummarizeMedicalHistoryInput = z.infer<typeof SummarizeMedicalHistoryInputSchema>;

const SummarizeMedicalHistoryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the patient medical history.'),
});
export type SummarizeMedicalHistoryOutput = z.infer<typeof SummarizeMedicalHistoryOutputSchema>;

export async function summarizeMedicalHistory(input: SummarizeMedicalHistoryInput): Promise<SummarizeMedicalHistoryOutput> {
  return summarizeMedicalHistoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeMedicalHistoryPrompt',
  input: {schema: SummarizeMedicalHistoryInputSchema},
  output: {schema: SummarizeMedicalHistoryOutputSchema},
  prompt: `You are an expert medical summarizer. Please provide a concise summary of the following medical history:\n\nMedical History: {{{medicalHistory}}}`,
});

const summarizeMedicalHistoryFlow = ai.defineFlow(
  {
    name: 'summarizeMedicalHistoryFlow',
    inputSchema: SummarizeMedicalHistoryInputSchema,
    outputSchema: SummarizeMedicalHistoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
