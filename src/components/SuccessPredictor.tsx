"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { predictStudentSuccess, type PredictStudentSuccessOutput } from '@/ai/flows/predict-student-success';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

const formSchema = z.object({
  major: z.string().min(2, { message: "Major must be at least 2 characters." }),
  pastPerformance: z.string().min(10, { message: "Please provide some detail about past performance." }),
});

type SuccessPredictorProps = {
  currentAttendancePercentage: number | null;
};

export default function SuccessPredictor({ currentAttendancePercentage }: SuccessPredictorProps) {
  const [prediction, setPrediction] = useState<PredictStudentSuccessOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      major: '',
      pastPerformance: '',
    },
  });
  
  async function getPrediction(values: z.infer<typeof formSchema>) {
    if (currentAttendancePercentage === null) {
      setError("Please calculate your attendance first.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setPrediction(null);
    
    try {
      const result = await predictStudentSuccess({
        ...values,
        currentAttendancePercentage: parseFloat(currentAttendancePercentage.toFixed(1)),
      });
      setPrediction(result);
    } catch (e) {
      setError("Failed to get prediction. Please try again later.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setPrediction(null);
    setError(null);
  }, [currentAttendancePercentage]);

  const getLikelihoodIcon = (likelihood: string) => {
    const lowerLikelihood = likelihood.toLowerCase();
    if (lowerLikelihood.includes('high')) {
      return <CheckCircle className="h-8 w-8 text-primary" />;
    }
    if (lowerLikelihood.includes('medium')) {
      return <AlertTriangle className="h-8 w-8 text-accent" />;
    }
    return <AlertTriangle className="h-8 w-8 text-destructive" />;
  };

  return (
    <Card className="shadow-xl w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
            <div className="flex-shrink-0 rounded-md bg-primary p-2">
                <BrainCircuit className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
                <CardTitle className="text-2xl font-headline">AI Success Predictor</CardTitle>
                <CardDescription>Get an AI-powered prediction of your semester success.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        {currentAttendancePercentage === null ? (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-8 text-center">
                <p className="text-muted-foreground">Please calculate your attendance first to enable the predictor.</p>
            </div>
        ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(getPrediction)} className="space-y-4">
            <FormField
              control={form.control}
              name="major"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Major</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Computer Science" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pastPerformance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Past Academic Performance</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., '3.5 GPA, A in Math, B in Physics'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Predicting...' : 'Predict My Success'}
            </Button>
          </form>
        </Form>
        )}
      </CardContent>
      {isLoading && (
          <CardFooter>
            <div className="flex w-full flex-col items-center gap-2 p-4 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Our AI is analyzing your profile...</p>
            </div>
          </CardFooter>
      )}
      {error && (
        <CardFooter>
            <p className="w-full text-center text-sm text-destructive">{error}</p>
        </CardFooter>
      )}
      {prediction && (
        <CardFooter className="flex flex-col items-start gap-4 rounded-b-lg bg-primary/5 p-4">
           <div className="flex w-full items-center gap-4">
              {getLikelihoodIcon(prediction.likelihoodOfSuccess)}
              <div>
                <p className="text-sm text-muted-foreground">Likelihood of Success</p>
                <p className="text-xl font-bold text-primary">{prediction.likelihoodOfSuccess}</p>
              </div>
            </div>

            <div className='space-y-1'>
                <h4 className="font-semibold text-foreground">Reasons:</h4>
                <p className="text-sm text-muted-foreground">{prediction.reasons}</p>
            </div>
            <div className='space-y-1'>
                <h4 className="font-semibold text-foreground">Recommendations:</h4>
                <p className="text-sm text-muted-foreground">{prediction.recommendations}</p>
            </div>
        </CardFooter>
      )}
    </Card>
  );
}
