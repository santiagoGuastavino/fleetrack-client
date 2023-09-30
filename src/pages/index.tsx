import styles from '@/styles/pages/home-page.module.scss';
import { useForm } from 'react-hook-form';
import Navbar from '@/components/Navbar';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthSchema, authSchema } from '@/schemas/auth.schema';
import InputBox from '@/components/InputBox';
import Button from '@/components/Button';
import { RequestStatus } from '@/enums/request-status.enum';
import Loading from '@/components/Loading';
import ErrorBox from '@/components/ErrorBox';
import useWake from '@/hooks/use-wake';
import Title from '@/components/Title';
import useAuth from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { NextRouter, useRouter } from 'next/router';
import Typed from 'react-typed';

export default function HomePage(): JSX.Element {
  const { isWakeLoading } = useWake();

  const [requestData, setRequestData] = useState<AuthSchema>();
  const [listenUserInteraction, setListenUserInteraction] =
    useState<boolean>(false);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(
    RequestStatus.IDLE,
  );
  const [showPasswordHelper, setShowPasswordHelper] = useState<boolean>(false);

  const router: NextRouter = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
    mode: 'onSubmit',
  });

  const emailValue = watch('email');
  const passwordValue = watch('password');

  const { canSubmit, response } = useAuth({
    emailValue,
    passwordValue,
    requestData,
    listenUserInteraction,
    setRequestStatus,
    setShowPasswordHelper,
  });

  const onSubmit = async (data: AuthSchema): Promise<void> => {
    setRequestStatus(RequestStatus.LOADING);
    setShowPasswordHelper(false);
    setRequestData(data);
  };

  useEffect(() => {
    if (requestStatus === RequestStatus.DONE) {
      router.push('/second-page');
    }
  }, [requestStatus]);

  return isWakeLoading ? (
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
            <p className={styles.last}> (it&apos;s a free tier deploy)</p>
          </div>
        </div>
      </section>
    </>
  ) : (
    <>
      <Navbar />
      {requestStatus === RequestStatus.LOADING ? <Loading /> : undefined}
      <section
        className={`${
          requestStatus === RequestStatus.LOADING ? 'isLoading' : undefined
        }`}
      >
        <Title label="login / signup" />
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <InputBox
            bindings={{
              onChange: () => {
                setListenUserInteraction(true);
              },
            }}
            label="email"
            name="email"
            register={register}
            error={errors?.email !== undefined}
            errorMessage={errors?.email?.message}
            type="text"
            disabled={requestStatus === RequestStatus.LOADING}
          />
          <InputBox
            bindings={{
              onChange: () => {
                setListenUserInteraction(true);
              },
            }}
            label="password"
            name="password"
            register={register}
            error={errors?.password !== undefined}
            errorMessage={errors?.password?.message}
            type="password"
            disabled={requestStatus === RequestStatus.LOADING}
          />
          <Button
            disabled={!canSubmit || requestStatus === RequestStatus.LOADING}
            label="submit"
            type="submit"
          />
        </form>
        <>
          {requestStatus === RequestStatus.ERROR && response?.errors.length && (
            <ErrorBox errors={response.errors} />
          )}
          {showPasswordHelper && (
            <div className={styles.resetPassword}>
              <p>Reset password</p>
            </div>
          )}
        </>
      </section>
    </>
  );
}
