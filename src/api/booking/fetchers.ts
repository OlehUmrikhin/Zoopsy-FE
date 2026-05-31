import { axiosInstance } from '../../lib/axios';
import { BOOKING_PATHS } from './paths';
import type {
  BookingAsOwner,
  BookingAsSitter,
  BookingActionPayload,
  BookingOwnerActionPayload,
  CreateBookingPayload,
  CurrentBooking,
} from './types';
import type { CreateReviewPayload, UpdateReviewPayload, Review } from '../review/types';

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

export async function getCurrentBooking(): Promise<CurrentBooking | null> {
  try {
    const { data } = await axiosInstance.get<CurrentBooking>(BOOKING_PATHS.myCurrent);
    return data;
  } catch {
    return null;
  }
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

export async function createBookingReview({
  sitterProfileId,
  rating,
  comment,
}: CreateReviewPayload) {
  const { data } = await axiosInstance.post(BOOKING_PATHS.review, {
    sitterProfileId,
    rating,
    comment,
  });
  return data;
}

export async function getMyReview(sitterProfileId: number): Promise<Review | null> {
  try {
    const { data } = await axiosInstance.get<Review>(BOOKING_PATHS.myReview(sitterProfileId));
    return data;
  } catch {
    return null;
  }
}

export async function updateReview({ id, rating, comment }: UpdateReviewPayload): Promise<Review> {
  const { data } = await axiosInstance.patch<Review>(BOOKING_PATHS.updateReview(id), {
    rating,
    comment,
  });
  return data;
}
