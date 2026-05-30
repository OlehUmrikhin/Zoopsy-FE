export type BookingContact = {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
};

export const BookingStatus = {
  Requested: 0,
  Active: 1,
  Completed: 2,
  Cancelled: 3,
} as const;

export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];

export type BookingAsOwner = {
  id: string;
  sitterProfileId: number;
  petId: string;
  serviceType: number;
  startDate: string;
  endDate: string;
  status: BookingStatus;
  cost: number;
  frozenAmount: number;
  paymentStatus: string;
  ownerComment: string;
  sitterComment: string;
  contact: BookingContact;
  /** Present only on initial POST /api/Booking response — use immediately to confirm card. */
  clientSecret?: string;
};

export type BookingAsSitter = BookingAsOwner;

export type BookingActionPayload = {
  id: string;
  sitterComment?: string;
};

export type BookingOwnerActionPayload = {
  id: string;
  ownerComment?: string;
};

export type CreateBookingPayload = {
  sitterProfileId: string;
  petId: string;
  serviceType: number;
  startDate: string;
  endDate: string;
  ownerComment?: string;
};

export type CurrentBooking = {
  id: string;
  petName: string;
  petWeight: number;
  petPhotoUrl: string | null;
  status: string;
  serviceType: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  cost: number;
  contactName: string;
};
