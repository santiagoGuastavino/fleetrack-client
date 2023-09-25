import styles from '@/styles/pages/home-page.module.scss';
import { useState, useEffect } from 'react';
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

export default function HomePage(): JSX.Element {
  const [canSubmit, setCanSubmit] = useState<boolean>(false);
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

  useEffect(() => {
    if (emailValue && passwordValue) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  }, [emailValue, passwordValue]);

  useEffect(() => {
    if (response && response.statusCode > 300) {
      setCanSubmit(false);
    }
  }, [response]);

  useEffect(() => {
    if (listenUserInteraction) {
      setCanSubmit(true);
    }
  }, [listenUserInteraction]);

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

  return (
    <>
      <Navbar />
      {requestStatus === RequestStatus.LOADING ? <Loading /> : undefined}
      <section
        className={`${
          requestStatus === RequestStatus.LOADING ? 'isLoading' : undefined
        }`}
      >
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