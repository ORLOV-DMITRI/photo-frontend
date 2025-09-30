import api from '@/lib/settings/axios';
import type { ApiResponse, PhotoSession, CreateSessionRequest } from '@/types/api';

async function createSession(targetPhotos: number): Promise<PhotoSession> {
  const response = await api.post<ApiResponse<PhotoSession>>(
    '/api/sessions/create',
    { photoCount: targetPhotos } as CreateSessionRequest
  );

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.error || 'Ошибка создания сессии');
}

async function getSession(sessionId: string): Promise<PhotoSession> {
  const response = await api.get<ApiResponse<PhotoSession>>(
    `/api/sessions/${sessionId}`
  );

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.error || 'Ошибка получения сессии');
}

async function completeSession(sessionId: string): Promise<PhotoSession> {
  const response = await api.post<ApiResponse<PhotoSession>>(
    `/api/sessions/${sessionId}/complete`
  );

  if (response.data.success && response.data.data) {
    return response.data.data;
  }

  throw new Error(response.data.error || 'Ошибка завершения сессии');
}

const sessionService = {
  createSession,
  getSession,
  completeSession,
};

export default sessionService;