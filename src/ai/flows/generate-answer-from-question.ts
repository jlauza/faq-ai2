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

    // If nothing matches, return EMPTY array (important)
    return JSON.stringify(relevantFaqs);
  }
);

/* ---------------- Prompt ---------------- */

const prompt = ai.definePrompt({
  name: 'generateAnswerFromQuestionPrompt',
  input: { schema: GenerateAnswerFromQuestionInputSchema },
  output: { schema: GenerateAnswerFromQuestionOutputSchema },
  tools: [getRelevantInformation],

  prompt: `
Use the getRelevantInformation tool to retrieve company FAQs.

Question: {{{question}}}

Answer using ONLY the retrieved data.
If no relevant FAQ is found, respond exactly with:
"❌ No company SOP found for this question."
`,

  system: `
You are a STRICT company SOP assistant.
You MUST:
- Use ONLY the retrieved FAQ data.
- NEVER use outside knowledge.
- NEVER guess.
- NEVER improve beyond what is written.
- If data is empty, output exactly:
"❌ No company SOP found for this question."
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
    const { output } = await prompt(input);

    // Final safety muzzle
    if (!output?.answer || output.answer.trim().length === 0) {
      return { answer: '❌ No company SOP found for this question.' };
    }

    return output!;
  }
);

/* ---------------- Export ---------------- */

export async function generateAnswerFromQuestion(
  input: GenerateAnswerFromQuestionInput
): Promise<GenerateAnswerFromQuestionOutput> {
  return generateAnswerFromQuestionFlow(input);
}
