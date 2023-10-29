import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface IAuthStore {
  jwt_access_token: string;
  jwt_refresh_token: string;
  actions: {
    getJwtAccessToken: () => string;
    setJwtAccessToken: (token: string) => void;
    getJwtRefreshToken: () => string;
    setJwtRefreshToken: (token: string) => void;
  };
}

const useAuthStore = create<IAuthStore>()(
  devtools((set, get) => ({
    jwt_access_token: '',
    jwt_refresh_token: '',
    actions: {
      getJwtAccessToken(): string {
        return get().jwt_access_token;
      },
      setJwtAccessToken(token: string): void {
        set((state) => ({
          ...state,
          jwt_access_token: token,
        }));
      },
      getJwtRefreshToken(): string {
        return get().jwt_refresh_token;
      },
      setJwtRefreshToken(token: string): void {
        set((state) => ({
          ...state,
          jwt_refresh_token: token,
        }));
      },
    },
  })),
);

export const useAuthActions = () =>
  useAuthStore((store: IAuthStore) => store.actions);
