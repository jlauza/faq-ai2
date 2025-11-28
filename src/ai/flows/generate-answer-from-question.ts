'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getApprovedFAQs } from '@/services/firebase-service';

/* ---------------- Schemas ---------------- */

const GenerateAnswerFromQuestionInputSchema = z.object({
  question: z.string(),
});
export type GenerateAnswerFromQuestionInput = z.infer<
  typeof GenerateAnswerFromQuestionInputSchema
>;

const GenerateAnswerFromQuestionOutputSchema = z.object({
  answer: z.string(),
});
export type GenerateAnswerFromQuestionOutput = z.infer<
  typeof GenerateAnswerFromQuestionOutputSchema
>;

/* ---------------- Retrieval Tool ---------------- */

const GetRelevantInformationInputSchema = z.object({
  question: z.string(),
});

const GetRelevantInformationOutputSchema = z.string(); // JSON string

const getRelevantInformation = ai.defineTool(
  {
    name: 'getRelevantInformation',
    description: 'Retrieves relevant company FAQs from Firestore.',
    inputSchema: GetRelevantInformationInputSchema,
    outputSchema: GetRelevantInformationOutputSchema,
  },
  async ({ question }) => {
    const faqs = await getApprovedFAQs();
    const cleanQ = question.toLowerCase();

    const relevantFaqs = faqs.filter((faq: any) => {
      const q = faq.question.toLowerCase();
      return cleanQ.includes(q) || q.includes(cleanQ);
    });

    return JSON.stringify(relevantFaqs); // return empty array if none match
  }
);

/* ---------------- Prompt ---------------- */

const prompt = ai.definePrompt({
  name: 'generateAnswerFromQuestionPrompt',
  input: { schema: GenerateAnswerFromQuestionInputSchema },
  output: { schema: GenerateAnswerFromQuestionOutputSchema },
  tools: [getRelevantInformation],

  prompt: `
Use the following company answer (if any) strictly. 
If no answer is provided, generate a helpful answer using your AI knowledge.

Company Answer (DO NOT ADD INFO beyond this):
{{{question}}}
`,

  system: `
You are a company assistant AI.
- Always use the company FAQ if available.
- NEVER hallucinate if the company answer exists.
- If no company answer, you MAY generate an answer based on your AI knowledge.
`,
});

/* ---------------- Flow ---------------- */

const generateAnswerFromQuestionFlow = ai.defineFlow(
  {
    name: 'generateAnswerFromQuestionFlow',
    inputSchema: GenerateAnswerFromQuestionInputSchema,
    outputSchema: GenerateAnswerFromQuestionOutputSchema,
  },
  async (input) => {
    const faqs = await getApprovedFAQs();
    const cleanQ = input.question.toLowerCase();

    console.log(faqs, cleanQ);

    // Try to find a matching FAQ
    const match = faqs.find((faq: any) => {
      const q = faq.question.toLowerCase();
      return cleanQ.includes(q) || q.includes(cleanQ);
    });

    if (match) {
      // Found company answer: strictly return or lightly rephrase
      const { output } = await prompt({
        question: match.answer,
      });

      return {
        answer: output?.answer?.trim() || match.answer,
      };
    } else {
      // No company answer → let AI freestyle
      const { output } = await prompt({
        question: '', // empty so AI knows no company data
      });

      return {
        answer: output?.answer?.trim() || '❌ No answer available.',
      };
    }
  }
);

/* ---------------- Export ---------------- */

export async function generateAnswerFromQuestion(
  input: GenerateAnswerFromQuestionInput
): Promise<GenerateAnswerFromQuestionOutput> {
  return generateAnswerFromQuestionFlow(input);
}
