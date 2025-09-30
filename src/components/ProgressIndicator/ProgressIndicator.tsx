import styles from './ProgressIndicator.module.scss';

type Props = {
  current: number;
  total: number;
};

export default function ProgressIndicator({ current, total }: Props) {
  return (
    <div className={styles.container}>
      <p className={styles.text}>
        Фото <span className={styles.current}>{current}</span>/{total}
      </p>
    </div>
  );
}