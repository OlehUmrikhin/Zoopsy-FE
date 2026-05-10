import { useMutation } from '@tanstack/react-query';
import { patchSitterProfile } from './fetchers';
import type { UpdateSitterProfilePayload } from './fetchers';

export function useUpdateSitterProfile() {
  return useMutation({
    mutationFn: (payload: UpdateSitterProfilePayload) => patchSitterProfile(payload),
  });
}
