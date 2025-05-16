import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import CodeEditor from '@/pages/Editor';
import Tutorials from '@/pages/Tutorials';
import Home from '@/pages/Home';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor" element={<CodeEditor />} />
          <Route path="/tutorials" element={<Tutorials />} />
        </Routes>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App; 