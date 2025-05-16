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
    (set) => ({
      code: defaultCode.python,
      language: 'python',
      input: '',
      output: '',
      error: undefined,
      isRunning: false,
      theme: defaultTheme,
      isTutorialMode: false,
      currentTutorialStep: undefined,
      setCode: (code) => set({ code }),
      setLanguage: (language) => set({ language, code: defaultCode[language] }),
      setInput: (input) => set({ input }),
      setOutput: (output) => set({ output, error: undefined }),
      setError: (error) => set({ error, output: '' }),
      setIsRunning: (isRunning) => set({ isRunning }),
      setTheme: (theme) => set({ theme }),
      setActiveSnippet: (activeSnippet) => set({ activeSnippet }),
      setUser: (user) => set({ user }),
      setIsTutorialMode: (isTutorialMode) => set({ isTutorialMode }),
      setCurrentTutorialStep: (currentTutorialStep) => set({ currentTutorialStep }),
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
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        activeSnippet: state.activeSnippet,
        user: state.user,
      }),
    }
  )
); 