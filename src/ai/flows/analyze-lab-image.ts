'use server';

/**
 * @fileOverview An AI agent to help lab technicians analyze medical images.
 *
 * - analyzeLabImage - A function that handles the image analysis process.
 * - AnalyzeLabImageInput - The input type for the function.
 * - AnalyzeLabImageOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeLabImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a lab sample (e.g., blood smear, tissue sample), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeLabImageInput = z.infer<typeof AnalyzeLabImageInputSchema>;

const AnalyzeLabImageOutputSchema = z.object({
  analysis: z
    .string()
    .describe('A detailed analysis of the image, identifying cell types, anomalies, or any other relevant findings.'),
  keyObservations: z
    .array(z.string())
    .describe('A bulleted list of the most critical observations from the analysis.'),
});
export type AnalyzeLabImageOutput = z.infer<typeof AnalyzeLabImageOutputSchema>;

export async function analyzeLabImage(
  input: AnalyzeLabImageInput
): Promise<AnalyzeLabImageOutput> {
  return analyzeLabImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeLabImagePrompt',
  input: {schema: AnalyzeLabImageInputSchema},
  output: {schema: AnalyzeLabImageOutputSchema},
  prompt: `You are an expert AI medical lab assistant specializing in microscopy and image analysis. Your task is to analyze an uploaded image of a medical sample.

  Analyze the following image:
  {{media url=photoDataUri}}

  Based on the image, provide a structured response including:
  1.  **Analysis**: A detailed description of what you see in the image. Identify cell types, their morphology, and any visible anomalies (e.g., abnormal cell shapes, presence of bacteria, unusual structures).
  2.  **Key Observations**: A concise, bulleted list of the most clinically significant findings. If no anomalies are found, state that the sample appears normal.
  `,
});

const analyzeLabImageFlow = ai.defineFlow(
  {
    name: 'analyzeLabImageFlow',
    inputSchema: AnalyzeLabImageInputSchema,
    outputSchema: AnalyzeLabImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
