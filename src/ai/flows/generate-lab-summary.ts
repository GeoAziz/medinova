'use server';

/**
 * @fileOverview An AI agent to help lab technicians summarize raw lab data.
 *
 * - generateLabSummary - A function that handles the lab data summarization process.
 * - GenerateLabSummaryInput - The input type for the generateLabSummary function.
 * - GenerateLabSummaryOutput - The return type for the generateLabSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLabSummaryInputSchema = z.object({
  rawData: z.string().describe('The raw, unstructured data from a lab analysis machine.'),
});
export type GenerateLabSummaryInput = z.infer<typeof GenerateLabSummaryInputSchema>;

const GenerateLabSummaryOutputSchema = z.object({
  keyFindings: z
    .string()
    .describe('A bulleted list of the most important findings from the data.'),
  abnormalities: z
    .string()
    .describe('A summary of any values that fall outside of normal ranges, highlighting potential concerns.'),
});
export type GenerateLabSummaryOutput = z.infer<typeof GenerateLabSummaryOutputSchema>;

export async function generateLabSummary(
  input: GenerateLabSummaryInput
): Promise<GenerateLabSummaryOutput> {
  return generateLabSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLabSummaryPrompt',
  input: {schema: GenerateLabSummaryInputSchema},
  output: {schema: GenerateLabSummaryOutputSchema},
  prompt: `You are an AI assistant for a skilled lab technician. Your task is to analyze raw data from lab equipment and provide a clear, structured summary for the technician to review before they create their final report.

  Analyze the following raw lab data:
  ---
  {{{rawData}}}
  ---

  Based on this data, provide a structured response including:
  1.  **Key Findings**: A concise summary of the most critical results.
  2.  **Abnormalities Detected**: Clearly identify any values that are outside of standard ranges and explain their potential significance. If all values are normal, state that clearly.
  `,
});

const generateLabSummaryFlow = ai.defineFlow(
  {
    name: 'generateLabSummaryFlow',
    inputSchema: GenerateLabSummaryInputSchema,
    outputSchema: GenerateLabSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
