'use server';

/**
 * @fileOverview An AI agent that predicts the likelihood of a student's success in the semester.
 *
 * - predictStudentSuccess - A function that handles the prediction process.
 * - PredictStudentSuccessInput - The input type for the predictStudentSuccess function.
 * - PredictStudentSuccessOutput - The return type for the predictStudentSuccess function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictStudentSuccessInputSchema = z.object({
  major: z.string().describe('The student\'s major.'),
  pastPerformance: z.string().describe('The student\'s past academic performance (e.g., GPA, grades in relevant courses).'),
  currentAttendancePercentage: z.number().describe('The student\'s current attendance percentage.'),
});
export type PredictStudentSuccessInput = z.infer<typeof PredictStudentSuccessInputSchema>;

const PredictStudentSuccessOutputSchema = z.object({
  likelihoodOfSuccess: z.string().describe('A prediction of the student\'s likelihood of success in the semester (e.g., High, Medium, Low).'),
  reasons: z.string().describe('The reasons behind the prediction, including factors related to the student\'s profile and attendance.'),
  recommendations: z.string().describe('Recommendations for the student to improve their chances of success.'),
});
export type PredictStudentSuccessOutput = z.infer<typeof PredictStudentSuccessOutputSchema>;

export async function predictStudentSuccess(input: PredictStudentSuccessInput): Promise<PredictStudentSuccessOutput> {
  return predictStudentSuccessFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictStudentSuccessPrompt',
  input: {schema: PredictStudentSuccessInputSchema},
  output: {schema: PredictStudentSuccessOutputSchema},
  prompt: `You are an academic advisor who provides students with a prediction of their likelihood of success in the semester, along with reasons and recommendations.

  Consider the following information about the student:

  Major: {{{major}}}
  Past Performance: {{{pastPerformance}}}
  Current Attendance Percentage: {{{currentAttendancePercentage}}}%

  Based on this information, provide the following:

  1. Likelihood of Success: A prediction of the student\'s likelihood of success in the semester (High, Medium, or Low).
  2. Reasons: The reasons behind the prediction, including factors related to the student\'s profile and attendance.
  3. Recommendations: Recommendations for the student to improve their chances of success.
`,
});

const predictStudentSuccessFlow = ai.defineFlow(
  {
    name: 'predictStudentSuccessFlow',
    inputSchema: PredictStudentSuccessInputSchema,
    outputSchema: PredictStudentSuccessOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
