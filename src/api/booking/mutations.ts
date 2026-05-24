import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createBooking,
  approveBooking,
  cancelBooking,
  cancelBookingByOwner,
  completeBooking,
} from './fetchers';
import type {
  BookingActionPayload,
  BookingOwnerActionPayload,
  CreateBookingPayload,
} from './types';
import { bookingQueryKeys } from './queries';

type ActionCallbacks = {
  onSuccess?: () => void;
  onError?: () => void;
};

export function useCreateBooking() {
  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => createBooking(payload),
  });
}

export function useApproveBooking(callbacks?: ActionCallbacks) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BookingActionPayload) => approveBooking(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.myAsSitter });
      callbacks?.onSuccess?.();
    },
    onError: () => callbacks?.onError?.(),
  });
}

export function useCancelBooking(callbacks?: ActionCallbacks) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BookingActionPayload) => cancelBooking(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.myAsSitter });
      callbacks?.onSuccess?.();
    },
    onError: () => callbacks?.onError?.(),
  });
}

export function useCancelBookingByOwner(callbacks?: ActionCallbacks) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BookingOwnerActionPayload) => cancelBookingByOwner(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.myAsOwner });
      callbacks?.onSuccess?.();
    },
    onError: () => callbacks?.onError?.(),
  });
}

export function useCompleteBooking(callbacks?: ActionCallbacks) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BookingActionPayload) => completeBooking(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.myAsSitter });
      callbacks?.onSuccess?.();
    },
    onError: () => callbacks?.onError?.(),
  });
}
