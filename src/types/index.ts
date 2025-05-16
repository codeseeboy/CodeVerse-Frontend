export type Language = 'python' | 'javascript' | 'typescript';

export interface CodeExecutionResult {
  output: string;
  error?: string;
}

export interface CodeSnippet {
  id: string;
  title: string;
  code: string;
  language: Language;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  userId?: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export interface Theme {
  name: 'light' | 'dark';
  editor: 'vs' | 'vs-dark';
  terminal: 'light' | 'dark';
}

export interface AIExplanation {
  explanation: string;
  suggestions: string[];
  complexity: 'beginner' | 'intermediate' | 'advanced';
}

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  code: string;
  language: Language;
  expectedOutput: string;
  hints: string[];
}

export interface CodeTemplate {
  id: string;
  name: string;
  description: string;
  code: string;
  language: Language;
  category: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
} 