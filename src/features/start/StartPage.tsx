'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import sessionService from '@/lib/api/session.service';
import styles from './StartPage.module.scss';

const photoOptions = [4, 6];

export default function StartPage() {
  const router = useRouter();
  const [selectedCount, setSelectedCount] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    if (!selectedCount) return;

    setIsCreating(true);
    setError(null);

    try {
      const session = await sessionService.createSession(selectedCount);
      router.push(`/session/${session.sessionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось создать сессию');
      setIsCreating(false);
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>ФОТО БУДКА</h1>

      <section className={styles.content}>
        <h2 className={styles.question}>Сколько фотографий хотите сделать?</h2>

        <div className={styles.options} role="group" aria-label="Выбор количества фотографий">
          {photoOptions.map((count) => (
            <button
              key={count}
              onClick={() => setSelectedCount(count)}
              className={`${styles.option} ${selectedCount === count ? styles.selected : ''}`}
              disabled={isCreating}
              aria-pressed={selectedCount === count}
              aria-label={`${count} фотографий`}
            >
              {count}
            </button>
          ))}
        </div>

        {error && <p className={styles.error} role="alert">{error}</p>}

        <button
          onClick={handleStart}
          disabled={!selectedCount || isCreating}
          className={styles.startButton}
          aria-label="Начать фотосессию"
        >
          {isCreating ? 'СОЗДАНИЕ...' : 'НАЧАТЬ'}
        </button>
      </section>
    </main>
  );
}