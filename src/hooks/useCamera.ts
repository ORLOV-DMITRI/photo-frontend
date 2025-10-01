'use client';

import {useRef, useState, useCallback, useEffect} from 'react';

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
        video: { facingMode: 'user', width: 1280, height: 720 },
        audio: false,
      });


      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;

        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(e => {
            console.error('6. Ошибка при вызове video.play():', e);
            setError('Не удалось запустить воспроизведение видео. Проверьте разрешения автозапуска.');
          });
        };
      } else {
        console.warn('4. Элемент <video> (videoRef.current) отсутствует.');
      }


      setStream(mediaStream);

    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          console.error('Ошибка getUserMedia:', err.name, 'Сообщение:', err.message);

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
  }, [videoRef]);

  useEffect(() => {
    if (videoRef.current && !stream && !isLoading) {
      startCamera();
    }
  }, [videoRef.current, stream, isLoading, startCamera]);

  useEffect(() => {
    if (videoRef.current && stream && !videoRef.current.srcObject) {
      videoRef.current.srcObject = stream;

      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play().catch(e => {
          console.error('→ Ошибка play():', e);
          setError('Не удалось запустить воспроизведение видео. Проверьте разрешения автозапуска.');
        });
      };
    }
  }, [stream]);

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

    const aspectRatio = 1 / 1;

    let width = video.videoWidth;
    let height = video.videoHeight;

    if (width / height > aspectRatio) {
      width = height * aspectRatio;
    } else {
      height = width / aspectRatio;
    }

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) return null;

    const offsetX = (video.videoWidth - width) / 2;
    const offsetY = (video.videoHeight - height) / 2;

    context.drawImage(
      video,
      offsetX, offsetY, width, height,
      0, 0, width, height
    );

    console.log(`📸 Фото захвачено: ${width}x${height} (aspect ratio: ${aspectRatio})`);

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