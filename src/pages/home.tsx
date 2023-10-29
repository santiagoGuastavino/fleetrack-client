import { useAuthActions } from '@/store/auth';

export default function HomePage(): JSX.Element {
  const { getJwtAccessToken } = useAuthActions();

  return <div>{getJwtAccessToken()}</div>;
}
