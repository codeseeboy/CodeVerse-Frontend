import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Terminal, BookOpen, Zap, Lightbulb, FileCode } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { tutorials } from '@/data/tutorialData';

const languageOptions = [
  { label: 'Python', value: 'python' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'Java', value: 'java' },
];

interface Tutorial {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  code: {
    python: string;
    javascript: string;
    java: string;
  };
}

export default function Tutorials() {
  const [language, setLanguage] = useState('python');
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 overflow-x-hidden">
      <PageHeader title="Programming Tutorials" />
      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-12 gap-4">
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2 text-center sm:text-left">
              Learn programming through interactive tutorials. Each tutorial includes code examples for Python, JavaScript, and Java.
            </p>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">Language:</span>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tutorials.map((tutorial) => (
              <div
                key={tutorial.id}
                className="relative group w-full h-full"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-1000" />
                <div className="relative p-4 sm:p-6 bg-card rounded-lg border shadow-sm h-full flex flex-col">
                  <div className="mb-3 sm:mb-4 text-primary">{tutorial.icon}</div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 line-clamp-2">{tutorial.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4 line-clamp-3 flex-grow">
                    {tutorial.description}
                  </p>
                  <pre className="bg-muted rounded p-2 text-xs font-mono mb-3 overflow-x-auto whitespace-pre-wrap break-words">
                    {tutorial.code[language as keyof typeof tutorial.code] ?? 'No tutorial code for this language.'}
                  </pre>
                  <Link to={`/editor?tutorial=${tutorial.id}&lang=${language}`} className="w-full sm:w-auto mt-auto">
                    <Button className="w-full gap-2 group">
                      <FileCode className="h-4 w-4" />
                      Try Example
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 