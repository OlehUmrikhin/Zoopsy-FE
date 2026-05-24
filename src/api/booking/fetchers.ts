import { axiosInstance } from '../../lib/axios';
import { BOOKING_PATHS } from './paths';
import type {
  BookingAsOwner,
  BookingAsSitter,
  BookingActionPayload,
  BookingOwnerActionPayload,
  CreateBookingPayload,
} from './types';

export async function createBooking(payload: CreateBookingPayload) {
  const { data } = await axiosInstance.post(BOOKING_PATHS.create, payload);
  return data;
}

export async function getMyBookingsAsOwner(): Promise<BookingAsOwner[]> {
  const { data } = await axiosInstance.get<BookingAsOwner[]>(BOOKING_PATHS.myAsOwner);
  return data;
}

export async function getMyBookingsAsSitter(): Promise<BookingAsSitter[]> {
  const { data } = await axiosInstance.get<BookingAsSitter[]>(BOOKING_PATHS.myAsSitter);
  return data;
}

export async function approveBooking({ id, sitterComment }: BookingActionPayload) {
  const { data } = await axiosInstance.patch(BOOKING_PATHS.approve(id), { sitterComment });
  return data;
}

export async function cancelBooking({ id, sitterComment }: BookingActionPayload) {
  const { data } = await axiosInstance.patch(BOOKING_PATHS.cancel(id), { sitterComment });
  return data;
}

export async function cancelBookingByOwner({ id, ownerComment }: BookingOwnerActionPayload) {
  const { data } = await axiosInstance.patch(BOOKING_PATHS.cancelByOwner(id), { ownerComment });
  return data;
}

export async function completeBooking({ id, sitterComment }: BookingActionPayload) {
  const { data } = await axiosInstance.patch(BOOKING_PATHS.complete(id), { sitterComment });
  return data;
}
