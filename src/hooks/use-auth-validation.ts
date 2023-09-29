import { IAuthPayload, IResponse } from '@/interfaces/response.interface';
import { useState, useEffect } from 'react';

interface ReturnType {
  canSubmit: boolean;
}

interface Props {
  emailValue: string;
  passwordValue: string;
  response: IResponse<IAuthPayload> | undefined;
  listenUserInteraction: boolean;
}

export default function useAuthValidation({
  emailValue,
  passwordValue,
  response,
  listenUserInteraction,
}: Props): ReturnType {
  const [canSubmit, setCanSubmit] = useState<boolean>(false);

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

  return { canSubmit };
}
