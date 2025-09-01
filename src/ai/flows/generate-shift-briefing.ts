'use server';

/**
 * @fileOverview An AI agent to generate a shift handover briefing for a nurse.
 *
 * - generateShiftBriefing - A function that handles the briefing generation.
 * - GenerateShiftBriefingInput - The input type for the function.
 * - GenerateShiftBriefingOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateShiftBriefingInputSchema = z.object({
  notes: z.string().describe("The raw, unstructured notes from the nurse's shift."),
  nurseName: z.string().describe("The name of the nurse submitting the notes."),
});
export type GenerateShiftBriefingInput = z.infer<typeof GenerateShiftBriefingInputSchema>;

const GenerateShiftBriefingOutputSchema = z.object({
  briefing: z
    .string()
    .describe('A structured, concise, and professional handover report formatted in Markdown. It should include sections for "Key Events", "Pending Tasks", and "Patients to Watch".'),
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
  prompt: `You are Zizo, an AI Medical Assistant. Your task is to take a nurse's raw shift notes and convert them into a structured, clear, and concise handover briefing for the next nurse.

  The handover report must be in Markdown format and contain the following sections:
  - **Key Events**: A bulleted list of the most important events that occurred during the shift.
  - **Pending Tasks**: A bulleted list of tasks that need to be completed by the next shift.
  - **Patients to Watch**: A bulleted list of patients who require special attention, with a brief reason why.

  Analyze the following notes from {{{nurseName}}} and generate the report:
  ---
  {{{notes}}}
  ---
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
