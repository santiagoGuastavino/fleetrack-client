import styles from '@/styles/components/loading.module.scss';
import Image from 'next/image';
import spinner from '@/public/spinner.svg';

export default function Loading(): JSX.Element {
  return (
    <div className={styles.outerDiv}>
      <div className={styles.innerDiv}>
        <Image src={spinner} alt="loading" />
      </div>
    </div>
  );
}
