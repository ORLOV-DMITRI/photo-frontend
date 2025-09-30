'use client';

import { useTheme } from '@/contexts/ThemeContext';
import styles from './ThemeToggle.module.scss';
import cn from 'classnames';

export default function ThemeToggle() {
  const { theme, resetTheme } = useTheme();

  if (!theme) {
    return null;
  }

  const themeEmojis = {
    joy: '🌞',
    fun: '🎉',
    adventure: '🚀',
    memory: '📸',
  };

  return (
    <button onClick={resetTheme} className={styles.toggle} title="Сменить настроение">
      <span className={styles.emoji}>{themeEmojis[theme]}</span>
      <span className={styles.text}>Сменить настроение</span>
    </button>
  );
}