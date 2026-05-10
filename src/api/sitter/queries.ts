import { useQuery } from '@tanstack/react-query';
import { fetchSitterProfile, fetchSitters } from './fetchers';
import type { SitterSearchParams } from './types';

export const sitterQueryKeys = {
  me: () => ['sitter', 'me'] as const,
  search: (params: SitterSearchParams) => ['sitter', 'search', params] as const,
};

export function useSitterProfile() {
  return useQuery({
    queryKey: sitterQueryKeys.me(),
    queryFn: fetchSitterProfile,
  });
}

export function useSitters(params: SitterSearchParams) {
  return useQuery({
    queryKey: sitterQueryKeys.search(params),
    queryFn: () => fetchSitters(params),
  });
}
