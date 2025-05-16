import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play, ArrowLeft, Lightbulb, Trash2, Save, Loader2, Code, Settings, Download, Upload, Maximize2, Minimize2, Sun, Moon, ArrowUp, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import Editor, { Monaco } from '@monaco-editor/react';
import { useToast } from '@/components/ui/use-toast';
import type { editor } from 'monaco-editor';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useTheme } from '@/components/theme-provider';
import { PageHeader } from '@/components/PageHeader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { tutorials } from '@/data/tutorialData';

const languageOptions = [
  { label: 'Python', value: 'python' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'Java', value: 'java' },
];

const starterCode: Record<string, string> = {
  python: '# Write your Python code here\nprint("Hello, World!")',
  javascript: '// Write your JavaScript code here\nconsole.log("Hello, World!");',
  java: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}',
};

function CodeEditorContent() {
  const { theme, setTheme } = useTheme();
  const [searchParams] = useSearchParams();
  const tutorialId = searchParams.get('tutorial');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [stdin, setStdin] = useState('');
  const { toast } = useToast();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const stdinRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLPreElement>(null);
  const [isFormatting, setIsFormatting] = useState(false);
  const [isEditorExpanded, setIsEditorExpanded] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [editorSettings, setEditorSettings] = useState({
    fontSize: 14,
    minimap: false,
    lineNumbers: 'on',
    formatOnPaste: true,
    formatOnType: true,
    suggestOnTriggerCharacters: true,
    quickSuggestions: true,
    parameterHints: { enabled: true },
    tabSize: 4,
    theme: theme === 'dark' ? 'vs-dark' : 'light',
    wordWrap: 'on' as const,
    automaticLayout: true,
  });
  const [monacoInstance, setMonacoInstance] = useState<Monaco | null>(null);
  const [language, setLanguage] = useState(() => {
    // Try to get language from URL (for tutorial deep links)
    const params = new URLSearchParams(window.location.search);
    return params.get('lang') || 'python';
  });
  const navigate = useNavigate();
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const lang = language;
    if (tutorialId && lang) {
      const tut = tutorials.find(t => t.id === tutorialId);
      if (tut && tut.code[lang]) {
        setCode(tut.code[lang]);
        return;
      }
    }
    setCode(starterCode[language] || '');
  }, [language, tutorialId]);

  useEffect(() => {
    setEditorSettings(prev => ({
      ...prev,
      theme: theme === 'dark' ? 'vs-dark' : 'light',
    }));
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isRunning && outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isRunning]);

  useEffect(() => {
    if (monacoInstance && editorRef.current) {
      try {
        // Register the command with a unique ID
        const commandId = 'run-code-command';
        const disposable = monacoInstance.editor.addCommand({
          id: commandId,
          run: () => {
            runCode();
            return null;
          }
        });

        // Add the keybinding
        editorRef.current.addCommand(
          monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.Enter,
          commandId
        );

        return () => {
          disposable.dispose();
        };
      } catch (error) {
        console.error('Failed to register editor command:', error);
        // Fallback to a simpler approach if command registration fails
        const disposable = editorRef.current.onKeyDown((e) => {
          if ((e.ctrlKey || e.metaKey) && e.code === 'Enter') {
            e.preventDefault();
            runCode();
          }
        });
        return () => disposable.dispose();
      }
    }
  }, [monacoInstance]);

  useEffect(() => {
    fetch(`${API_URL}/languages`)
      .then(res => res.json())
      .then(data => {
        setAvailableLanguages(data.languages || []);
      });
  }, []);

  useEffect(() => {
    if (availableLanguages.length > 0 && !availableLanguages.includes(language)) {
      setLanguage(availableLanguages[0]);
    }
    // eslint-disable-next-line
  }, [availableLanguages]);

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    setMonacoInstance(monaco);
    editor.focus();
  };

  const runCode = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setOutput('Running...\n');

    try {
      const response = await fetch(`${API_URL}/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code,
          stdin: stdin.trim() || undefined,
          language
        }),
      });

      const data = await response.json();
      if (data.error) {
        // Format error message for better readability
        const errorLines = data.error.split('\n');
        const formattedError = errorLines
          .map((line: string) => {
            // Highlight error lines
            if (line.includes('Error:') || line.includes('Traceback')) {
              return `\x1b[31m${line}\x1b[0m`; // Red color
            }
            return line;
          })
          .join('\n');
        
        setOutput(formattedError);
        toast({
          title: "Error",
          description: "Failed to run the code. Check the output for details.",
          variant: "destructive",
        });
      } else {
        setOutput(data.output || 'No output');
      }
    } catch (error) {
      setOutput('Error: Could not connect to the server. Make sure the backend is running.');
      toast({
        title: "Connection Error",
        description: "Could not connect to the code execution server.",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const clearOutput = () => {
    setOutput('');
  };

  const clearInput = () => {
    setStdin('');
    if (stdinRef.current) {
      stdinRef.current.focus();
    }
  };

  const saveCode = () => {
    try {
      const blob = new Blob([code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'python_code.py';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Code saved successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the code.",
        variant: "destructive",
      });
    }
  };

  const formatCode = async () => {
    if (!editorRef.current) return;
    
    setIsFormatting(true);
    try {
      const action = editorRef.current.getAction('editor.action.formatDocument');
      if (action) {
        await action.run();
        toast({
          title: "Success",
          description: "Code formatted successfully!",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to format code.",
        variant: "destructive",
      });
    } finally {
      setIsFormatting(false);
    }
  };

  const loadCodeFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setCode(content);
        toast({
          title: "Success",
          description: "Code loaded successfully!",
        });
      }
    };
    reader.onerror = () => {
      toast({
        title: "Error",
        description: "Failed to read file.",
        variant: "destructive",
      });
    };
    reader.readAsText(file);
  };

  const updateFontSize = (delta: number) => {
    setEditorSettings(prev => ({
      ...prev,
      fontSize: Math.max(8, Math.min(24, prev.fontSize + delta)),
    }));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <PageHeader title={`${language.charAt(0).toUpperCase() + language.slice(1)} Editor`} showBackButton backTo="/tutorials" />
      <div className="w-full px-2 sm:px-4 py-2 sm:py-4">
        <ErrorBoundary>
          <div className="flex flex-col gap-2 sm:gap-4">
            <div className="flex sm:hidden items-center justify-between gap-2 bg-card/50 p-2 rounded-lg">
              <Button variant="ghost" size="sm" className="h-9 gap-2" onClick={() => navigate(tutorialId ? '/tutorials' : '/')}> 
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="flex items-center gap-1">
                <span className="font-medium text-xs">Lang:</span>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-24 text-xs">
                    <SelectValue placeholder="Lang" />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.filter(opt => availableLanguages.includes(opt.value)).map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button onClick={runCode} disabled={isRunning} size="sm" className="h-9 gap-2">
                {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                Run
              </Button>
            </div>
            <div className="hidden sm:flex flex-wrap items-center justify-between gap-2 bg-card/50 p-2 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm whitespace-nowrap">Language:</span>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-32 sm:w-40">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.filter(opt => availableLanguages.includes(opt.value)).map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Link to={tutorialId ? '/tutorials' : '/'}>
                  <Button variant="ghost" size="sm" className="h-9 gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">{tutorialId ? 'Back to Tutorials' : 'Back to Home'}</span>
                    <span className="sm:hidden">Back</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="h-9 w-9 p-0">
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                <Button onClick={runCode} disabled={isRunning} size="sm" className="h-9 gap-2">
                  {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                  <span className="hidden sm:inline">{isRunning ? 'Running...' : 'Run Code (Ctrl+Enter)'}</span>
                  <span className="sm:hidden">{isRunning ? 'Running...' : 'Run'}</span>
                </Button>
              </div>
            </div>

            <div className="flex sm:hidden overflow-x-auto gap-2 bg-card/50 p-1.5 rounded-lg">
              <div className="flex items-center gap-1 bg-background/50 rounded-md p-0.5">
                <Button variant="ghost" onClick={() => updateFontSize(-1)} className="h-7 w-7 p-0 text-xs">A-</Button>
                <Button variant="ghost" onClick={() => updateFontSize(1)} className="h-7 w-7 p-0 text-xs">A+</Button>
              </div>
              <Button variant="ghost" onClick={formatCode} disabled={isFormatting} size="sm" className="h-7 gap-1.5"><Code className="h-3.5 w-3.5" /><span className="text-xs">Format</span></Button>
              <Button variant="ghost" onClick={saveCode} size="sm" className="h-7 gap-1.5"><Save className="h-3.5 w-3.5" /><span className="text-xs">Save</span></Button>
              <input type="file" accept=".py,.js,.c,.cpp" onChange={loadCodeFromFile} className="hidden" id="code-upload" />
              <Button variant="ghost" onClick={() => document.getElementById('code-upload')?.click()} size="sm" className="h-7 gap-1.5"><Upload className="h-3.5 w-3.5" /><span className="text-xs">Load</span></Button>
              <Button variant="ghost" onClick={() => setIsEditorExpanded(!isEditorExpanded)} size="sm" className="h-7 gap-1.5"><Maximize2 className="h-3.5 w-3.5" /><span className="text-xs">Expand</span></Button>
            </div>
            <div className="hidden sm:flex flex-wrap items-center gap-1.5 bg-card/50 p-1.5 rounded-lg">
              <div className="flex items-center gap-1 bg-background/50 rounded-md p-0.5">
                <Button variant="ghost" onClick={() => updateFontSize(-1)} className="h-7 w-7 p-0 text-xs">A-</Button>
                <Button variant="ghost" onClick={() => updateFontSize(1)} className="h-7 w-7 p-0 text-xs">A+</Button>
              </div>
              <Button variant="ghost" onClick={formatCode} disabled={isFormatting} size="sm" className="h-7 gap-1.5"><Code className="h-3.5 w-3.5" /><span className="text-xs">Format</span></Button>
              <Button variant="ghost" onClick={saveCode} size="sm" className="h-7 gap-1.5"><Save className="h-3.5 w-3.5" /><span className="text-xs">Save</span></Button>
              <input type="file" accept=".py,.js,.c,.cpp" onChange={loadCodeFromFile} className="hidden" id="code-upload" />
              <Button variant="ghost" onClick={() => document.getElementById('code-upload')?.click()} size="sm" className="h-7 gap-1.5"><Upload className="h-3.5 w-3.5" /><span className="text-xs">Load</span></Button>
              <Button variant="ghost" onClick={() => setIsEditorExpanded(!isEditorExpanded)} size="sm" className="h-7 gap-1.5 ml-auto">{isEditorExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}<span className="text-xs">{isEditorExpanded ? 'Collapse' : 'Expand'}</span></Button>
            </div>

            <div className={`flex flex-col gap-2 ${isEditorExpanded ? 'fixed inset-0 z-50 bg-background p-2' : ''}`}>
              {isEditorExpanded && (
                <div className="flex justify-end mb-1">
                  <Button variant="ghost" onClick={() => setIsEditorExpanded(false)} size="sm" className="h-7 gap-1.5">
                    <Minimize2 className="h-3.5 w-3.5" />
                    <span className="text-xs">Exit Fullscreen</span>
                  </Button>
                </div>
              )}
              <div className="flex-1 border rounded-lg overflow-hidden">
                <Editor
                  height={isEditorExpanded ? "calc(100vh - 140px)" : "calc(100vh - 280px)"}
                  defaultLanguage={language}
                  language={language}
                  theme={editorSettings.theme}
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  onMount={handleEditorDidMount}
                  options={{
                    ...editorSettings,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    lineNumbers: window.innerWidth < 640 ? 'off' as const : 'on' as const,
                    folding: window.innerWidth >= 640,
                  }}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="border rounded-lg bg-card/50 p-2">
                  <div className="mb-1 flex items-center justify-between">
                    <h3 className="font-medium text-xs">Input (stdin)</h3>
                    <Button variant="ghost" size="sm" onClick={clearInput} className="h-7 gap-1.5">
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="text-xs">Clear</span>
                    </Button>
                  </div>
                  <textarea
                    ref={stdinRef}
                    value={stdin}
                    onChange={(e) => setStdin(e.target.value)}
                    placeholder="Enter input for your program here..."
                    className="h-16 w-full resize-none rounded-md border bg-muted/50 p-2 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="border rounded-lg bg-card/50 p-2">
                  <div className="mb-1 flex items-center justify-between">
                    <h3 className="font-medium text-xs">Output</h3>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(output);
                          toast({ title: "Success", description: "Output copied to clipboard!" });
                        }}
                        className="h-7 gap-1.5"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span className="text-xs">Copy</span>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={clearOutput} className="h-7 gap-1.5">
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="text-xs">Clear</span>
                      </Button>
                    </div>
                  </div>
                  <pre 
                    ref={outputRef}
                    className="h-16 overflow-auto whitespace-pre-wrap rounded-md bg-muted/50 p-2 font-mono text-xs"
                  >
                    {output}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </ErrorBoundary>
      </div>

      {showBackToTop && (
        <Button
          variant="outline"
          size="sm"
          onClick={scrollToTop}
          className="fixed bottom-2 right-2 h-7 w-7 p-0 rounded-full shadow-lg"
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}

export default function EditorPage() {
  return (
    <CodeEditorContent />
  );
} 