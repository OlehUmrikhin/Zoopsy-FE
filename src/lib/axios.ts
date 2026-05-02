import axios from 'axios';

type TokenGetter = () => Promise<string | null>;

let tokenGetter: TokenGetter = () => Promise.resolve(null);

export function setAuthTokenGetter(getter: TokenGetter) {
  tokenGetter = getter;
}

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = await tokenGetter();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
