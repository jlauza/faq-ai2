import { FaqAccordion } from '@/components/faq-accordion';
import { getApprovedFAQs } from '@/services/firebase-service';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

async function FAQs() {
  const faqs = await getApprovedFAQs();
  return <FaqAccordion faqs={faqs} />;
}

export default function Home() {
  return (
    <div className="container mx-auto max-w-3xl p-4 sm:p-6 md:p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Frequently Asked Questions
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Find answers to the most common questions.
        </p>
      </div>
      <div className="mt-8">
        <Suspense fallback={<Skeleton className="h-48 w-full" />}>
          <FAQs />
        </Suspense>
      </div>
    </div>
  );
}
