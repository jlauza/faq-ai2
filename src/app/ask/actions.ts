'use server';

import { generateAnswerFromQuestion } from '@/ai/flows/generate-answer-from-question';
// The addQuestion import is no longer needed
// import { addQuestion } from '@/services/firebase-service';
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
    
    // The following lines that save the question have been removed.
    // const newQuestionId = await addQuestion(question, answer);
    
    // if (newQuestionId === null) {
    //   return {
    //     message: 'Failed to submit question due to a permission error.',
    //     success: false,
    //   };
    // }

    // Revalidating the path is no longer necessary as data isn't changing.
    // revalidatePath('/');

    return {
      question,
      answer,
      message: 'Your question has been answered!',
      success: true,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      message: `Failed to get an answer: ${errorMessage}`,
      success: false,
    };
  }
}
