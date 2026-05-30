import { createFileRoute, Link } from '@tanstack/react-router';

function StripeCompletePage() {
  return (
    <div className="min-h-screen bg-zoopsy-mint flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-sm flex flex-col gap-4">
        <h2 className="font-plus-jakarta font-bold text-xl text-zoopsy-dark-gray">
          Рахунок підключено!
        </h2>
        <p className="font-inter text-zoopsy-gray text-sm">
          Ваш банківський рахунок успішно підключено до Stripe. Тепер ви отримуватимете виплати
          після завершення послуг.
        </p>
        <Link to="/profile" className="font-inter text-zoopsy-green-900 underline text-sm">
          До профілю
        </Link>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/sitter/stripe/complete')({
  component: StripeCompletePage,
});
