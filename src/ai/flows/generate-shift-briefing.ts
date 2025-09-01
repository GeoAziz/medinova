'use server';

/**
 * @fileOverview An AI agent to generate a daily briefing for a doctor.
 *
 * - generateShiftBriefing - A function that handles the briefing generation.
 * - GenerateShiftBriefingInput - The input type for the function.
 * - GenerateShiftBriefingOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateShiftBriefingInputSchema = z.object({
  doctorName: z.string().describe("The doctor's name."),
  appointmentCount: z.number().describe('The total number of appointments for the day.'),
  patientCount: z.number().describe('The total number of patients assigned to the doctor.'),
  criticalPatientCount: z.number().describe('The number of patients with a "Critical" status.'),
  patientNames: z.array(z.string()).describe('A list of names for the most important patients to highlight.'),
});
export type GenerateShiftBriefingInput = z.infer<typeof GenerateShiftBriefingInputSchema>;

const GenerateShiftBriefingOutputSchema = z.object({
  briefing: z
    .string()
    .describe('A concise, friendly, and professional briefing for the doctor, written in natural language.'),
});
export type GenerateShiftBriefingOutput = z.infer<typeof GenerateShiftBriefingOutputSchema>;

export async function generateShiftBriefing(
  input: GenerateShiftBriefingInput
): Promise<GenerateShiftBriefingOutput> {
  return generateShiftBriefingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateShiftBriefingPrompt',
  input: {schema: GenerateShiftBriefingInputSchema},
  output: {schema: GenerateShiftBriefingOutputSchema},
  prompt: `You are Zizo, an AI Medical Assistant. Your task is to provide a clear, concise, and friendly morning briefing for a doctor in the Zizo_MediVerse.

  Use the following data to generate the briefing for Dr. {{{doctorName}}}:
  - Total Appointments Today: {{{appointmentCount}}}
  - Assigned Patients: {{{patientCount}}}
  - Critical Patients: {{{criticalPatientCount}}}
  - Key Patients Today: {{{patientNames}}}

  Construct a short, natural language summary. Start with a greeting. Mention the number of appointments. If there are critical patients, highlight this as a priority. Mention one or two key patient names if relevant. Keep it brief and encouraging.
  
  Example if there are critical patients: "Good morning, Dr. {{{doctorName}}}. You have {{{appointmentCount}}} appointments scheduled today. Please prioritize your attention on the {{{criticalPatientCount}}} critical patients in your ward, including {{{patientNames.[0]}}}."
  Example if there are no critical patients: "Good morning, Dr. {{{doctorName}}}. You have a busy day with {{{appointmentCount}}} appointments. Your {{{patientCount}}} assigned patients are stable. First up is your consultation with {{{patientNames.[0]}}}"
  `,
});

const generateShiftBriefingFlow = ai.defineFlow(
  {
    name: 'generateShiftBriefingFlow',
    inputSchema: GenerateShiftBriefingInputSchema,
    outputSchema: GenerateShiftBriefingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
