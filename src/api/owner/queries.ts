import { useQuery } from '@tanstack/react-query';
import { fetchOwnerProfile } from './fetchers';

export const ownerQueryKeys = {
  me: () => ['owner', 'me'] as const,
};

export function useOwnerProfile() {
  return useQuery({
    queryKey: ownerQueryKeys.me(),
    queryFn: fetchOwnerProfile,
  });
}
