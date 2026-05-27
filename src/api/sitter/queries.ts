import { useQuery } from '@tanstack/react-query';
import { fetchSitterProfile, fetchSitters, fetchSitterById } from './fetchers';
import type { SitterSearchParams } from './types';

export const sitterQueryKeys = {
  me: () => ['sitter', 'me'] as const,
  search: (params: SitterSearchParams) => ['sitter', 'search', params] as const,
  byId: (userId: string) => ['sitter', 'byId', userId] as const,
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
    staleTime: 5 * 60 * 1000,
  });
}

export function useSitterById(userId: string) {
  return useQuery({
    queryKey: sitterQueryKeys.byId(userId),
    queryFn: () => fetchSitterById(userId),
    enabled: !!userId,
  });
}
