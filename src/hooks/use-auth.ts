import { IAuthPayload, IResponse } from '@/interfaces/response.interface';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { http } from '@/config/axios';
import { AuthSchema } from '@/schemas/auth.schema';
import { RequestStatus } from '@/enums/request-status.enum';

interface ReturnType {
  canSubmit: boolean;
  response: IResponse<IAuthPayload> | undefined;
}

interface Props {
  emailValue: string;
  passwordValue: string;
  requestData: AuthSchema | undefined;
  listenUserInteraction: boolean;
  setRequestStatus: Dispatch<SetStateAction<RequestStatus>>;
  setShowPasswordHelper: Dispatch<SetStateAction<boolean>>;
}

export default function useAuth({
  emailValue,
  passwordValue,
  requestData,
  listenUserInteraction,
  setRequestStatus,
  setShowPasswordHelper,
}: Props): ReturnType {
  const [canSubmit, setCanSubmit] = useState<boolean>(false);
  const [response, setResponse] = useState<
    IResponse<IAuthPayload> | undefined
  >();

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
      setRequestStatus(RequestStatus.IDLE);
    }
  }, [listenUserInteraction]);

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
        console.log('request data before post to signup', requestData);
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
        setRequestStatus(RequestStatus.DONE);
      }
    }
  }, [response]);

  return { canSubmit, response };
}
