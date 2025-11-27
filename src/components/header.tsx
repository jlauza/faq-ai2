import Link from 'next/link';
import { HelpCircle, MessageSquarePlus } from 'lucide-react';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <HelpCircle className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block">
              FAQ-AI Simplified
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center">
            <Button variant="ghost" asChild>
              <Link href="/" className="text-sm font-medium transition-colors">
                <HelpCircle className="mr-2 h-4 w-4" />
                FAQs
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link
                href="/ask"
                className="text-sm font-medium transition-colors"
              >
                <MessageSquarePlus className="mr-2 h-4 w-4" />
                Ask
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
