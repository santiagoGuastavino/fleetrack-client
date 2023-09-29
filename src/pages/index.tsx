import styles from '@/styles/pages/home-page.module.scss';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AxiosError, AxiosResponse } from 'axios';
import Navbar from '@/components/Navbar';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthSchema, authSchema } from '@/schemas/auth.schema';
import InputBox from '@/components/InputBox';
import Button from '@/components/Button';
import { http } from '@/config/axios';
import { IAuthPayload, IResponse } from '@/interfaces/response.interface';
import { RequestStatus } from '@/enums/request-status.enum';
import Loading from '@/components/Loading';
import ErrorBox from '@/components/ErrorBox';
import useWake from '@/hooks/use-wake';
import Title from '@/components/Title';
import useAuthValidation from '@/hooks/use-auth-validation';

export default function HomePage(): JSX.Element {
  const { isWakeLoading } = useWake();

  const [requestStatus, setRequestStatus] = useState<RequestStatus>(
    RequestStatus.IDLE,
  );
  const [response, setResponse] = useState<
    IResponse<IAuthPayload> | undefined
  >();
  const [listenUserInteraction, setListenUserInteraction] =
    useState<boolean>(false);

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

  const { canSubmit } = useAuthValidation({
    emailValue,
    passwordValue,
    response,
    listenUserInteraction,
  });

  const onSubmit = async (data: AuthSchema): Promise<void> => {
    setRequestStatus(RequestStatus.LOADING);

    try {
      const response: AxiosResponse<IResponse<IAuthPayload>> = await http.post(
        `${process.env.NEXT_PUBLIC_DEFAULT_URL}/auth/login`,
        data,
      );
      console.log(response);
    } catch (error) {
      if (error instanceof AxiosError) {
        setRequestStatus(RequestStatus.ERROR);
        setResponse(error?.response?.data);
      }
    }
  };

  return isWakeLoading ? (
    <>
      <Navbar />
      <Loading />
      <section>
        <div className={styles.outerDiv}>
          <div className={styles.innerDiv}>
            <p className={styles.first}>Please wait</p>
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
        {requestStatus === RequestStatus.ERROR && response?.errors.length && (
          <ErrorBox message={response.message} errors={response.errors} />
        )}
      </section>
    </>
  );
}
