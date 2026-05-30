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
  Input,
} from '@heroui/react';
import { Elements } from '@stripe/react-stripe-js';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import { createTopUpIntent } from '@api/payments';
import { useStripeInit } from '../../../providers/StripeProvider';

function TopUpPaymentForm({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (msg: string) => void;
}) {
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
        return_url: `${window.location.origin}/profile`,
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
        isLoading={isLoading}
        className="w-full h-11 rounded-xl bg-zoopsy-green-900 text-white font-plus-jakarta font-bold"
      >
        Оплатити
      </Button>
    </form>
  );
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function OwnerTopUpModal({ isOpen, onClose }: Props) {
  const [amount, setAmount] = useState('500');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const stripePromise = useStripeInit(isOpen);

  const handleProceed = async () => {
    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      toast.error('Введіть коректну суму.');
      return;
    }
    setIsCreating(true);
    try {
      const { clientSecret: secret } = await createTopUpIntent(parsedAmount);
      setClientSecret(secret);
    } catch {
      toast.error('Не вдалося ініціювати оплату. Спробуйте ще раз.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleSuccess = () => {
    toast.success('Баланс успішно поповнено!');
    handleClose();
  };

  const handleError = (msg: string) => {
    toast.error(msg);
  };

  const handleClose = () => {
    setClientSecret(null);
    setAmount('500');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <ModalBackdrop>
        <ModalContainer size="md">
          <ModalDialog>
            <ModalHeader className="font-plus-jakarta pb-0">
              {clientSecret ? 'Введіть дані картки' : 'Поповнення балансу'}
            </ModalHeader>
            <ModalBody className="py-6">
              {!clientSecret ? (
                <TextField
                  value={amount}
                  onChange={setAmount}
                  className="font-inter flex flex-col gap-1"
                >
                  <Label className="text-xs font-semibold !text-zoopsy-dark-gray">
                    Сума поповнення (₴)
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    placeholder="500"
                    className="border border-zoopsy-light-gray/40 rounded-xl px-3 py-2 text-zoopsy-dark-gray focus:outline-none focus:border-zoopsy-green-900 hover:border-zoopsy-gray/60"
                  />
                </TextField>
              ) : (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <TopUpPaymentForm onSuccess={handleSuccess} onError={handleError} />
                </Elements>
              )}
            </ModalBody>
            {!clientSecret && (
              <ModalFooter>
                <Button
                  variant="danger-soft"
                  className="font-plus-jakarta font-bold rounded-xl"
                  onPress={handleClose}
                >
                  Скасувати
                </Button>
                <Button
                  className="bg-zoopsy-green-900 text-white font-plus-jakarta font-bold rounded-xl"
                  onPress={handleProceed}
                  isLoading={isCreating}
                  isDisabled={isCreating}
                >
                  Далі
                </Button>
              </ModalFooter>
            )}
          </ModalDialog>
        </ModalContainer>
      </ModalBackdrop>
    </Modal>
  );
}
