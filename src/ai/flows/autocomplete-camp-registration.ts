// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview This file defines a Genkit flow for autocompleting camp registration forms with known cadet data.
 *
 * - autocompleteCampRegistration - An async function that autocompletes camp registration data.
 * - AutocompleteCampRegistrationInput - The input type for the autocompleteCampRegistration function.
 * - AutocompleteCampRegistrationOutput - The output type for the autocompleteCampRegistration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutocompleteCampRegistrationInputSchema = z.object({
  campDetails: z.string().describe('Details about the camp, including name, location, and dates.'),
  cadetName: z.string().describe('The name of the cadet registering for the camp.'),
});
export type AutocompleteCampRegistrationInput = z.infer<typeof AutocompleteCampRegistrationInputSchema>;

const AutocompleteCampRegistrationOutputSchema = z.object({
  regimentalNumber: z.string().describe('The cadet\'s regimental number.'),
  studentId: z.string().describe('The cadet\'s student ID.'),
  otherKnownInformation: z.string().describe('Any other information known about the cadet relevant to camp registration.'),
});
export type AutocompleteCampRegistrationOutput = z.infer<typeof AutocompleteCampRegistrationOutputSchema>;

export async function autocompleteCampRegistration(input: AutocompleteCampRegistrationInput): Promise<AutocompleteCampRegistrationOutput> {
  return autocompleteCampRegistrationFlow(input);
}

const autocompleteCampRegistrationPrompt = ai.definePrompt({
  name: 'autocompleteCampRegistrationPrompt',
  input: {schema: AutocompleteCampRegistrationInputSchema},
  output: {schema: AutocompleteCampRegistrationOutputSchema},
  prompt: `You are an AI assistant that helps cadets automatically fill in camp registration forms with their known information.

  Given the following camp details and cadet name, extract the cadet's regimental number, student ID, and any other relevant information that can be pre-filled on the camp registration form.

  Camp Details: {{{campDetails}}}
  Cadet Name: {{{cadetName}}}

  If any piece of information is not available, return \"UNKNOWN\".
  `,
});

const autocompleteCampRegistrationFlow = ai.defineFlow(
  {
    name: 'autocompleteCampRegistrationFlow',
    inputSchema: AutocompleteCampRegistrationInputSchema,
    outputSchema: AutocompleteCampRegistrationOutputSchema,
  },
  async input => {
    const {output} = await autocompleteCampRegistrationPrompt(input);
    return output!;
  }
);
