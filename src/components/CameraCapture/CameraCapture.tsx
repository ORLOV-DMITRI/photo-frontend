'use client';

import useCamera from '@/hooks/useCamera';
import styles from './CameraCapture.module.scss';
import { useEffect } from 'react';

type Props = {
  onCapture: (photo: string) => void;
  isCapturing: boolean;
};

export default function CameraCapture({ onCapture, isCapturing }: Props) {
  const { videoRef, stream, error, isLoading, startCamera, capturePhoto } = useCamera();

  useEffect(() => {
    startCamera();
  }, [startCamera]);

  const handleCapture = () => {
    if (isCapturing) return;

    const photo = capturePhoto();
    if (photo) {
      onCapture(photo);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <p className={styles.message}>Загрузка камеры...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.videoWrapper}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={styles.video}
        />
      </div>

      <div className={styles.controls}>
        <p className={styles.instruction}>Нажмите кнопку</p>
        <button
          onClick={handleCapture}
          disabled={!stream || isCapturing}
          className={styles.captureButton}
        >
          {isCapturing ? 'ОБРАБОТКА...' : 'ФОТО'}
        </button>
      </div>
    </div>
  );
}