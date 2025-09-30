'use client';

import { useTheme, ThemeType } from '@/contexts/ThemeContext';
import styles from './WelcomeModal.module.scss';
import cn from 'classnames';

type MoodOption = {
  value: ThemeType;
  label: string;
  emoji: string;
  description: string;
};

const moods: MoodOption[] = [
  { value: 'joy', label: 'Радость', emoji: '🌞', description: 'Солнечные теплые цвета' },
  { value: 'fun', label: 'Веселье', emoji: '🎉', description: 'Яркие party-цвета' },
  { value: 'adventure', label: 'Приключение', emoji: '🚀', description: 'Энергичные оттенки' },
  { value: 'memory', label: 'Память', emoji: '📸', description: 'Винтажная ностальгия' },
];

export default function WelcomeModal() {
  const { theme, setTheme } = useTheme();

  if (theme) {
    return null;
  }

  const handleMoodSelect = (selectedTheme: ThemeType) => {
    setTheme(selectedTheme);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h1 className={styles.title}>Добро пожаловать в Фото Будку!</h1>
        <p className={styles.subtitle}>
          Перед тем как мы начнем, один вопрос, пожалуйста:
        </p>
        <p className={styles.question}>Жизнь для вас это...</p>

        <div className={styles.options}>
          {moods.map((mood) => (
            <button
              key={mood.value}
              onClick={() => handleMoodSelect(mood.value)}
              className={styles.option}
            >
              <span className={styles.emoji}>{mood.emoji}</span>
              <span className={styles.label}>{mood.label}</span>
              <span className={styles.description}>{mood.description}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}