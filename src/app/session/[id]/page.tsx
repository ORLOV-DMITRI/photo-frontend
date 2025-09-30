'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import sessionService from '@/lib/api/session.service';
import CameraPage from '@/features/camera/CameraPage';
import type { PhotoSession } from '@/types/api';

export default function SessionRoute() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [session, setSession] = useState<PhotoSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const data = await sessionService.getSession(sessionId);

        if (data.status === 'completed') {
          router.push(`/result/${sessionId}`);
          return;
        }

        setSession(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Не удалось загрузить сессию');
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, [sessionId, router]);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}>
        Загрузка...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF6B6B' }}>
        {error}
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <CameraPage sessionId={session.sessionId} targetPhotos={session.photoCount} />;
}