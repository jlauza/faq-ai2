import { AskForm } from '@/components/ask-form';

export default function AskPage() {
  return (
    <div className="container mx-auto max-w-2xl p-4 sm:p-6 md:p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Ask a New Question
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Can't find an answer? Ask our AI assistant. Your question will be
          reviewed by an admin before appearing on the site.
        </p>
      </div>
      <div className="mt-8">
        <AskForm />
      </div>
    </div>
  );
}
