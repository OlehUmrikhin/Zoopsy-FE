import { useQuery } from '@tanstack/react-query';
import { fetchCurrentUser } from './fetchers';

export const userQueryKeys = {
  me: () => ['user', 'me'] as const,
};

export function useCurrentUser() {
  return useQuery({
    queryKey: userQueryKeys.me(),
    queryFn: fetchCurrentUser,
  });
}
