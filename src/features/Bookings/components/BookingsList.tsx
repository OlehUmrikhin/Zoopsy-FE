import type { BookingAsOwner } from '@api/booking';
import { BookingCard } from './BookingCard';

type Props = {
  bookings: BookingAsOwner[] | undefined;
  isLoading: boolean;
  isError: boolean;
  mode?: 'sitter' | 'owner';
  onApprove?: (id: string, comment?: string) => void;
  onCancel?: (id: string, comment?: string) => void;
  onCancelByOwner?: (id: string, comment?: string) => void;
  onComplete?: (id: string, comment?: string) => void;
  loadingId?: string;
};

export function BookingsList({
  bookings,
  isLoading,
  isError,
  mode = 'sitter',
  onApprove,
  onCancel,
  onCancelByOwner,
  onComplete,
  loadingId,
}: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-zoopsy-light-gray/40 h-48 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="font-inter text-sm text-red-500">
        Не вдалося завантажити бронювання. Спробуйте пізніше.
      </p>
    );
  }

  if (!bookings?.length) {
    return <p className="font-inter text-sm text-zoopsy-gray">У вас поки немає бронювань.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          mode={mode}
          onApprove={onApprove ? (comment) => onApprove(booking.id, comment) : undefined}
          onCancel={onCancel ? (comment) => onCancel(booking.id, comment) : undefined}
          onCancelByOwner={
            onCancelByOwner ? (comment) => onCancelByOwner(booking.id, comment) : undefined
          }
          onComplete={onComplete ? (comment) => onComplete(booking.id, comment) : undefined}
          isActioning={loadingId === booking.id}
        />
      ))}
    </div>
  );
}
