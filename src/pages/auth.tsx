import styles from '@/styles/pages/auth.module.scss';
import Button from '@/components/Button';
import ErrorBox from '@/components/ErrorBox';
import InputBox from '@/components/InputBox';
import Loading from '@/components/Loading';
import Navbar from '@/components/Navbar';
import Title from '@/components/Title';
import { RequestStatus } from '@/enums/request-status.enum';
import { NextRouter, useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IAuthPayload, IResponse } from '@/interfaces/response.interface';
import { useAuthActions } from '@/store/auth';
import { AxiosError, AxiosResponse } from 'axios';
import { http } from '@/config/axios';

export default function AuthPage(): JSX.Element {
  const [emailValue, setEmailValue] = useState<string>('');
  const [passwordValue, setPasswordValue] = useState<string>('');

  const [requestData, setRequestData] = useState<AuthSchema>();
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(
    RequestStatus.IDLE,
  );
  const [showPasswordHelper, setShowPasswordHelper] = useState<boolean>(false);
  const [canSubmit, setCanSubmit] = useState<boolean>(false);
  const [response, setResponse] = useState<
    IResponse<IAuthPayload> | undefined
  >();

  const router: NextRouter = useRouter();
  const { setJwtAccessToken, setJwtRefreshToken } = useAuthActions();

  const handleSubmit = async (): Promise<void> => {
    setRequestStatus(RequestStatus.LOADING);
    setShowPasswordHelper(false);
    setRequestData(data);
  };

  useEffect(() => {
    console.log(canSubmit);
  }, [canSubmit, emailValue, passwordValue]);

  useEffect(() => {
    if (requestStatus === RequestStatus.DONE) {
      router.push('/home');
    }
  }, [requestStatus]);

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
    const postLogin = async () => {
      try {
        const response: AxiosResponse<IResponse<IAuthPayload>> =
          await http.post(
            `${process.env.NEXT_PUBLIC_DEFAULT_URL}/auth/login`,
            requestData,
          );
        setResponse(response.data);
      } catch (error) {
        if (error instanceof AxiosError) {
          setResponse(error?.response?.data);
        }
      }
    };

    if (requestData) {
      postLogin();
    }
  }, [requestData]);

  useEffect(() => {
    const postSignup = async () => {
      try {
        const response: AxiosResponse<IResponse<IAuthPayload>> =
          await http.post(
            `${process.env.NEXT_PUBLIC_DEFAULT_URL}/auth/signup`,
            requestData,
          );
        setResponse(response.data);
      } catch (error) {
        if (error instanceof AxiosError) {
          setResponse(error?.response?.data);
        }
      }
    };

    if (response) {
      if (
        response.statusCode === 400 &&
        response.errors[0].property === 'password'
      ) {
        setRequestStatus(RequestStatus.ERROR);
        setShowPasswordHelper(true);
      }

      if (response.statusCode === 404 && response.errors[0].entity === 'user') {
        postSignup();
      }

      if (
        response.statusCode === 409 &&
        response.errors[0].property === 'email'
      ) {
        setRequestStatus(RequestStatus.ERROR);
      }

      if (response.statusCode === 200 || response.statusCode === 201) {
        setJwtAccessToken(response.payload.access_token);
        setJwtRefreshToken(response.payload.refresh_token);
        setRequestStatus(RequestStatus.DONE);
      }
    }
  }, [response]);

  return (
    <>
      <Navbar />
      {requestStatus === RequestStatus.LOADING ? <Loading /> : undefined}
      <section
        className={`${
          requestStatus === RequestStatus.LOADING ? 'isLoading' : undefined
        }`}
      >
        <Title label="login / signup" />
        <form className={styles.form} onSubmit={handleSubmit}>
          <InputBox
            label="email"
            name="email"
            error={errors?.email !== undefined}
            errorMessage={errors?.email?.message}
            type="text"
            disabled={requestStatus === RequestStatus.LOADING}
          />
          <InputBox
            label="password"
            name="password"
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
