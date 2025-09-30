'use client';

import { useState, useCallback } from 'react';
import api from '@/lib/settings/axios';
import axios from 'axios';
import type { ApiResponse, Photo } from '@/types/api';

export default function usePhotoUpload(sessionId: string) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedCount, setUploadedCount] = useState(0);

  const uploadPhoto = useCallback(async (base64Image: string): Promise<Photo | null> => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const blob = await fetch(base64Image).then((res) => res.blob());

      const formData = new FormData();
      formData.append('photo', blob, `photo-${Date.now()}.jpg`);

      const response = await api.post<ApiResponse<Photo>>(
        `/api/photos/upload/${sessionId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success && response.data.data) {
        setUploadedCount((prev) => prev + 1);
        return response.data.data;
      }

      throw new Error(response.data.error || 'Ошибка загрузки фото');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setUploadError(error.response?.data?.error || 'Ошибка загрузки фото');
      } else {
        setUploadError('Неизвестная ошибка загрузки');
      }
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [sessionId]);

  const resetUpload = useCallback(() => {
    setUploadedCount(0);
    setUploadError(null);
  }, []);

  return {
    uploadPhoto,
    isUploading,
    uploadError,
    uploadedCount,
    resetUpload,
  };
}