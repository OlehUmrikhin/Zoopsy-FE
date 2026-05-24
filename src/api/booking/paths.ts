export const BOOKING_PATHS = {
  create: '/api/Booking',
  myAsOwner: '/api/Booking/my/as-owner',
  myAsSitter: '/api/Booking/my/as-sitter',
  approve: (id: string) => `/api/Booking/${id}/approve`,
  cancel: (id: string) => `/api/Booking/${id}/cancel`,
  cancelByOwner: (id: string) => `/api/Booking/${id}/cancel-by-owner`,
  complete: (id: string) => `/api/Booking/${id}/complete`,
} as const;
