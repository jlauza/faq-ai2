import type { FAQ } from '@/lib/definitions';
import { approveFaqAction, deleteFaqAction } from '@/app/admin/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Check, Trash2 } from 'lucide-react';

export function PendingFaqCard({ faq }: { faq: FAQ }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-base">{faq.question}</CardTitle>
        <CardDescription>
          Asked on {new Date(faq.createdAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">
          <strong className="font-semibold text-foreground">
            AI-Generated Answer:
          </strong>{' '}
          {faq.answer}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 border-t px-6 py-4">
        <form action={deleteFaqAction}>
          <input type="hidden" name="id" value={faq.id} />
          <Button variant="outline" size="sm" type="submit">
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </form>
        <form action={approveFaqAction}>
          <input type="hidden" name="id" value={faq.id} />
          <Button size="sm" type="submit">
            <Check className="mr-2 h-4 w-4" /> Approve
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
