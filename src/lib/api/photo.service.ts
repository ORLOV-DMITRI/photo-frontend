import api from '@/lib/settings/axios';
import type { ApiResponse, Photo } from '@/types/api';
import type { FilterType } from '@/lib/utils/moodToFilter';

type GetPhotosData = {
  sessionId: string;
  photos: Photo[];
  progress: {
    isComplete: boolean;
    progress: number;
    uploadedPhotos: number;
    totalPhotos: number;
    remainingPhotos: number;
  };
};

async function getPhotos(sessionId: string): Promise<Photo[]> {
  const response = await api.get<ApiResponse<GetPhotosData>>(
    `/api/photos/${sessionId}`
  );

  if (response.data.data?.photos) {
    return response.data.data.photos;
  }

  throw new Error(response.data.error || 'Ошибка получения фото');
}

type BatchFilterResponse = ApiResponse<{
  processedCount: number;
  failedCount: number;
}>;

async function batchApplyFilter(sessionId: string, filter: FilterType): Promise<Photo[]> {
  const response = await api.post<BatchFilterResponse>(
    `/api/photos/batch/${sessionId}/filter`,
    { filterType: filter }
  );

  if (response.data.success) {
    const photosResponse = await getPhotos(sessionId);
    return photosResponse;
  }

  throw new Error(response.data.error || 'Ошибка применения фильтра');
}

async function downloadStrip(sessionId: string): Promise<void> {
  const response = await api.get(`/api/download/${sessionId}/strip`, {
    responseType: 'blob',
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `photo-strip-${sessionId}.png`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

const photoService = {
  getPhotos,
  batchApplyFilter,
  downloadStrip,
};

export default photoService;