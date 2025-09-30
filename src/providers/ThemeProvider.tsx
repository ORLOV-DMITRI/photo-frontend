'use client';

import { useState, useEffect, ReactNode } from 'react';
import { ThemeContext, ThemeType } from '@/contexts/ThemeContext';

type Props = {
  children: ReactNode;
};

const THEME_STORAGE_KEY = 'photo-booth-theme';

export default function ThemeProvider({ children }: Props) {
  const [theme, setThemeState] = useState<ThemeType | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeType | null;
    if (savedTheme) {
      setThemeState(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const resetTheme = () => {
    setThemeState(null);
    localStorage.removeItem(THEME_STORAGE_KEY);
    document.documentElement.removeAttribute('data-theme');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}