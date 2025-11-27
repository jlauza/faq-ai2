import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-firestore-data-for-admin.ts';
import '@/ai/flows/generate-answer-from-question.ts';