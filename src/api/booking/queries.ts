import { useQuery } from '@tanstack/react-query';
import { getMyBookingsAsOwner, getMyBookingsAsSitter, getMyReview } from './fetchers';

export const bookingQueryKeys = {
  myAsOwner: ['booking', 'my', 'as-owner'] as const,
  myAsSitter: ['booking', 'my', 'as-sitter'] as const,
  myReview: (sitterProfileId: number) => ['review', 'my', sitterProfileId] as const,
};

export function useMyBookingsAsOwner() {
  return useQuery({
    queryKey: bookingQueryKeys.myAsOwner,
    queryFn: getMyBookingsAsOwner,
  });
}

export function useMyBookingsAsSitter() {
  return useQuery({
    queryKey: bookingQueryKeys.myAsSitter,
    queryFn: getMyBookingsAsSitter,
  });
}

export function useMyReview(sitterProfileId: number | undefined) {
  return useQuery({
    queryKey: bookingQueryKeys.myReview(sitterProfileId!),
    queryFn: () => getMyReview(sitterProfileId!),
    enabled: sitterProfileId != null,
  });
}
