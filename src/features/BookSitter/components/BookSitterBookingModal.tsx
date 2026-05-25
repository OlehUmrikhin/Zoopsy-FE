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
} from '@heroui/react';
import { useCreateBooking } from '@api/booking/mutations';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'react-toastify';
import { SERVICE_TYPE_LABELS } from '@constants/serviceTypes';

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-inter text-xs font-semibold text-zoopsy-gray uppercase tracking-wide">
        {label}
      </span>
      <span className="font-inter font-semibold text-base text-zoopsy-dark-gray">{value}</span>
    </div>
  );
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  sitterId: string;
  serviceType: number | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
  petId: string | undefined;
  petName: string | undefined;
  dateDisplay: string;
  totalPrice: number | null;
  isBoarding: boolean;
};

export function BookSitterBookingModal({
  isOpen,
  onClose,
  sitterId,
  serviceType,
  startDate,
  endDate,
  petId,
  petName,
  dateDisplay,
  totalPrice,
  isBoarding,
}: Props) {
  const { mutateAsync: createBooking, isPending } = useCreateBooking();
  const [comment, setComment] = useState('');
  const navigate = useNavigate();

  const handleConfirm = async () => {
    if (!startDate || !petId || serviceType === undefined) return;

    try {
      await createBooking({
        sitterProfileId: sitterId,
        petId,
        serviceType,
        startDate,
        endDate: endDate || startDate,
        ownerComment: comment.trim() || undefined,
      });
      toast.success('Бронювання успішно створено!');
      onClose();
      navigate({ to: '/bookings' });
    } catch {
      toast.error('Не вдалося створити бронювання. Спробуйте ще раз.');
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalBackdrop>
        <ModalContainer size="md">
          <ModalDialog>
            <ModalHeader className="flex flex-col gap-1 font-plus-jakarta pb-0">
              Підтвердження бронювання
            </ModalHeader>
            <ModalBody className="py-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3 p-4 bg-zoopsy-mint rounded-xl">
                  <InfoRow
                    label="Послуга"
                    value={
                      serviceType !== undefined
                        ? (SERVICE_TYPE_LABELS[serviceType] ?? `Послуга ${serviceType}`)
                        : '—'
                    }
                  />
                  <InfoRow label={isBoarding ? 'Дати' : 'Дата'} value={dateDisplay} />
                  {petName && <InfoRow label="Тварина" value={petName} />}
                  {totalPrice !== null && <InfoRow label="Вартість" value={`${totalPrice}₴`} />}
                </div>

                <TextField
                  value={comment}
                  onChange={setComment}
                  className="font-inter flex flex-col gap-1"
                >
                  <Label className="text-xs font-semibold !text-zoopsy-dark-gray">
                    Коментар до бронювання
                  </Label>
                  <TextArea
                    placeholder="Напишіть щось важливе сіттеру (необов'язково)"
                    className="border border-zoopsy-light-gray/40 rounded-xl px-3 py-2 text-zoopsy-dark-gray placeholder:text-zoopsy-gray/60 focus:outline-none focus:border-zoopsy-green-900 hover:border-zoopsy-gray/60 resize-none min-h-[80px]"
                  />
                </TextField>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                className="font-plus-jakarta font-bold rounded-xl"
                variant="danger-soft"
                onPress={onClose}
                isDisabled={isPending}
              >
                Скасувати
              </Button>
              <Button
                className="bg-zoopsy-green-900 text-white font-plus-jakarta font-bold rounded-xl"
                onPress={handleConfirm}
                isDisabled={isPending}
              >
                {isPending ? 'Завантаження...' : 'Підтвердити'}
              </Button>
            </ModalFooter>
          </ModalDialog>
        </ModalContainer>
      </ModalBackdrop>
    </Modal>
  );
}
