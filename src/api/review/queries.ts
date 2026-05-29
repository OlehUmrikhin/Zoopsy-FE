import { useQuery } from '@tanstack/react-query';
import { fetchReviewsBySitter, fetchMyReviewForSitter } from './fetchers';

export const reviewQueryKeys = {
  bySitter: (sitterProfileId: number) => ['reviews', 'bySitter', sitterProfileId] as const,
  myForSitter: (sitterProfileId: number) => ['reviews', 'my', sitterProfileId] as const,
};

export function useReviewsBySitter(sitterProfileId: number | undefined) {
  return useQuery({
    queryKey: reviewQueryKeys.bySitter(sitterProfileId!),
    queryFn: () => fetchReviewsBySitter(sitterProfileId!),
    enabled: sitterProfileId !== undefined,
  });
}

export function useMyReviewForSitter(sitterProfileId: number | undefined) {
  return useQuery({
    queryKey: reviewQueryKeys.myForSitter(sitterProfileId!),
    queryFn: () => fetchMyReviewForSitter(sitterProfileId!),
    enabled: sitterProfileId !== undefined,
  });
}
