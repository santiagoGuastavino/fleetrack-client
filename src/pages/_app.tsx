import '@/styles/_globals.scss';
import type { AppProps } from 'next/app';
import { http } from '@/config/axios';
import { SWRConfig } from 'swr';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={{ fetcher: http, revalidateOnFocus: false }}>
      <Component {...pageProps} />
    </SWRConfig>
  );
}
