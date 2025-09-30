'use client';

import { useEffect, useState } from 'react';
import styles from './Countdown.module.scss';

type Props = {
  onComplete: () => void;
};

export default function Countdown({ onComplete }: Props) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  if (count === 0) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.number}>{count}</div>
    </div>
  );
}