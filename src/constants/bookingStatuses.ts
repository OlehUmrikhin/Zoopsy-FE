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

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  AwaitingPayment: 'Очікує оплати',
  Authorized: 'Оплата заморожена',
  Captured: 'Оплачено',
  Released: 'Повернено',
  PaymentFailed: 'Помилка оплати',
};

export const PAYMENT_STATUS_COLORS: Record<string, string> = {
  AwaitingPayment: 'bg-yellow-50 text-yellow-700',
  Authorized: 'bg-blue-50 text-blue-700',
  Captured: 'bg-green-50 text-green-700',
  Released: 'bg-gray-100 text-gray-500',
  PaymentFailed: 'bg-red-50 text-red-600',
};
