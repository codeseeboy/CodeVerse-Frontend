import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Globe2, BookOpen, Zap, Terminal, ArrowRight, PlayCircle } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const features = [
  {
    icon: <Terminal className="h-6 w-6" />,
    title: "Multi-Language Code Editor",
    description: "Write, run, and debug code in Python, JavaScript, C, C++, and more with our powerful Monaco-based editor."
  },
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: "Comprehensive Tutorials",
    description: "Learn programming from basics to advanced concepts with our step-by-step tutorials for multiple languages."
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Instant Execution",
    description: "Run your code instantly and see the results in real-time for any supported language."
  }
];

const codeSnippets = [
  { lang: 'Python', code: 'print("Hello, World!")', output: 'Hello, World!' },
  { lang: 'JavaScript', code: 'console.log("Hello, World!");', output: 'Hello, World!' },
  { lang: 'C', code: '#include <stdio.h>\nint main() { printf("Hello, World!\\n"); return 0; }', output: 'Hello, World!' },
  { lang: 'C++', code: '#include <iostream>\nint main() { std::cout << "Hello, World!\\n"; return 0; }', output: 'Hello, World!' },
  { lang: 'Poetic', code: 'print("Code in joy,\nCode with minds,\nCreate with code,\nBuild your future.")', output: 'Code in joy,\nCode with minds,\nCreate with code,\nBuild your future.' },
];

const typewriterWords = [
  'Python', 'JavaScript', 'C', 'C++',
  'Code in joy', 'Code with minds',
  'Create with code', 'Build your future',
  'Learn to code', 'Master programming',
  'Start coding now'
];

function useTypewriter(words: string[], speed = 150, pause = 1500) {
  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState('');
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let isStuck = false;

    const resetIfStuck = () => {
      if (isStuck) {
        setDisplay('');
        setIndex((prev) => (prev + 1) % words.length);
        setTyping(true);
        isStuck = false;
      }
    };

    if (typing) {
      if (display.length < words[index].length) {
        timeout = setTimeout(() => {
          setDisplay(words[index].slice(0, display.length + 1));
          isStuck = false;
        }, speed);
      } else {
        setTyping(false);
        timeout = setTimeout(() => {
          setTyping(true);
          isStuck = false;
        }, pause);
      }
    } else {
      timeout = setTimeout(() => {
        setDisplay('');
        setIndex((prev) => (prev + 1) % words.length);
        setTyping(true);
        isStuck = false;
      }, 400);
    }

    // Force reset if stuck for more than 3 seconds
    const stuckTimer = setTimeout(() => {
      isStuck = true;
      resetIfStuck();
    }, 3000);

    return () => {
      clearTimeout(timeout);
      clearTimeout(stuckTimer);
    };
  }, [display, typing, index, words, speed, pause]);

  return display;
}

function useAnimatedCard(snippets: typeof codeSnippets, typingSpeed = 18, runDelay = 600, outputDelay = 1200) {
  const [cardIndex, setCardIndex] = useState(0);
  const [typedCode, setTypedCode] = useState('');
  const [showRun, setShowRun] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    setTypedCode('');
    setShowRun(false);
    setShowResult(false);
    setAnimating(true);
    let i = 0;
    const code = snippets[cardIndex].code;
    const type = () => {
      if (i <= code.length) {
        setTypedCode(code.slice(0, i) + (i % 2 === 0 ? '|' : '')); // blinking cursor
        i++;
        setTimeout(type, typingSpeed);
      } else {
        setTypedCode(code);
        setTimeout(() => setShowRun(true), runDelay);
      }
    };
    type();
  }, [cardIndex, snippets, typingSpeed, runDelay]);

  useEffect(() => {
    if (showRun) {
      setTimeout(() => {
        setShowResult(true);
        setTimeout(() => {
          setAnimating(false);
          setTimeout(() => {
            setCardIndex((prev) => (prev + 1) % snippets.length);
            setAnimating(true);
          }, 600);
        }, outputDelay);
      }, 700);
    }
  }, [showRun, outputDelay, snippets.length]);

  return {
    cardIndex,
    typedCode,
    showRun,
    showResult,
    animating,
    snippet: snippets[cardIndex],
  };
}

export default function Home() {
  const typewriter = useTypewriter(typewriterWords, 150, 1500);
  const {
    cardIndex,
    typedCode,
    showRun,
    showResult,
    animating,
    snippet
  } = useAnimatedCard(codeSnippets, 18, 600, 1200);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 overflow-x-hidden">
      <PageHeader showBackButton={false} />
      {/* Hero Section - Adjusted mobile padding */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="container mx-auto px-4 sm:px-6 pt-16 pb-12 sm:pt-32 sm:pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="space-y-8 sm:space-y-10">
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                Code in <span className="text-primary inline-block min-h-[1.2em]">{typewriter}</span>
              </h1>
              <p className="text-lg sm:text-2xl text-muted-foreground max-w-2xl mx-auto px-2">
                A modern, interactive platform for learning and practicing programming in multiple languages.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-2">
                <Link to="/editor" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full h-14 text-lg gap-3 group px-8">
                    <Globe2 className="h-6 w-6" />
                    Start Coding
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/tutorials" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full h-14 text-lg gap-3 px-8">
                    <BookOpen className="h-6 w-6" />
                    Explore Tutorials
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - Adjusted mobile spacing */}
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="relative group w-full h-full"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-1000" />
              <div className="relative p-6 sm:p-8 bg-card rounded-xl border shadow-sm h-full flex flex-col space-y-4">
                <div className="text-primary p-3 bg-primary/10 rounded-lg w-fit">{feature.icon}</div>
                <h3 className="text-xl sm:text-2xl font-semibold">{feature.title}</h3>
                <p className="text-base sm:text-lg text-muted-foreground flex-grow">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Animated Code Card Section - Adjusted mobile layout */}
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-32">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center">
            <AnimatePresence mode="wait">
              {animating && (
                <motion.div
                  key={cardIndex}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -40, scale: 0.95, filter: 'blur(4px)' }}
                  transition={{ duration: 0.6, type: 'spring', bounce: 0.2 }}
                  className="relative w-full max-w-xl group shadow-xl rounded-2xl"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000" />
                  <div className="relative p-6 sm:p-8 bg-card rounded-2xl border shadow-sm flex flex-col items-start space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm px-3 py-1.5 rounded-full bg-primary/10 text-primary font-semibold uppercase tracking-wide">{snippet.lang}</span>
                    </div>
                    <motion.pre
                      className="p-4 sm:p-5 bg-muted/50 rounded-xl overflow-x-auto text-sm sm:text-base font-mono whitespace-pre-wrap break-words min-h-[100px] w-full"
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {typedCode}
                    </motion.pre>
                    {showRun && !showResult && (
                      <motion.div
                        className="mt-4 flex items-center gap-3"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <PlayCircle className="h-6 w-6 text-primary animate-pulse" />
                        <span className="font-semibold text-lg text-primary">Running...</span>
                      </motion.div>
                    )}
                    {showResult && (
                      <motion.div
                        className="mt-4 w-full px-5 py-3 rounded-xl bg-green-600/90 text-white font-semibold flex items-center gap-3 shadow-lg"
                        initial={{ rotateY: 90, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <span className="text-lg">Output:</span>
                        <span className="ml-2 text-base whitespace-pre-line">{snippet.output}</span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Footer CTA - Adjusted mobile spacing */}
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative group w-full">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-1000" />
            <div className="relative p-6 sm:p-10 bg-card rounded-xl border shadow-sm space-y-6">
              <h2 className="text-2xl sm:text-4xl font-bold">Ready to Start Coding?</h2>
              <p className="text-base sm:text-lg text-muted-foreground px-2">
                Join thousands of learners who are mastering programming with our interactive, multi-language platform.
              </p>
              <Link to="/editor" className="inline-block w-full sm:w-auto">
                <Button size="lg" className="w-full h-14 text-lg gap-3 group px-10">
                  <Globe2 className="h-6 w-6" />
                  Start Coding Now
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 