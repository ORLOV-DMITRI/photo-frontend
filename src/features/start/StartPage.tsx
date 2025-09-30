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
    <div className={styles.container}>
      <h1 className={styles.title}>ФОТО БУДКА</h1>

      <div className={styles.content}>
        <p className={styles.question}>Сколько фотографий хотите сделать?</p>

        <div className={styles.options}>
          {photoOptions.map((count) => (
            <button
              key={count}
              onClick={() => setSelectedCount(count)}
              className={`${styles.option} ${selectedCount === count ? styles.selected : ''}`}
              disabled={isCreating}
            >
              {count}
            </button>
          ))}
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button
          onClick={handleStart}
          disabled={!selectedCount || isCreating}
          className={styles.startButton}
        >
          {isCreating ? 'СОЗДАНИЕ...' : 'НАЧАТЬ'}
        </button>
      </div>
    </div>
  );
}