import { PendingFaqCard } from '@/components/admin/pending-faq-card';
import { getPendingFAQs } from '@/services/firebase-service';
import { summarizeFirestoreData } from '@/ai/flows/summarize-firestore-data-for-admin';
import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

async function Summary() {
  try {
    const { summary } = await summarizeFirestoreData();
    return (
      <Card className="bg-accent/50">
        <CardHeader>
          <CardTitle>AI Activity Summary</CardTitle>
          <CardDescription>A brief overview of recent questions and answers.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm italic text-accent-foreground">{summary}</p>
        </CardContent>
      </Card>
    );
  } catch (error) {
    console.error("Failed to load AI summary:", error);
    return (
       <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive"><AlertCircle size={20}/> AI Summary Error</CardTitle>
           <CardDescription className="text-destructive/90">Could not generate activity summary. Please check your AI configuration and Firebase connection.</CardDescription>
        </CardHeader>
      </Card>
    )
  }
}

export default async function AdminPage() {
  const pendingFAQs = await getPendingFAQs();

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Admin Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          Review and approve new questions submitted by users.
        </p>
      </div>

      <div className="grid gap-8">
        <Suspense fallback={<Skeleton className="h-40 w-full" />}>
          <Summary />
        </Suspense>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Pending Approval ({pendingFAQs.length})
          </h2>
          {pendingFAQs.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingFAQs.map((faq) => (
                <PendingFaqCard key={faq.id} faq={faq} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <h3 className="text-xl font-semibold">All caught up!</h3>
              <p className="mt-2 text-muted-foreground">
                There are no new questions to review.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
