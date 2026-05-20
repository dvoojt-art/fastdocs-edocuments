'use server';
/**
 * @fileOverview An AI assistant that suggests professional wording for HR certificate narratives.
 *
 * - draftCertificateNarrative - A function that handles the AI-powered drafting of certificate narratives.
 * - DraftCertificateNarrativeInput - The input type for the draftCertificateNarrative function.
 * - DraftCertificateNarrativeOutput - The return type for the draftCertificateNarrative function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DraftCertificateNarrativeInputSchema = z.object({
  employeeName: z.string().describe('The full name of the employee.'),
  certificateType: z
    .string()
    .describe('The type of certificate (e.g., "Certificate of Employment").'),
  startDate: z.string().describe('The date the employee started.'),
  endDate: z.string().describe('The date the employment ended, or "Present".'),
  employmentStatus: z.string().describe('Status (e.g., Active, Resigned).'),
  purposeOfCertificate: z
    .string()
    .describe('The specific purpose for which the certificate is being issued.'),
});
export type DraftCertificateNarrativeInput = z.infer<
  typeof DraftCertificateNarrativeInputSchema
>;

const DraftCertificateNarrativeOutputSchema = z.object({
  narrative: z.string().describe('The suggested professional wording for the certificate narrative.'),
});
export type DraftCertificateNarrativeOutput = z.infer<
  typeof DraftCertificateNarrativeOutputSchema
>;

const draftNarrativePrompt = ai.definePrompt({
  name: 'draftNarrativePrompt',
  model: 'googleai/gemini-1.5-flash',
  input: {schema: DraftCertificateNarrativeInputSchema},
  output: {schema: DraftCertificateNarrativeOutputSchema},
  prompt: `You are an expert HR professional assistant. Your task is to draft professional and contextually relevant wording for HR certificate narratives based on the provided employee history and certificate purpose. 

The narrative should be formal, polite, and accurate. Do not include greetings, signatures, or contact information. Just provide the body of the certificate text.

Certificate Type: {{{certificateType}}}
Employee Name: {{{employeeName}}}
Employment Period: From {{{startDate}}} to {{{endDate}}}
Employment Status: {{{employmentStatus}}}
Purpose of Certificate: {{{purposeOfCertificate}}}

Please generate a professional narrative that incorporates these details seamlessly.`,
});

export async function draftCertificateNarrative(
  input: DraftCertificateNarrativeInput
): Promise<DraftCertificateNarrativeOutput> {
  const {output} = await draftNarrativePrompt(input);
  if (!output) {
    throw new Error('AI failed to generate a narrative. Please verify your GOOGLE_GENAI_API_KEY environment variable.');
  }
  return output;
}
