import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  orderBy,
  DocumentData,
} from 'firebase/firestore';
import type { FAQ, FAQDocument } from '@/lib/definitions';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

const faqCollection = collection(db, 'faqs');

const mapDocToFAQ = (doc: DocumentData): FAQ => {
  const data = doc.data();
  return {
    id: doc.id,
    question: data.question,
    answer: data.answer,
    createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
  };
};

export async function addQuestion(question: string, answer: string): Promise<string | null> {
  const newFaq: Omit<FAQDocument, 'status'> = { // Status removed
    question,
    answer,
    createdAt: serverTimestamp(),
  };

  try {
    // @ts-ignore
    const docRef = await addDoc(faqCollection, newFaq);
    return docRef.id;
  } catch (serverError: any) {
    if (serverError.code === 'permission-denied') {
      const permissionError = new FirestorePermissionError({
        path: faqCollection.path,
        operation: 'create',
        requestResourceData: newFaq,
      });
      errorEmitter.emit('permission-error', permissionError);
    } else {
       // For other errors, you might want to re-throw or handle differently
       throw serverError;
    }
    return null;
  }
}

// This function is no longer used but kept for potential future use.
export async function getPendingFAQs(): Promise<FAQ[]> {
 return [];
}

export async function getApprovedFAQs(): Promise<FAQ[]> {
  const q = query(faqCollection, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(mapDocToFAQ);
}

// These actions are no longer used from the UI but kept for potential direct use.
export async function approveFaq(id: string): Promise<void> {
  // No-op, all questions are approved by default now.
}

export async function deleteFaq(id: string): Promise<void> {
  const faqDoc = doc(db, 'faqs', id);
  await deleteDoc(faqDoc);
}

// Function required for AI flow `summarize-firestore-data-for-admin`
export async function getFirestoreData(): Promise<string> {
    const q = query(faqCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const faqs = querySnapshot.docs.map(mapDocToFAQ);
    return JSON.stringify(faqs.map(faq => ({ question: faq.question, answer: faq.answer })));
}
