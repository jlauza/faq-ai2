'use server';

import { generateAnswerFromQuestion } from '@/ai/flows/generate-answer-from-question';
import { addQuestion } from '@/services/firebase-service';
import { revalidatePath } from 'next/cache';

type FormState = {
  question?: string;
  answer?: string;
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
    
    const newQuestionId = await addQuestion(question, answer);
    
    if (newQuestionId === null) {
      // A permission error was handled by the error emitter,
      // but we need to stop execution here and inform the client.
      // The specific error is already displayed via a toast.
      return {
        message: 'Failed to submit question due to a permission error.',
        success: false,
      };
    }

    revalidatePath('/');

    return {
      question,
      answer,
      message: 'Your question has been answered!',
      success: true,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    // This will now primarily catch AI generation errors or unexpected Firestore errors
    return {
      message: `Failed to submit question: ${errorMessage}`,
      success: false,
    };
  }
}
