'use server';

/**
 * @fileOverview An AI agent to check for potential drug interactions.
 *
 * - checkDrugInteractions - A function that handles the interaction checking process.
 * - CheckDrugInteractionsInput - The input type for the function.
 * - CheckDrugInteractionsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckDrugInteractionsInputSchema = z.object({
  currentMedications: z
    .string()
    .describe("A comma-separated list of the patient's current medications."),
  newMedication: z
    .string()
    .describe('The new medication being prescribed.'),
});
export type CheckDrugInteractionsInput = z.infer<typeof CheckDrugInteractionsInputSchema>;

const CheckDrugInteractionsOutputSchema = z.object({
  hasInteraction: z
    .boolean()
    .describe('Whether a potential interaction was detected.'),
  interactionSummary: z
    .string()
    .describe('A summary of the potential interaction, its risk level, and clinical recommendations.'),
});
export type CheckDrugInteractionsOutput = z.infer<typeof CheckDrugInteractionsOutputSchema>;

export async function checkDrugInteractions(
  input: CheckDrugInteractionsInput
): Promise<CheckDrugInteractionsOutput> {
  return checkDrugInteractionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkDrugInteractionsPrompt',
  input: {schema: CheckDrugInteractionsInputSchema},
  output: {schema: CheckDrugInteractionsOutputSchema},
  prompt: `You are an AI Pharmacist Assistant specializing in pharmacology and drug interactions. Your task is to check for potential adverse interactions between a patient's current medications and a new one.

  Analyze the following medication list:
  - Current Medications: {{{currentMedications}}}
  - New Medication: {{{newMedication}}}

  Based on this information, provide a structured response:
  1.  **hasInteraction**: A boolean indicating if a clinically significant interaction exists.
  2.  **interactionSummary**: If an interaction exists, provide a detailed summary including the nature of the interaction, the potential risk level (e.g., Low, Moderate, High), and any clinical recommendations (e.g., "monitor patient closely," "consider alternative medication," "adjust dosage"). If no interaction is found, state "No significant interactions detected."
  `,
});

const checkDrugInteractionsFlow = ai.defineFlow(
  {
    name: 'checkDrugInteractionsFlow',
    inputSchema: CheckDrugInteractionsInputSchema,
    outputSchema: CheckDrugInteractionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
