import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deductBalance, getBalance, withdraw } from './fetchers';

export const paymentQueryKeys = {
  balance: () => ['payments', 'balance'] as const,
};

export function useBalance() {
  return useQuery({
    queryKey: paymentQueryKeys.balance(),
    queryFn: getBalance,
  });
}

export function useDeductBalance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ amount, bookingId }: { amount: number; bookingId: string }) =>
      deductBalance(amount, bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentQueryKeys.balance() });
    },
  });
}

export function useWithdraw() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      amount,
      cardHolderName,
      cardNumber,
    }: {
      amount: number;
      cardHolderName?: string;
      cardNumber?: string;
    }) => withdraw(amount, cardHolderName, cardNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentQueryKeys.balance() });
    },
  });
}
