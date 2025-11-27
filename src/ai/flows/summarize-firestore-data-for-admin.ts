'use server';

/**
 * @fileOverview Summarizes recent questions and AI-generated answers from Firestore for admin review.
 *
 * - summarizeFirestoreData - A function that returns a summary of recent questions and answers.
 * - SummaryOutput - The return type for the summarizeFirestoreData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {getFirestoreData} from '@/services/firebase-service';

const SummaryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of recent questions and AI-generated answers.'),
});

export type SummaryOutput = z.infer<typeof SummaryOutputSchema>;

export async function summarizeFirestoreData(): Promise<SummaryOutput> {
  return summarizeFirestoreDataFlow();
}

const prompt = ai.definePrompt({
  name: 'summarizeFirestoreDataPrompt',
  output: {schema: SummaryOutputSchema},
  prompt: `You are an administrative assistant. Summarize the following recent questions and answers from users. Be concise.

  Questions and Answers: {{{firestoreData}}}
  `,
});

const summarizeFirestoreDataFlow = ai.defineFlow(
  {
    name: 'summarizeFirestoreDataFlow',
    outputSchema: SummaryOutputSchema,
  },
  async () => {
    const firestoreData = await getFirestoreData();
    const {output} = await prompt({firestoreData});
    return output!;
  }
);
