'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import usePhotoUpload from '@/hooks/usePhotoUpload';
import useCamera from '@/hooks/useCamera';
import ProgressIndicator from '@/components/ProgressIndicator/ProgressIndicator';
import Countdown from '@/components/Countdown/Countdown';
import styles from './CameraPage.module.scss';

type Props = {
  sessionId: string;
  targetPhotos: number;
};

export default function CameraPage({ sessionId, targetPhotos }: Props) {
  const router = useRouter();
  const { uploadPhoto, isUploading, uploadError, uploadedCount } = usePhotoUpload(sessionId);
  const { videoRef, stream, error, isLoading, startCamera, capturePhoto } = useCamera();
  const [showCountdown, setShowCountdown] = useState(false);
  const [isSessionStarted, setIsSessionStarted] = useState(false);


  const startPhotoSession = useCallback(() => {
    setIsSessionStarted(true);
    setShowCountdown(true);
  }, []);

  const handleCountdownComplete = useCallback(async () => {
    setShowCountdown(false);

    const photo = capturePhoto();
    if (!photo) return;

    const result = await uploadPhoto(photo);

    if (result) {
      const newCount = uploadedCount + 1;

      if (newCount >= targetPhotos) {
        router.push(`/result/${sessionId}`);
      } else {
        setTimeout(() => {
          setShowCountdown(true);
        }, 1000);
      }
    }
  }, [capturePhoto, uploadPhoto, uploadedCount, targetPhotos, sessionId, router]);

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
      <ProgressIndicator current={uploadedCount + 1} total={targetPhotos} />

      <div className={styles.cameraContainer}>
        <div className={styles.videoWrapper}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={styles.video}
          />
        </div>

        {!isSessionStarted && (
          <div className={styles.controls}>
            <p className={styles.instruction}>Нажмите кнопку <br/>что бы начать серию снимков</p>
            <button
              onClick={startPhotoSession}
              disabled={!stream}
              className={styles.captureButton}
            >
              ФОТО
            </button>
          </div>
        )}

        {isSessionStarted && !showCountdown && (
          <div className={styles.controls}>
            <p className={styles.instruction}>Обработка...</p>
          </div>
        )}
      </div>

      {uploadError && <p className={styles.error}>{uploadError}</p>}

      {showCountdown && <Countdown onComplete={handleCountdownComplete} />}
    </div>
  );
}