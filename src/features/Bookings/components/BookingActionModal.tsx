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

export type BookingActionType = 'approve' | 'cancel' | 'complete' | 'cancelByOwner';

type Props = {
  isOpen: boolean;
  action: BookingActionType;
  onConfirm: (comment?: string) => void;
  onClose: () => void;
  isPending?: boolean;
};

const ACTION_CONFIG = {
  approve: {
    title: 'Підтвердити бронювання',
    confirmLabel: 'Прийняти',
    commentLabel: 'Коментар для власника',
    placeholder: "Напишіть щось власнику (необов'язково)",
    color: 'bg-zoopsy-green-900 text-white',
  },
  cancel: {
    title: 'Відхилити бронювання',
    confirmLabel: 'Відхилити',
    commentLabel: 'Коментар для власника',
    placeholder: "Напишіть причину відмови (необов'язково)",
    color: 'bg-red-500 text-white',
  },
  complete: {
    title: 'Завершити бронювання',
    confirmLabel: 'Завершити',
    commentLabel: 'Коментар для власника',
    placeholder: "Залиште відгук (необов'язково)",
    color: 'bg-zoopsy-green-900 text-white',
  },
  cancelByOwner: {
    title: 'Скасувати бронювання',
    confirmLabel: 'Скасувати',
    commentLabel: 'Коментар для сіттера',
    placeholder: "Вкажіть причину скасування (необов'язково)",
    color: 'bg-red-500 text-white',
  },
} as const;

export function BookingActionModal({ isOpen, action, onConfirm, onClose, isPending }: Props) {
  const [comment, setComment] = useState('');
  const config = ACTION_CONFIG[action];

  const handleConfirm = () => {
    onConfirm(comment.trim() || undefined);
  };

  const handleClose = () => {
    setComment('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <ModalBackdrop>
        <ModalContainer size="sm">
          <ModalDialog>
            <ModalHeader className="font-plus-jakarta">{config.title}</ModalHeader>
            <ModalBody className="py-4">
              <TextField
                value={comment}
                onChange={setComment}
                className="font-inter flex flex-col gap-1"
              >
                <Label className="text-xs font-semibold !text-zoopsy-dark-gray">
                  {config.commentLabel}
                </Label>
                <TextArea
                  placeholder={config.placeholder}
                  className="border border-zoopsy-light-gray/40 rounded-xl px-3 py-2 text-zoopsy-dark-gray placeholder:text-zoopsy-gray/60 focus:outline-none focus:border-zoopsy-green-900 hover:border-zoopsy-gray/60 resize-none min-h-[80px]"
                />
              </TextField>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="ghost"
                className="font-plus-jakarta font-bold rounded-xl"
                onPress={handleClose}
                isDisabled={isPending}
              >
                Назад
              </Button>
              <Button
                className={`font-plus-jakarta font-bold rounded-xl ${config.color}`}
                onPress={handleConfirm}
                isPending={isPending}
                isDisabled={isPending}
              >
                {config.confirmLabel}
              </Button>
            </ModalFooter>
          </ModalDialog>
        </ModalContainer>
      </ModalBackdrop>
    </Modal>
  );
}
