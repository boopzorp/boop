'use server';
/**
 * @fileOverview A story generation AI agent.
 *
 * - generate - A function that handles story generation.
 * - GenerateInput - The input type for the generate function.
 * - GenerateOutput - The return type for the generate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateInputSchema = z.object({
  title: z.string().describe('The title of the story to generate.'),
});
export type GenerateInput = z.infer<typeof GenerateInputSchema>;

export const GenerateOutputSchema = z.object({
  story: z.array(z.string()).describe('The generated story, split into paragraphs.'),
});
export type GenerateOutput = z.infer<typeof GenerateOutputSchema>;

export async function generate(input: GenerateInput): Promise<GenerateOutput> {
  return generateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePrompt',
  input: {schema: GenerateInputSchema},
  output: {schema: GenerateOutputSchema},
  prompt: `You are a creative and talented author.
Write a short story based on the following title.
The story should be engaging and well-structured.
Separate the story into paragraphs.

Title: {{{title}}}
`,
});

const generateFlow = ai.defineFlow(
  {
    name: 'generateFlow',
    inputSchema: GenerateInputSchema,
    outputSchema: GenerateOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
