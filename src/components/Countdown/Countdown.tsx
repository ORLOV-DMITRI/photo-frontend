'use client';

import { useEffect, useState } from 'react';
import styles from './Countdown.module.scss';

type Props = {
  onComplete: () => void;
};

export default function Countdown({ onComplete }: Props) {
  const [count, setCount] = useState(3);
  const [showFlash, setShowFlash] = useState(false);

  useEffect(() => {
    if (count === 0) {
      setShowFlash(true);

      const flashTimer = setTimeout(() => {
        setShowFlash(false);
        onComplete();
      }, 300);

      return () => clearTimeout(flashTimer);
    }

    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  if (count === 0 && !showFlash) return null;

  return (
    <div className={`${styles.overlay} ${showFlash ? styles.flash : ''}`}>
      {!showFlash && <div className={styles.number}>{count}</div>}
    </div>
  );
}