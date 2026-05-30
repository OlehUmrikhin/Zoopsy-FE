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
} from '@heroui/react';
import { toast } from 'react-toastify';
import { useBalance, useWithdraw } from '@api/payments';

export function SitterBalanceCard() {
  const { data: balanceData } = useBalance();
  const { mutate: withdraw, isPending } = useWithdraw();
  const [isOpen, setIsOpen] = useState(false);
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  const balance = balanceData?.balance ?? 0;

  const handleWithdraw = () => {
    if (balance <= 0) {
      toast.error('Немає коштів для виведення.');
      return;
    }
    withdraw(
      {
        amount: balance,
        cardHolderName: cardHolderName.trim() || undefined,
        cardNumber: cardNumber.trim() || undefined,
      },
      {
        onSuccess: (data) => {
          toast.success(`Виведено ${data.withdrawn}₴. Новий баланс: ${data.balance}₴`);
          setIsOpen(false);
          setCardHolderName('');
          setCardNumber('');
        },
        onError: () => toast.error('Не вдалося вивести кошти. Спробуйте ще раз.'),
      },
    );
  };

  return (
    <>
      <div className="bg-zoopsy-green-500 rounded-2xl p-5 text-left flex-1">
        <p className="text-white/60 font-inter text-[10px] uppercase tracking-widest mb-2">
          Поточний баланс
        </p>
        <div className="text-white font-plus-jakarta font-bold text-4xl mb-4 leading-none">
          {balance} <span className="text-xl font-medium">грн</span>
        </div>
        <Button
          fullWidth
          onPress={() => setIsOpen(true)}
          className="bg-white/20 text-white font-inter font-medium rounded-xl hover:bg-white/30 h-10"
        >
          Вивести
        </Button>
      </div>

      <Modal isOpen={isOpen} onOpenChange={(open) => !open && setIsOpen(false)}>
        <ModalBackdrop>
          <ModalContainer size="sm">
            <ModalDialog>
              <ModalHeader className="font-plus-jakarta">Вивести кошти</ModalHeader>
              <ModalBody className="py-4 flex flex-col gap-3">
                <p className="font-inter text-sm text-zoopsy-gray">
                  {'Буде виведено всю суму: '}
                  <span className="font-bold text-zoopsy-dark-gray">{balance}₴</span>
                </p>
                <TextField
                  value={cardHolderName}
                  onChange={setCardHolderName}
                  className="font-inter flex flex-col gap-1"
                >
                  <Label className="text-sm text-zoopsy-gray">
                    Повне ім&apos;я власника картки
                  </Label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={cardHolderName}
                    onChange={(e) => setCardHolderName(e.target.value)}
                    className="border border-zoopsy-light-gray rounded-xl px-3 py-2 font-inter text-sm focus:outline-none focus:ring-2 focus:ring-zoopsy-green-500"
                  />
                </TextField>
                <TextField
                  value={cardNumber}
                  onChange={setCardNumber}
                  className="font-inter flex flex-col gap-1"
                >
                  <Label className="text-sm text-zoopsy-gray">Номер картки</Label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={19}
                    placeholder="4111 1111 1111 1111"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                    className="border border-zoopsy-light-gray rounded-xl px-3 py-2 font-inter text-sm focus:outline-none focus:ring-2 focus:ring-zoopsy-green-500"
                  />
                </TextField>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="ghost"
                  onPress={() => {
                    setIsOpen(false);
                    setCardHolderName('');
                    setCardNumber('');
                  }}
                  className="font-inter"
                >
                  Скасувати
                </Button>
                <Button
                  onPress={handleWithdraw}
                  isDisabled={isPending}
                  className="bg-zoopsy-green-900 text-white font-inter font-medium rounded-xl"
                >
                  {isPending ? 'Виводимо...' : 'Вивести'}
                </Button>
              </ModalFooter>
            </ModalDialog>
          </ModalContainer>
        </ModalBackdrop>
      </Modal>
    </>
  );
}
