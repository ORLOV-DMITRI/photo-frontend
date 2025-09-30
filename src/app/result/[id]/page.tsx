'use client';

import { useParams } from 'next/navigation';
import ResultPage from '@/features/result/ResultPage';

export default function ResultRoute() {
  const params = useParams();
  const sessionId = params.id as string;

  return <ResultPage sessionId={sessionId} />;
}