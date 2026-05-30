import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { getStripeConfig } from '../api/payments';

type StripePromise = ReturnType<typeof loadStripe>;

/**
 * Lazily loads Stripe only when `active` becomes true.
 * Pass `isOpen` from your modal so Stripe loads on demand, not on app start.
 */
export function useStripeInit(active: boolean): StripePromise | null {
  const [stripePromise, setStripePromise] = useState<StripePromise | null>(null);

  useEffect(() => {
    if (!active || stripePromise) return;
    getStripeConfig().then(({ publishableKey }) => {
      setStripePromise(loadStripe(publishableKey));
    });
  }, [active, stripePromise]);

  return stripePromise;
}
