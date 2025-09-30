'use client';

import { createContext, useContext } from 'react';

export type ThemeType = 'joy' | 'fun' | 'adventure' | 'memory';

type ThemeContextType = {
  theme: ThemeType | null;
  setTheme: (theme: ThemeType) => void;
  resetTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};