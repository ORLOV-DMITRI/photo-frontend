export type ApiResponse<T = any> = {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
};

export type PhotoSession = {
  sessionId: string;
  targetPhotos: number;
  status: 'active' | 'completed';
  createdAt: string;
  completedAt?: string;
  photos?: Photo[];
};

export type Photo = {
  id: string;
  sessionId: string;
  filename: string;
  originalUrl: string;
  filteredUrl: string | null;
  filter: string | null;
  order: number;
};

export type CreateSessionRequest = {
  photoCount: number;
};

export type CreateSessionResponse = ApiResponse<PhotoSession>;