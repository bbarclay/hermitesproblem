'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Laptop } from 'lucide-react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Avoid hydration mismatch by waiting until mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-[132px] h-[40px] bg-secondary/70 dark:bg-secondary/70 rounded-lg"></div>;
  }

  return (
    <div className="flex items-center space-x-2 bg-background/90 dark:bg-background/90 backdrop-blur-sm rounded-lg p-1.5 shadow-lg border border-border">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-md transition-all duration-200 ${
          theme === 'light'
            ? 'bg-primary/10 shadow-sm ring-2 ring-primary/20'
            : 'hover:bg-primary/10'
        }`}
        aria-label="Light mode"
      >
        <Sun size={16} className={`${theme === 'light' ? 'text-amber-500' : 'text-muted-foreground'}`} />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-md transition-all duration-200 ${
          theme === 'dark'
            ? 'bg-primary/10 shadow-sm ring-2 ring-primary/20'
            : 'hover:bg-primary/10'
        }`}
        aria-label="Dark mode"
      >
        <Moon size={16} className={`${theme === 'dark' ? 'text-blue-500' : 'text-muted-foreground'}`} />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`p-2 rounded-md transition-all duration-200 ${
          theme === 'system'
            ? 'bg-primary/10 shadow-sm ring-2 ring-primary/20'
            : 'hover:bg-primary/10'
        }`}
        aria-label="System theme"
      >
        <Laptop size={16} className={`${theme === 'system' ? 'text-purple-500' : 'text-muted-foreground'}`} />
      </button>
    </div>
  );
}