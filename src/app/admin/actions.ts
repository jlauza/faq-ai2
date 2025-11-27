'use server';

import { approveFaq, deleteFaq } from '@/services/firebase-service';
import { revalidatePath } from 'next/cache';

export async function approveFaqAction(formData: FormData) {
  try {
    const id = formData.get('id') as string;
    if (!id) throw new Error('FAQ ID is missing.');
    await approveFaq(id);
  } catch (error) {
    console.error('Failed to approve FAQ:', error);
    // Optionally, return an error message to display in the UI
  } finally {
    revalidatePath('/admin');
    revalidatePath('/');
  }
}

export async function deleteFaqAction(formData: FormData) {
  try {
    const id = formData.get('id') as string;
    if (!id) throw new Error('FAQ ID is missing.');
    await deleteFaq(id);
  } catch (error) {
    console.error('Failed to delete FAQ:', error);
  } finally {
    revalidatePath('/admin');
  }
}
