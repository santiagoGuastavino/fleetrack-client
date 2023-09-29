import { IResponse } from '@/interfaces/response.interface';
import { AxiosResponse } from 'axios';
import useSWR from 'swr';

interface ReturnType {
  isWakeLoading: boolean;
}

export default function useWake(): ReturnType {
  const { error, isLoading: isWakeLoading } = useSWR<
    AxiosResponse<IResponse<object>>
  >(`${process.env.NEXT_PUBLIC_DEFAULT_URL}`);

  if (error) {
    // handle error later
  }

  return { isWakeLoading };
}
