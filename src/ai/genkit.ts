import {genkit} from 'genkit';
import openAI, { gpt35Turbo } from 'genkitx-openai';

export const ai = genkit({
  plugins: [openAI({apiKey: process.env.OPENAI_API_KEY})],
  model: 'openai/gpt-4-turbo',
});
