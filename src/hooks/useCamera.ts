'use client';

import { useRef, useState, useCallback } from 'react';

export default function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startCamera = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 360 },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      setStream(mediaStream);
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('Доступ к камере запрещен. Разрешите доступ в настройках браузера.');
        } else if (err.name === 'NotFoundError') {
          setError('Камера не найдена на вашем устройстве.');
        } else {
          setError('Не удалось получить доступ к камере.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  const capturePhoto = useCallback((): string | null => {
    if (!videoRef.current) return null;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    if (!context) return null;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.9);
  }, []);

  return {
    videoRef,
    stream,
    error,
    isLoading,
    startCamera,
    stopCamera,
    capturePhoto,
  };
}