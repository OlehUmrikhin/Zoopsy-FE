import { useMutation } from '@tanstack/react-query';
import type { UserRole } from '../../types';
import { patchOwnerProfile, patchUserRole, deleteOwnerPet } from './fetchers';
import type { UpdateOwnerProfilePayload } from './fetchers';

export function useSetUserRole() {
  return useMutation({
    mutationFn: (role: UserRole) => patchUserRole(role),
  });
}

export function useUpdateOwnerProfile() {
  return useMutation({
    mutationFn: (payload: UpdateOwnerProfilePayload) => patchOwnerProfile(payload),
  });
}

export function useDeleteOwnerPet() {
  return useMutation({
    mutationFn: (id: string) => deleteOwnerPet(id),
  });
}
