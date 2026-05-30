export const PAYMENT_PATHS = {
  config: '/api/payments/config',
  stripeConnect: '/api/sitter-profile/me/stripe/connect',
  topUp: '/api/payments/top-up',
  balance: '/api/payments/balance',
  deduct: '/api/payments/balance/deduct',
  withdraw: '/api/payments/withdraw',
} as const;
