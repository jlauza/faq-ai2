'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { submitQuestion } from '@/app/ask/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';
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
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        setShowAnswer(true);
        formRef.current?.reset();
      } else {
        setShowAnswer(false);
        toast({
          title: 'Error',
          description: state.message,
          variant: 'destructive',
        });
      }
    }
  }, [state, toast]);

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <form ref={formRef} action={formAction}>
          <CardHeader>
            <CardTitle>Your Question</CardTitle>
            <CardDescription>
              Enter your question below. Our AI will generate an answer instantly.
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
              onChange={() => showAnswer && setShowAnswer(false)}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      {showAnswer && state.success && state.question && state.answer && (
         <Card className="bg-accent/50 animate-in fade-in">
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Answer
            </CardTitle>
            <CardDescription>{state.question}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-accent-foreground">{state.answer}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
