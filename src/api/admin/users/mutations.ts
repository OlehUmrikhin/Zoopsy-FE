import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAdminUser, updateAdminUserStatus } from './fetchers';
import { adminUsersQueryKeys } from './queries';
import type { UpdateAdminUserPayload, UpdateUserStatusPayload } from './types';

export function useUpdateAdminUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: UpdateAdminUserPayload }) =>
      updateAdminUser(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUsersQueryKeys.all() });
    },
  });
}

export function useUpdateAdminUserStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: UpdateUserStatusPayload }) =>
      updateAdminUserStatus(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUsersQueryKeys.all() });
    },
  });
}
