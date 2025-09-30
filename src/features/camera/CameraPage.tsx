'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import usePhotoUpload from '@/hooks/usePhotoUpload';
import CameraCapture from '@/components/CameraCapture/CameraCapture';
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
  const [showCountdown, setShowCountdown] = useState(false);
  const [pendingPhoto, setPendingPhoto] = useState<string | null>(null);

  const handleCapture = useCallback((photo: string) => {
    setPendingPhoto(photo);
    setShowCountdown(true);
  }, []);

  const handleCountdownComplete = useCallback(async () => {
    setShowCountdown(false);

    if (!pendingPhoto) return;

    const result = await uploadPhoto(pendingPhoto);
    setPendingPhoto(null);

    if (result && uploadedCount + 1 >= targetPhotos) {
      router.push(`/result/${sessionId}`);
    }
  }, [pendingPhoto, uploadPhoto, uploadedCount, targetPhotos, sessionId, router]);

  return (
    <div className={styles.container}>
      <ProgressIndicator current={uploadedCount + 1} total={targetPhotos} />

      <CameraCapture
        onCapture={handleCapture}
        isCapturing={isUploading || showCountdown}
      />

      {uploadError && <p className={styles.error}>{uploadError}</p>}

      {showCountdown && <Countdown onComplete={handleCountdownComplete} />}
    </div>
  );
}