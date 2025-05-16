import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, Theme, CodeSnippet, User } from '../types';

interface EditorState {
  code: string;
  language: Language;
  input: string;
  output: string;
  error?: string;
  isRunning: boolean;
  theme: Theme;
  activeSnippet?: CodeSnippet;
  user?: User;
  isTutorialMode: boolean;
  currentTutorialStep?: number;
  setCode: (code: string) => void;
  setLanguage: (language: Language) => void;
  setInput: (input: string) => void;
  setOutput: (output: string) => void;
  setError: (error?: string) => void;
  setIsRunning: (isRunning: boolean) => void;
  setTheme: (theme: Theme) => void;
  setActiveSnippet: (snippet?: CodeSnippet) => void;
  setUser: (user?: User) => void;
  setIsTutorialMode: (isTutorialMode: boolean) => void;
  setCurrentTutorialStep: (step?: number) => void;
  resetEditor: () => void;
}

const defaultTheme: Theme = {
  name: 'dark',
  editor: 'vs-dark',
  terminal: 'dark',
};

const defaultCode = {
  python: 'print("Hello, World!")',
  javascript: 'console.log("Hello, World!");',
  typescript: 'console.log("Hello, World!");',
};

export const useEditorStore = create<EditorState>()(
  persist(
    (set: (state: Partial<EditorState>) => void) => ({
      code: defaultCode.python,
      language: 'python',
      input: '',
      output: '',
      error: undefined,
      isRunning: false,
      theme: defaultTheme,
      isTutorialMode: false,
      currentTutorialStep: undefined,
      setCode: (code: string) => set({ code }),
      setLanguage: (language: Language) => set({ language, code: defaultCode[language] }),
      setInput: (input: string) => set({ input }),
      setOutput: (output: string) => set({ output, error: undefined }),
      setError: (error?: string) => set({ error, output: '' }),
      setIsRunning: (isRunning: boolean) => set({ isRunning }),
      setTheme: (theme: Theme) => set({ theme }),
      setActiveSnippet: (activeSnippet?: CodeSnippet) => set({ activeSnippet }),
      setUser: (user?: User) => set({ user }),
      setIsTutorialMode: (isTutorialMode: boolean) => set({ isTutorialMode }),
      setCurrentTutorialStep: (currentTutorialStep?: number) => set({ currentTutorialStep }),
      resetEditor: () =>
        set({
          code: defaultCode.python,
          language: 'python',
          input: '',
          output: '',
          error: undefined,
          isRunning: false,
          activeSnippet: undefined,
        }),
    }),
    {
      name: 'code-editor-storage',
      partialize: (state: EditorState) => ({
        theme: state.theme,
        language: state.language,
        activeSnippet: state.activeSnippet,
        user: state.user,
      }),
    }
  )
); 