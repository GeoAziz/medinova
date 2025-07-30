import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-medical-history.ts';
import '@/ai/flows/generate-prescription-notes.ts';
import '@/ai/flows/suggest-treatment-options.ts';