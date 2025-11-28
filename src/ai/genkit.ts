import {genkit} from 'genkit';
import openAI from 'genkitx-openai';
// import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [openAI({ apiKey: process.env.OPENAI_API_KEY })],
  model: 'gpt-4', // or gpt-4-32k, etc.
  // plugins: [googleAI()],
  // model: 'googleai/gemini-2.5-flash',  
});