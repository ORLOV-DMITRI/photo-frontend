'use client';

import {useRef, useState, useCallback, useEffect} from 'react';

export default function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startCamera = useCallback(async () => {
    console.log('1. Запуск startCamera...');
    setIsLoading(true);
    setError(null);

    try {
      console.log('2. Попытка вызвать navigator.mediaDevices.getUserMedia...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1280, height: 720 },
        audio: false,
      });

      console.log('3. Доступ к камере получен (MediaStream):', mediaStream);

      if (videoRef.current) {
        console.log('4. Присвоение потока элементу <video>.');

        videoRef.current.srcObject = mediaStream;

        videoRef.current.onloadedmetadata = () => {
          console.log('5. Метаданные видео загружены. Вызов play().');
          videoRef.current?.play().catch(e => {
            console.error('6. Ошибка при вызове video.play():', e);
            setError('Не удалось запустить воспроизведение видео. Проверьте разрешения автозапуска.');
          });
        };
      } else {
        console.warn('4. Элемент <video> (videoRef.current) отсутствует.');
      }


      setStream(mediaStream);
      console.log('7. Камера должна отображаться.');

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
      console.log("0. Обнаружен видеоэлемент. Инициирую старт камеры.");
      startCamera();
    }
    // Запускаем этот хук при первом монтировании и когда videoRef.current меняется (с null на элемент)
  }, [videoRef.current, stream, isLoading, startCamera]);

  useEffect(() => {
    if (videoRef.current && stream && !videoRef.current.srcObject) {
      console.log('→ Присваиваем stream элементу video (отложенно)');
      videoRef.current.srcObject = stream;

      videoRef.current.onloadedmetadata = () => {
        console.log('→ Метаданные загружены, запуск play()');
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