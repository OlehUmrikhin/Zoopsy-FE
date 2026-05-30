import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';

function PaymentResultPage() {
  const { bookingId } = Route.useParams();
  const { payment_intent_client_secret } = Route.useSearch();
  const stripe = useStripe();
  const [message, setMessage] = useState('Завантаження...');

  useEffect(() => {
    if (!stripe || !payment_intent_client_secret) {
      setMessage('Не вдалося отримати статус оплати.');
      return;
    }

    stripe.retrievePaymentIntent(payment_intent_client_secret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case 'requires_capture':
          setMessage('Карту авторизовано — оплата заморожена до завершення послуги.');
          break;
        case 'requires_payment_method':
          setMessage('Оплата не пройшла. Будь ласка, спробуйте ще раз.');
          break;
        case 'succeeded':
          setMessage('Оплату успішно проведено!');
          break;
        case 'canceled':
          setMessage('Оплату скасовано.');
          break;
        default:
          setMessage(`Статус: ${paymentIntent?.status ?? 'невідомо'}`);
      }
    });
  }, [stripe, payment_intent_client_secret, bookingId]);

  return (
    <div className="min-h-screen bg-zoopsy-mint flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-sm flex flex-col gap-4">
        <p className="font-inter text-zoopsy-dark-gray">{message}</p>
        <Link to="/bookings" className="font-inter text-zoopsy-green-900 underline text-sm">
          До бронювань
        </Link>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/bookings_/$bookingId/payment-result')({
  validateSearch: (search: Record<string, unknown>) => ({
    payment_intent_client_secret: (search.payment_intent_client_secret as string) ?? '',
    payment_intent: (search.payment_intent as string) ?? '',
    redirect_status: (search.redirect_status as string) ?? '',
  }),
  component: PaymentResultPage,
});
