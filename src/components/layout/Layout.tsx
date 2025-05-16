import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="14" cy="14" r="14" fill="#6366F1"/>
                <text x="50%" y="55%" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="bold" dy=".3em" fontFamily="monospace">CV</text>
              </svg>
              <span className="font-bold text-lg tracking-tight">
                <span className="text-2xl font-bold text-blue-600 font-mono">e</span>
                <span className="tracking-wider">ditie</span>
              </span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link to="/editor" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <svg width="18" height="18" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="14" cy="14" r="14" fill="#6366F1"/><text x="50%" y="55%" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold" dy=".3em" fontFamily="monospace">CV</text></svg>
                Editor
              </Link>
              <Link to="/tutorials" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <BookOpen className="h-4 w-4" />
                Tutorials
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 container px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
} 