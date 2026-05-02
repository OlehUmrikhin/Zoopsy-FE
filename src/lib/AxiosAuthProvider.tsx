import { useEffect, type ReactNode } from 'react';
import { useAuth } from '@clerk/react';
import { setAuthTokenGetter } from './axios';

interface Props {
  children: ReactNode;
}

export function AxiosAuthProvider({ children }: Props) {
  const { getToken } = useAuth();

  useEffect(() => {
    setAuthTokenGetter(getToken);
  }, [getToken]);

  return <>{children}</>;
}
