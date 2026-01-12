import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
      aria-label="Toggle Dark Mode"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 pointer-events-none" />
      ) : (
        <Moon className="h-5 w-5 pointer-events-none" />
      )}
    </button>
  );
};

export default ThemeToggle;
