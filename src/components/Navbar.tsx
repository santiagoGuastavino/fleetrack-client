import styles from '@/styles/components/navbar.module.scss';

interface Props {
  title?: string;
}

export default function Navbar({ title }: Props): JSX.Element {
  return (
    <nav className={styles.nav}>
      {title ? <h2>{title}</h2> : <h1>fleetrack</h1>}
    </nav>
  );
}
