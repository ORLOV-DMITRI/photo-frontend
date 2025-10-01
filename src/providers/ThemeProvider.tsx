'use client';

import { useState, useEffect, ReactNode } from 'react';
import { ThemeContext, ThemeType } from '@/contexts/ThemeContext';

type Props = {
  children: ReactNode;
};


export default function ThemeProvider({ children }: Props) {
  const [theme, setThemeState] = useState<ThemeType | null>(null);



  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const resetTheme = () => {
    setThemeState(null);
    document.documentElement.removeAttribute('data-theme');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}