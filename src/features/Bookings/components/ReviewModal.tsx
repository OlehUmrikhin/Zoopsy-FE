import { useState } from 'react';
import {
  Button,
  Modal,
  ModalBackdrop,
  ModalContainer,
  ModalDialog,
  ModalHeader,
  ModalBody,
  ModalFooter,
  TextField,
  Label,
  TextArea,
  Spinner,
} from '@heroui/react';
import { MdStar, MdStarOutline } from 'react-icons/md';
import { useMyReview } from '@api/booking/queries';
import { useCreateBookingReview, useUpdateReview } from '@api/booking/mutations';
import { toast } from 'react-toastify';

type Props = {
  isOpen: boolean;
  sitterName: string;
  sitterProfileId: number;
  onClose: () => void;
};

function StarSelector({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="text-2xl transition-transform hover:scale-110 focus:outline-none"
          aria-label={`${star} зірок`}
        >
          {star <= (hovered || value) ? (
            <MdStar className="text-yellow-400" />
          ) : (
            <MdStarOutline className="text-zoopsy-light-gray" />
          )}
        </button>
      ))}
    </div>
  );
}

type ReviewFormProps = {
  initialRating: number;
  initialComment: string;
  isEditing: boolean;
  existingReviewId?: number;
  sitterProfileId: number;
  onClose: () => void;
};

function ReviewForm({
  initialRating,
  initialComment,
  isEditing,
  existingReviewId,
  sitterProfileId,
  onClose,
}: ReviewFormProps) {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);

  const { mutate: createReview, isPending: isCreating } = useCreateBookingReview({
    onSuccess: () => {
      toast.success('Відгук успішно надіслано!');
      onClose();
    },
    onError: () => toast.error('Не вдалося надіслати відгук. Спробуйте ще раз.'),
  });

  const { mutate: updateReview, isPending: isUpdating } = useUpdateReview({
    onSuccess: () => {
      toast.success('Відгук оновлено!');
      onClose();
    },
    onError: () => toast.error('Не вдалося оновити відгук. Спробуйте ще раз.'),
  });

  const isPending = isCreating || isUpdating;

  const handleConfirm = () => {
    if (rating === 0) return;
    if (isEditing && existingReviewId != null) {
      updateReview({ id: existingReviewId, rating, comment: comment.trim() });
    } else {
      createReview({ sitterProfileId, rating, comment: comment.trim() });
    }
  };

  return (
    <>
      <ModalBody className="py-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="font-inter text-xs font-semibold text-zoopsy-dark-gray uppercase tracking-wide">
            Оцінка
          </span>
          <StarSelector value={rating} onChange={setRating} />
          {rating === 0 && (
            <span className="font-inter text-xs text-zoopsy-gray">Оберіть оцінку</span>
          )}
        </div>

        <TextField value={comment} onChange={setComment} className="font-inter flex flex-col gap-1">
          <Label className="text-xs font-semibold !text-zoopsy-dark-gray uppercase tracking-wide">
            Відгук
          </Label>
          <TextArea
            placeholder="Розкажіть про свій досвід (необов'язково)"
            className="border border-zoopsy-light-gray/40 rounded-xl px-3 py-2 text-zoopsy-dark-gray placeholder:text-zoopsy-gray/60 focus:outline-none focus:border-zoopsy-green-900 hover:border-zoopsy-gray/60 resize-none min-h-[80px]"
          />
        </TextField>
      </ModalBody>
      <ModalFooter>
        <Button
          variant="ghost"
          className="font-plus-jakarta font-bold rounded-xl"
          onPress={onClose}
          isDisabled={isPending}
        >
          Назад
        </Button>
        <Button
          className="bg-zoopsy-green-900 text-white font-plus-jakarta font-bold rounded-xl"
          onPress={handleConfirm}
          isDisabled={rating === 0 || isPending}
          isPending={isPending}
        >
          {isEditing ? 'Оновити' : 'Надіслати'}
        </Button>
      </ModalFooter>
    </>
  );
}

export function ReviewModal({ isOpen, sitterName, sitterProfileId, onClose }: Props) {
  const { data: existingReview, isLoading: isLoadingReview } = useMyReview(
    isOpen ? sitterProfileId : undefined,
  );

  const isEditing = existingReview != null;

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalBackdrop>
        <ModalContainer size="sm">
          <ModalDialog>
            <ModalHeader className="font-plus-jakarta">
              {isEditing
                ? `Редагувати відгук про ${sitterName}`
                : `Залишити відгук про ${sitterName}`}
            </ModalHeader>
            {isLoadingReview ? (
              <ModalBody>
                <div className="flex justify-center py-6">
                  <Spinner color="success" size="md" />
                </div>
              </ModalBody>
            ) : (
              <ReviewForm
                key={existingReview?.id ?? 'new'}
                initialRating={existingReview?.rating ?? 0}
                initialComment={existingReview?.comment ?? ''}
                isEditing={isEditing}
                existingReviewId={existingReview?.id}
                sitterProfileId={sitterProfileId}
                onClose={onClose}
              />
            )}
          </ModalDialog>
        </ModalContainer>
      </ModalBackdrop>
    </Modal>
  );
}
