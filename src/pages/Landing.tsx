import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Code, Terminal, BookOpen } from 'lucide-react';

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Learn Python Online
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    A simple and interactive Python editor with an integrated terminal.
                    Perfect for beginners learning to code.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link to="/editor">
                    <Button size="lg" className="w-full">
                      Start Coding
                    </Button>
                  </Link>
                  <Link to="/tutorials">
                    <Button size="lg" variant="outline" className="w-full">
                      View Tutorials
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="grid gap-4">
                  <div className="rounded-lg border bg-card p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      <h3 className="font-semibold">Python Editor</h3>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Write and edit Python code with syntax highlighting and error detection.
                    </p>
                  </div>
                  <div className="rounded-lg border bg-card p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Terminal className="h-5 w-5" />
                      <h3 className="font-semibold">Live Terminal</h3>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      See your code output in real-time with a built-in terminal.
                    </p>
                  </div>
                  <div className="rounded-lg border bg-card p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      <h3 className="font-semibold">Python Tutorials</h3>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Learn Python with step-by-step tutorials and examples.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
} 