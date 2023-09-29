import styles from '@/styles/components/title.module.scss';

interface Props {
  label: string;
}

export default function Title({ label }: Props): JSX.Element {
  return <h2 className={styles.h2}>{label}</h2>;
}
