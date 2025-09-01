import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-medical-history.ts';
import '@/ai/flows/generate-prescription-notes.ts';
import '@/ai/flows/suggest-treatment-options.ts';
import '@/ai/flows/diagnose-condition.ts';
import '@/ai/flows/generate-lab-summary.ts';
import '@/ai/flows/generate-shift-briefing.ts';
import '@/ai/flows/analyze-lab-image.ts';
import '@/ai/flows/check-drug-interactions.ts';
