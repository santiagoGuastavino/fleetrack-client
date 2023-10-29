import { IResponse } from '@/interfaces/response.interface';
import { AxiosResponse } from 'axios';
import useSWR from 'swr';

interface ReturnType {
  isWakeLoading: boolean;
}

export default function useWake(): ReturnType {
  const { isLoading: isWakeLoading } = useSWR<AxiosResponse<IResponse<object>>>(
    `${process.env.NEXT_PUBLIC_DEFAULT_URL}`,
  );

  return { isWakeLoading };
}
