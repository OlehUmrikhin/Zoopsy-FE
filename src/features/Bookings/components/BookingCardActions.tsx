import { useState } from 'react';
import { BookingStatus } from '@api/booking';
import type { BookingStatus as BookingStatusType } from '@api/booking';
import { useMyReview } from '@api/booking/queries';
import { Button } from '@heroui/react';
import type { BookingActionType } from './BookingActionModal';
import { BookingActionModal } from './BookingActionModal';
import { ReviewModal } from './ReviewModal';

type Props = {
  status: BookingStatusType;
  mode: 'sitter' | 'owner';
  sitterName?: string;
  sitterProfileId?: number;
  onApprove?: (comment?: string) => void;
  onCancel?: (comment?: string) => void;
  onCancelByOwner?: (comment?: string) => void;
  onComplete?: (comment?: string) => void;
  isActioning?: boolean;
};

export function BookingCardActions({
  status,
  mode,
  sitterName,
  sitterProfileId,
  onApprove,
  onCancel,
  onCancelByOwner,
  onComplete,
  isActioning = false,
}: Props) {
  const [modalAction, setModalAction] = useState<BookingActionType | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const isReviewable =
    mode === 'owner' && status === BookingStatus.Completed && sitterProfileId != null;
  const { data: existingReview } = useMyReview(isReviewable ? sitterProfileId : undefined);

  const showSitterRequested =
    mode === 'sitter' && status === BookingStatus.Requested && (onApprove || onCancel);
  const showSitterActive =
    mode === 'sitter' && status === BookingStatus.Active && (onCancel || onComplete);
  const showOwnerCancel =
    mode === 'owner' &&
    (status === BookingStatus.Requested || status === BookingStatus.Active) &&
    onCancelByOwner;
  const showOwnerReview =
    mode === 'owner' && status === BookingStatus.Completed && sitterProfileId != null;

  if (!showSitterRequested && !showSitterActive && !showOwnerCancel && !showOwnerReview)
    return null;

  const handleConfirm = (comment?: string) => {
    if (modalAction === 'approve') onApprove?.(comment);
    else if (modalAction === 'cancel') onCancel?.(comment);
    else if (modalAction === 'complete') onComplete?.(comment);
    else if (modalAction === 'cancelByOwner') onCancelByOwner?.(comment);
    setModalAction(null);
  };

  return (
    <>
      {showSitterRequested && (
        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            className="flex-1 bg-zoopsy-green-900 text-white font-plus-jakarta font-bold rounded-xl"
            onPress={() => setModalAction('approve')}
            isDisabled={isActioning}
          >
            Прийняти
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="flex-1 font-plus-jakarta font-bold rounded-xl text-red-600"
            onPress={() => setModalAction('cancel')}
            isDisabled={isActioning}
          >
            Відхилити
          </Button>
        </div>
      )}

      {showSitterActive && (
        <div className="flex gap-2 pt-1">
          {onComplete && (
            <Button
              size="sm"
              className="flex-1 bg-zoopsy-green-900 text-white font-plus-jakarta font-bold rounded-xl"
              onPress={() => setModalAction('complete')}
              isDisabled={isActioning}
            >
              Завершити
            </Button>
          )}
          {onCancel && (
            <Button
              size="sm"
              variant="ghost"
              className="flex-1 font-plus-jakarta font-bold rounded-xl text-red-600"
              onPress={() => setModalAction('cancel')}
              isDisabled={isActioning}
            >
              Скасувати
            </Button>
          )}
        </div>
      )}

      {showOwnerCancel && (
        <div className="pt-1">
          <Button
            size="sm"
            variant="ghost"
            className="w-full font-plus-jakarta font-bold rounded-xl text-red-600"
            onPress={() => setModalAction('cancelByOwner')}
            isDisabled={isActioning}
          >
            Скасувати бронювання
          </Button>
        </div>
      )}

      {showOwnerReview && (
        <div className="pt-1">
          <Button
            size="sm"
            className="w-full bg-zoopsy-green-900 text-white font-plus-jakarta font-bold rounded-xl"
            onPress={() => setIsReviewOpen(true)}
            isDisabled={isActioning}
          >
            {existingReview ? 'Редагувати відгук' : 'Залишити відгук'}
          </Button>
        </div>
      )}

      {modalAction && (
        <BookingActionModal
          isOpen
          action={modalAction}
          isPending={isActioning}
          onConfirm={handleConfirm}
          onClose={() => setModalAction(null)}
        />
      )}

      {isReviewOpen && sitterProfileId != null && (
        <ReviewModal
          isOpen
          sitterName={sitterName ?? 'сіттера'}
          sitterProfileId={sitterProfileId}
          onClose={() => setIsReviewOpen(false)}
        />
      )}
    </>
  );
}
