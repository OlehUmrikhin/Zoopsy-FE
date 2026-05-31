import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Button } from '@heroui/react';
import { useState } from 'react';

interface Props {
  bookingId: string;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

export function BookingPaymentForm({ bookingId, onSuccess, onError }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/bookings/${bookingId}/payment-result`,
      },
      redirect: 'if_required',
    });
    setIsLoading(false);

    if (error) {
      onError(error.message ?? 'Помилка оплати.');
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PaymentElement />
      <Button
        type="submit"
        isDisabled={!stripe || isLoading}
        className="w-full h-11 rounded-xl bg-zoopsy-green-900 text-white font-plus-jakarta font-bold"
      >
        Підтвердити та заморозити оплату
      </Button>
    </form>
  );
}
