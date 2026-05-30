import { useMutation } from '@tanstack/react-query';
import { createComplaint } from './fetchers';

export function useCreateComplaintMutation() {
  return useMutation({ mutationFn: createComplaint });
}
