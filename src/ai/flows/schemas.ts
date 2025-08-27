import {z} from 'zod';

export const GenerateOutputSchema = z.object({
  story: z.array(z.string()).describe('The generated story, split into paragraphs.'),
});
