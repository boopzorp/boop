'use server';
/**
 * @fileOverview A book search AI agent.
 *
 * - searchBooksByTitle - A function that handles searching for books.
 * - BookSearchInput - The input type for the searchBooksByTitle function.
 * - BookSearchOutput - The return type for the searchBooksByTitle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const BookSearchInputSchema = z.object({
  title: z.string().describe('The title of the book to search for.'),
});
export type BookSearchInput = z.infer<typeof BookSearchInputSchema>;

const BookSearchOutputSchema = z.object({
  results: z.array(
    z.object({
      id: z.string().describe('A unique identifier for the book.'),
      title: z.string().describe('The title of the book.'),
      authors: z.array(z.string()).describe('A list of authors for the book.'),
      imageUrl: z.string().url().describe('A publicly accessible URL for the book cover image.'),
    })
  ),
});
export type BookSearchOutput = z.infer<typeof BookSearchOutputSchema>;

export async function searchBooksByTitle(
  input: BookSearchInput
): Promise<BookSearchOutput> {
  return bookSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'bookSearchPrompt',
  input: {schema: BookSearchInputSchema},
  output: {schema: BookSearchOutputSchema},
  prompt: `You are a book search engine.
Given a book title, find up to 5 matching books and for each one, provide the title, a list of authors, a unique ID, and a publicly accessible URL for the book cover image.
Ensure the image URLs are valid and point directly to an image file.

Title: {{{title}}}
`,
});

const bookSearchFlow = ai.defineFlow(
  {
    name: 'bookSearchFlow',
    inputSchema: BookSearchInputSchema,
    outputSchema: BookSearchOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
