'use server';
/**
 * @fileOverview This file contains a Genkit flow to verify the integrity of camp registration links.
 *
 * - verifyCampLinkIntegrity - A function that verifies the integrity of a camp registration link.
 * - CampLinkIntegrityInput - The input type for the verifyCampLinkIntegrity function.
 * - CampLinkIntegrityOutput - The return type for the verifyCampLinkIntegrity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CampLinkIntegrityInputSchema = z.object({
  campRegistrationLink: z
    .string()
    .url()
    .describe('The camp registration link to verify.'),
  campName: z.string().describe('The name of the camp.'),
});
export type CampLinkIntegrityInput = z.infer<typeof CampLinkIntegrityInputSchema>;

const CampLinkIntegrityOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the camp registration link is valid.'),
  reason: z.string().describe('The reason for the link being valid or invalid.'),
});
export type CampLinkIntegrityOutput = z.infer<typeof CampLinkIntegrityOutputSchema>;

export async function verifyCampLinkIntegrity(input: CampLinkIntegrityInput): Promise<CampLinkIntegrityOutput> {
  return verifyCampLinkIntegrityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'campLinkIntegrityPrompt',
  input: {schema: CampLinkIntegrityInputSchema},
  output: {schema: CampLinkIntegrityOutputSchema},
  prompt: `You are a security expert tasked with verifying the integrity of camp registration links.
  A cadet is about to register for a camp and wants to ensure the link is valid and not a phishing attempt.

  Camp Name: {{{campName}}}
  Camp Registration Link: {{{campRegistrationLink}}}

  Determine if the link is valid for the given camp name. Consider factors such as the domain of the link,
  the presence of the camp name in the URL, and any red flags that indicate a potential phishing attempt.

  Return a JSON object with the following schema:
  {
    "isValid": boolean, // true if the link is valid, false otherwise
    "reason": string // The reason for the link being valid or invalid
  }`,
});

const verifyCampLinkIntegrityFlow = ai.defineFlow(
  {
    name: 'verifyCampLinkIntegrityFlow',
    inputSchema: CampLinkIntegrityInputSchema,
    outputSchema: CampLinkIntegrityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
