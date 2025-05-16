import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Globe2 } from 'lucide-react';

interface PageHeaderProps {
  title?: string;
  showBackButton?: boolean;
  backTo?: string;
}

export function PageHeader({ title, showBackButton = true, backTo = '/' }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-3 sm:px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showBackButton && (
            <Link to={backTo}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Go back</span>
              </Button>
            </Link>
          )}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Globe2 className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg hidden sm:inline">CodeVerse</span>
          </Link>
        </div>
        {title && (
          <h1 className="text-lg font-semibold">{title}</h1>
        )}
      </div>
    </header>
  );
} 