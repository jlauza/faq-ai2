import {genkit} from 'genkit';
import openAI, {gpt4} from 'genkitx-openai';
import {googleAI} from '@genkit-ai/google-genai';

const preferredModels = ['gpt-4', 'gpt-3.5-turbo'];

export const ai = genkit({
  // plugins: [openAI({ apiKey: process.env.OPENAI_API_KEY })],
  // model: preferredModels[1],
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',  
});