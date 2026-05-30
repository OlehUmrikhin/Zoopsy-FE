import type { BookingAsOwner } from '@api/booking';
import { BookingStatus } from '@api/booking';
import { BookingCardActions } from './BookingCardActions';
import { BookingCardHeader } from './BookingCardHeader';
import { BookingContactInfo } from './BookingContactInfo';
import { PAYMENT_STATUS_COLORS, PAYMENT_STATUS_LABELS } from '@constants/bookingStatuses';

type Props = {
  booking: BookingAsOwner;
  mode?: 'sitter' | 'owner';
  onApprove?: (comment?: string) => void;
  onCancel?: (comment?: string) => void;
  onCancelByOwner?: (comment?: string) => void;
  onComplete?: (comment?: string) => void;
  isActioning?: boolean;
};

function CommentBlock({ label, text }: { label?: string; text: string }) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <span className="font-inter text-xs font-semibold text-zoopsy-gray uppercase tracking-wide">
          {label}
        </span>
      )}
      <div className="bg-zoopsy-bg rounded-xl px-3 py-2">
        <span className="font-inter text-xs text-zoopsy-muted italic">&ldquo;{text}&rdquo;</span>
      </div>
    </div>
  );
}

export function BookingCard({
  booking,
  mode = 'sitter',
  onApprove,
  onCancel,
  onCancelByOwner,
  onComplete,
  isActioning = false,
}: Props) {
  const contactLabel = mode === 'sitter' ? 'Власник' : 'Сіттер';
  const showContactDetails =
    booking.status === BookingStatus.Active || booking.status === BookingStatus.Completed;

  return (
    <div className="bg-white rounded-2xl border border-zoopsy-light-gray/40 p-4 flex flex-col gap-3 shadow-sm">
      <BookingCardHeader
        serviceType={booking.serviceType}
        startDate={booking.startDate}
        endDate={booking.endDate}
        status={booking.status}
      />

      <div className="h-px bg-zoopsy-light-gray/40" />

      <BookingContactInfo
        contact={booking.contact}
        label={contactLabel}
        showDetails={showContactDetails}
      />

      {mode === 'owner' && booking.sitterComment && (
        <CommentBlock label="Коментар сіттера" text={booking.sitterComment} />
      )}
      {mode === 'sitter' && booking.ownerComment && <CommentBlock text={booking.ownerComment} />}
      {mode === 'owner' && booking.ownerComment && (
        <CommentBlock label="Ваш коментар" text={booking.ownerComment} />
      )}

      <div className="flex items-center justify-between">
        <span className="font-inter text-xs text-zoopsy-gray">Вартість</span>
        <span className="font-plus-jakarta font-bold text-zoopsy-green-900">{booking.cost} ₴</span>
      </div>

      {booking.paymentStatus && (
        <div className="flex items-center justify-between">
          <span className="font-inter text-xs text-zoopsy-gray">Статус оплати</span>
          <span
            className={`text-xs font-semibold font-inter px-2.5 py-1 rounded-full ${
              PAYMENT_STATUS_COLORS[booking.paymentStatus] ?? 'bg-gray-100 text-gray-600'
            }`}
          >
            {PAYMENT_STATUS_LABELS[booking.paymentStatus] ?? booking.paymentStatus}
          </span>
        </div>
      )}

      <BookingCardActions
        status={booking.status}
        mode={mode}
        sitterName={mode === 'owner' ? booking.contact.fullName : undefined}
        sitterProfileId={mode === 'owner' ? booking.sitterProfileId : undefined}
        onApprove={onApprove}
        onCancel={onCancel}
        onCancelByOwner={onCancelByOwner}
        onComplete={onComplete}
        isActioning={isActioning}
      />
    </div>
  );
}
