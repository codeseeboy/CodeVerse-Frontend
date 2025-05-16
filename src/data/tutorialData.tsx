import { Terminal, FileCode, Lightbulb, Zap, BookOpen } from 'lucide-react';
import { ReactNode } from 'react';

export interface Tutorial {
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

const icons = {
  terminal: <Terminal className="h-6 w-6" />,
  fileCode: <FileCode className="h-6 w-6" />,
  lightbulb: <Lightbulb className="h-6 w-6" />,
  zap: <Zap className="h-6 w-6" />,
  bookOpen: <BookOpen className="h-6 w-6" />,
};

export const tutorials: Tutorial[] = [
  {
    id: 'hello-world',
    icon: icons.terminal,
    title: 'Hello World',
    description: 'Your first program in each language.',
    code: {
      python: 'print("Hello, World!")',
      javascript: 'console.log("Hello, World!");',
      java: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}',
    },
  },
  {
    id: 'variables',
    icon: icons.fileCode,
    title: 'Variables',
    description: 'Learn how to declare and use variables in different languages.',
    code: {
      python: 'x = 5\ny = "Hello"\nprint(x, y)',
      javascript: 'let x = 5;\nlet y = "Hello";\nconsole.log(x, y);',
      java: 'public class Main {\n  public static void main(String[] args) {\n    int x = 5;\n    String y = "Hello";\n    System.out.println(x + " " + y);\n  }\n}',
    },
  },
  {
    id: 'if-else',
    icon: icons.lightbulb,
    title: 'If/Else Statements',
    description: 'Control the flow of your program with if/else statements.',
    code: {
      python: 'x = 10\nif x > 5:\n    print("x is greater than 5")\nelse:\n    print("x is 5 or less")',
      javascript: 'let x = 10;\nif (x > 5) {\n  console.log("x is greater than 5");\n} else {\n  console.log("x is 5 or less");\n}',
      java: 'public class Main {\n  public static void main(String[] args) {\n    int x = 10;\n    if (x > 5) {\n      System.out.println("x is greater than 5");\n    } else {\n      System.out.println("x is 5 or less");\n    }\n  }\n}',
    },
  },
  {
    id: 'loops',
    icon: icons.zap,
    title: 'Loops',
    description: 'Repeat actions using for/while loops.',
    code: {
      python: 'for i in range(5):\n    print(i)',
      javascript: 'for (let i = 0; i < 5; i++) {\n  console.log(i);\n}',
      java: 'public class Main {\n  public static void main(String[] args) {\n    for (int i = 0; i < 5; i++) {\n      System.out.println(i);\n    }\n  }\n}',
    },
  },
  {
    id: 'functions',
    icon: icons.bookOpen,
    title: 'Functions',
    description: 'Organize your code with functions.',
    code: {
      python: 'def greet(name):\n    return f"Hello, {name}!"\nprint(greet("World"))',
      javascript: 'function greet(name) {\n  return `Hello, ${name}!`;\n}\nconsole.log(greet("World"));',
      java: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println(greet("World"));\n  }\n\n  public static String greet(String name) {\n    return "Hello, " + name + "!";\n  }\n}',
    },
  },
]; 