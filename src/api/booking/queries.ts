import { useQuery } from '@tanstack/react-query';
import { getMyBookingsAsOwner, getMyBookingsAsSitter } from './fetchers';

export const bookingQueryKeys = {
  myAsOwner: ['booking', 'my', 'as-owner'] as const,
  myAsSitter: ['booking', 'my', 'as-sitter'] as const,
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
