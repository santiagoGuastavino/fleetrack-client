import axios, { AxiosInstance } from 'axios';

export const http: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BFF_URL}`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
