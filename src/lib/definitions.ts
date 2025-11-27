import type { serverTimestamp } from 'firebase/firestore';

export type FAQ = {
  id: string;
  question: string;
  answer: string;
  createdAt: string; // ISO string date
};

export type FAQDocument = {
  question: string;
  answer:string;
  createdAt: ReturnType<typeof serverTimestamp>;
};
