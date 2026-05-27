import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchAdminUsers } from './fetchers';
import type { AdminUsersParams } from './types';

export const adminUsersQueryKeys = {
  all: () => ['admin', 'users'] as const,
  list: (params: AdminUsersParams) => ['admin', 'users', params] as const,
};

export function useAdminUsers(params: AdminUsersParams) {
  return useQuery({
    queryKey: adminUsersQueryKeys.list(params),
    queryFn: () => fetchAdminUsers(params),
    placeholderData: keepPreviousData,
  });
}
