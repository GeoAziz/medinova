'use server';

/**
 * @fileOverview An AI agent to help doctors diagnose conditions based on symptoms and medical history.
 *
 * - diagnoseCondition - A function that handles the diagnosis process.
 * - DiagnoseConditionInput - The input type for the diagnoseCondition function.
 * - DiagnoseConditionOutput - The return type for the diagnoseCondition function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnoseConditionInputSchema = z.object({
  symptoms: z.string().describe('The current symptoms reported by the patient.'),
  medicalHistory: z
    .string()
    .describe('The relevant medical history of the patient.'),
});
export type DiagnoseConditionInput = z.infer<typeof DiagnoseConditionInputSchema>;

const DiagnoseConditionOutputSchema = z.object({
  potentialDiagnosis: z
    .string()
    .describe('The most likely diagnosis based on the provided information.'),
  rationale: z
    .string()
    .describe('The reasoning and clinical evidence behind the potential diagnosis.'),
  nextSteps: z
    .string()
    .describe('Recommended next steps, such as tests or specialist referrals.'),
});
export type DiagnoseConditionOutput = z.infer<typeof DiagnoseConditionOutputSchema>;

export async function diagnoseCondition(
  input: DiagnoseConditionInput
): Promise<DiagnoseConditionOutput> {
  return diagnoseConditionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnoseConditionPrompt',
  input: {schema: DiagnoseConditionInputSchema},
  output: {schema: DiagnoseConditionOutputSchema},
  prompt: `You are an AI medical assistant designed to help doctors with differential diagnoses. Your purpose is to provide a potential diagnosis, rationale, and recommended next steps based on patient information. This is not a substitute for a professional medical opinion.

  Analyze the following patient data:
  - Current Symptoms: {{{symptoms}}}
  - Medical History: {{{medicalHistory}}}

  Based on this information, provide a structured response including:
  1.  A potential diagnosis.
  2.  The rationale for this diagnosis, citing how the symptoms and history support it.
  3.  Recommended next steps for the attending physician (e.g., specific lab tests, imaging studies, or specialist consultations).
  `,
});

const diagnoseConditionFlow = ai.defineFlow(
  {
    name: 'diagnoseConditionFlow',
    inputSchema: DiagnoseConditionInputSchema,
    outputSchema: DiagnoseConditionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
