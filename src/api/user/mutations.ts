import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UserRole } from '../../types';
import { patchOwnerProfile, patchUserRole, deleteOwnerPet } from './fetchers';
import type { UpdateOwnerProfilePayload } from './fetchers';
import { ownerQueryKeys } from '../owner/queries';

export function useSetUserRole() {
  return useMutation({
    mutationFn: (role: UserRole) => patchUserRole(role),
  });
}

export function useUpdateOwnerProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateOwnerProfilePayload) => patchOwnerProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ownerQueryKeys.me() });
    },
  });
}

export function useDeleteOwnerPet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteOwnerPet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ownerQueryKeys.me() });
    },
  });
}
