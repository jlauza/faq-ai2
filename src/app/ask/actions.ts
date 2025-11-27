'use server';

import { generateAnswerFromQuestion } from '@/ai/flows/generate-answer-from-question';
import { addQuestion } from '@/services/firebase-service';
import { revalidatePath } from 'next/cache';

type FormState = {
  message: string;
  success: boolean;
};

export async function submitQuestion(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const question = formData.get('question') as string;

  if (!question || question.trim().length < 10) {
    return {
      message: 'Question must be at least 10 characters long.',
      success: false,
    };
  }

  try {
    const { answer } = await generateAnswerFromQuestion({ question });
    if (!answer) {
      throw new Error('AI failed to generate an answer.');
    }
    
    await addQuestion(question, answer);

    revalidatePath('/admin');

    return {
      message: 'Your question has been submitted and is pending approval.',
      success: true,
    };
  } catch (error) {
    console.error('Error submitting question:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      message: `Failed to submit question: ${errorMessage}`,
      success: false,
    };
  }
}
