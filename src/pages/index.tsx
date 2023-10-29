import styles from '@/styles/pages/index.module.scss';
import Navbar from '@/components/Navbar';
import Loading from '@/components/Loading';
import useWake from '@/hooks/use-wake';
import { NextRouter, useRouter } from 'next/router';
import Typed from 'react-typed';

export default function IndexPage(): JSX.Element {
  const { isWakeLoading } = useWake();

  const router: NextRouter = useRouter();

  if (!isWakeLoading) {
    router.push('/auth');
  }

  return (
    <>
      <Navbar />
      <Loading />
      <section>
        <div className={styles.outerDiv}>
          <div className={styles.innerDiv}>
            <p className={styles.first}>
              Please wait
              <Typed
                className={styles.typed}
                strings={['.', '..', '...', '....']}
                typeSpeed={50}
                showCursor={false}
                loop
              />
            </p>
            <p>waking up the server</p>
          </div>
        </div>
      </section>
    </>
  );
}
