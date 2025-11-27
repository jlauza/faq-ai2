'use server';
/**
 * @fileOverview This file defines a Genkit flow that generates an answer to a question using a generative AI model.
 *
 * - generateAnswerFromQuestion - A function that generates an answer to a question.
 * - GenerateAnswerFromQuestionInput - The input type for the generateAnswerFromQuestion function.
 * - GenerateAnswerFromQuestionOutput - The return type for the generateAnswerFromQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAnswerFromQuestionInputSchema = z.object({
  question: z.string().describe('The question to be answered.'),
});
export type GenerateAnswerFromQuestionInput = z.infer<typeof GenerateAnswerFromQuestionInputSchema>;

const GenerateAnswerFromQuestionOutputSchema = z.object({
  answer: z.string().describe('The generated answer to the question.'),
});
export type GenerateAnswerFromQuestionOutput = z.infer<typeof GenerateAnswerFromQuestionOutputSchema>;

export async function generateAnswerFromQuestion(input: GenerateAnswerFromQuestionInput): Promise<GenerateAnswerFromQuestionOutput> {
  return generateAnswerFromQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAnswerFromQuestionPrompt',
  input: {schema: GenerateAnswerFromQuestionInputSchema},
  output: {schema: GenerateAnswerFromQuestionOutputSchema},
  prompt: `You are a helpful AI assistant. Please answer the following question: {{{question}}}`,
});

const generateAnswerFromQuestionFlow = ai.defineFlow(
  {
    name: 'generateAnswerFromQuestionFlow',
    inputSchema: GenerateAnswerFromQuestionInputSchema,
    outputSchema: GenerateAnswerFromQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
