// src/ai/flows/suggest-treatment-options.ts
'use server';

/**
 * @fileOverview An AI agent to suggest potential treatment options based on patient data.
 *
 * - suggestTreatmentOptions - A function that suggests treatment options based on patient data.
 * - SuggestTreatmentOptionsInput - The input type for the suggestTreatmentOptions function.
 * - SuggestTreatmentOptionsOutput - The return type for the suggestTreatmentOptions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTreatmentOptionsInputSchema = z.object({
  medicalHistory: z
    .string()
    .describe('The complete medical history of the patient.'),
  currentSymptoms: z
    .string()
    .describe('The current symptoms experienced by the patient.'),
  patientAge: z.number().describe('The age of the patient in years.'),
  patientWeight: z.number().describe('The weight of the patient in kilograms.'),
  knownAllergies: z.string().describe('Known allergies of the patient.'),
});

export type SuggestTreatmentOptionsInput = z.infer<
  typeof SuggestTreatmentOptionsInputSchema
>;

const SuggestTreatmentOptionsOutputSchema = z.object({
  treatmentSuggestions: z
    .string()
    .describe('A list of potential treatment options for the patient.'),
  rationale: z
    .string()
    .describe('The rationale behind each suggested treatment option.'),
  additionalTests: z
    .string()
    .describe(
      'A list of any additional tests that should be performed before treatment.'
    ),
});

export type SuggestTreatmentOptionsOutput = z.infer<
  typeof SuggestTreatmentOptionsOutputSchema
>;

export async function suggestTreatmentOptions(
  input: SuggestTreatmentOptionsInput
): Promise<SuggestTreatmentOptionsOutput> {
  return suggestTreatmentOptionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTreatmentOptionsPrompt',
  input: {schema: SuggestTreatmentOptionsInputSchema},
  output: {schema: SuggestTreatmentOptionsOutputSchema},
  prompt: `You are an AI Medical Assistant helping doctors by suggesting potential treatment options for their patients.

  Based on the patient's medical history, current symptoms, age, weight and known allergies, suggest a few potential treatment options.  Explain the rationale behind each suggestion, and list any additional tests that should be performed before treatment.

  Medical History: {{{medicalHistory}}}
  Current Symptoms: {{{currentSymptoms}}}
  Patient Age: {{{patientAge}}}
  Patient Weight: {{{patientWeight}}}
  Known Allergies: {{{knownAllergies}}}

  Format your response as a markdown document, with each treatment suggestion followed by its rationale and any additional tests needed.
  `,
});

const suggestTreatmentOptionsFlow = ai.defineFlow(
  {
    name: 'suggestTreatmentOptionsFlow',
    inputSchema: SuggestTreatmentOptionsInputSchema,
    outputSchema: SuggestTreatmentOptionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
