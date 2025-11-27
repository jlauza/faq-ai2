'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { submitQuestion } from '@/app/ask/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';

const initialState = {
  message: '',
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Submitting...
        </>
      ) : (
        'Submit Question'
      )}
    </Button>
  );
}

export function AskForm() {
  const [state, formAction] = useFormState(submitQuestion, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: 'Success!',
          description: state.message,
        });
        formRef.current?.reset();
      } else {
        toast({
          title: 'Error',
          description: state.message,
          variant: 'destructive',
        });
      }
    }
  }, [state, toast]);

  return (
    <Card className="shadow-lg">
      <form ref={formRef} action={formAction}>
        <CardHeader>
          <CardTitle>Your Question</CardTitle>
          <CardDescription>
            Enter your question below. Our AI will generate an answer, which will be reviewed by an administrator.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="question" className="sr-only">
            Your Question
          </Label>
          <Textarea
            id="question"
            name="question"
            placeholder="e.g., How do I reset my password?"
            required
            rows={5}
            className="text-base"
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
