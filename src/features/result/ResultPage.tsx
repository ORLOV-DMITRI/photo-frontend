'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import photoService from '@/lib/api/photo.service';
import moodToFilter from '@/lib/utils/moodToFilter';
import type { Photo } from '@/types/api';
import styles from './ResultPage.module.scss';

type Props = {
  sessionId: string;
};
const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
export default function ResultPage({ sessionId }: Props) {
  const router = useRouter();
  const { theme } = useTheme();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplyingFilter, setIsApplyingFilter] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const loadAndProcessPhotos = async () => {
      try {
        setIsLoading(true);
        const loadedPhotos = await photoService.getPhotos(sessionId);

        if (!theme) {
          setPhotos(loadedPhotos);
          setIsLoading(false);
          return;
        }

        setIsApplyingFilter(true);
        const filter = moodToFilter(theme);
        const processedPhotos = await photoService.batchApplyFilter(sessionId, filter);
        setPhotos(processedPhotos);
        setIsApplyingFilter(false);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки фото');
        setIsLoading(false);
        setIsApplyingFilter(false);
      }
    };

    loadAndProcessPhotos();
  }, [sessionId, theme]);

  useEffect(() => {
    if (photos.length === 0 || isLoading || isApplyingFilter) return;

    const timer = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev < photos.length) {
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, 800);

    return () => clearInterval(timer);
  }, [photos.length, isLoading, isApplyingFilter]);

  const handleDownload = async () => {
    try {
      await photoService.downloadStrip(sessionId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка скачивания');
    }
  };

  const handleStartOver = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <p className={styles.message}>Загрузка фото...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>{error}</p>
        <button onClick={handleStartOver} className={styles.button}>
          НАЧАТЬ ЗАНОВО
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ГОТОВО!</h1>

      {isApplyingFilter && (
        <p className={styles.message}>Применяем фильтр...</p>
      )}

      <div className={styles.gallery}>
        {photos.slice(0, visibleCount).map((photo, index) => {
          const currentUrl = `${baseURL}${photo.filteredUrl}`
          return (
              <div key={photo.id} className={styles.photoWrapper} style={{ animationDelay: `${index * 0.1}s` }}>
                <img
                    src={currentUrl}
                    alt={`Фото ${index + 1}`}
                    className={styles.photo}
                />
              </div>
          )
        })}
      </div>

      {visibleCount === photos.length && !isApplyingFilter && (
        <div className={styles.actions}>
          <button onClick={handleDownload} className={styles.button}>
            СКАЧАТЬ ФОТОЛЕНТУ
          </button>
          <button onClick={handleStartOver} className={styles.buttonSecondary}>
            НАЧАТЬ ЗАНОВО
          </button>
        </div>
      )}
    </div>
  );
}