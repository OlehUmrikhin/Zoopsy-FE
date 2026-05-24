import { BookingStatus } from '@api/booking';

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  [BookingStatus.Requested]: 'Очікує підтвердження',
  [BookingStatus.Active]: 'Активне',
  [BookingStatus.Completed]: 'Завершено',
  [BookingStatus.Cancelled]: 'Скасовано',
};

export const BOOKING_STATUS_COLORS: Record<BookingStatus, string> = {
  [BookingStatus.Requested]: 'bg-yellow-100 text-yellow-800',
  [BookingStatus.Active]: 'bg-zoopsy-mint text-zoopsy-green-900',
  [BookingStatus.Completed]: 'bg-blue-50 text-blue-700',
  [BookingStatus.Cancelled]: 'bg-red-50 text-red-600',
};
