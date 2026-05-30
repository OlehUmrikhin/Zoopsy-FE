import { axiosInstance } from '../../lib/axios';
import { PAYMENT_PATHS } from './paths';

export async function getStripeConfig(): Promise<{ publishableKey: string }> {
  const { data } = await axiosInstance.get(PAYMENT_PATHS.config);
  return data;
}

export async function startStripeConnect(
  returnUrl: string,
  refreshUrl: string,
): Promise<{ onboardingUrl: string; isNewAccount: boolean }> {
  const { data } = await axiosInstance.post(PAYMENT_PATHS.stripeConnect, {
    returnUrl,
    refreshUrl,
  });
  return data;
}

export async function createTopUpIntent(amount: number): Promise<{ clientSecret: string }> {
  const { data } = await axiosInstance.post(PAYMENT_PATHS.topUp, { amount });
  return data;
}

export async function getBalance(): Promise<{ balance: number }> {
  const { data } = await axiosInstance.get(PAYMENT_PATHS.balance);
  return data;
}

export async function deductBalance(
  amount: number,
  bookingId: string,
): Promise<{ balance: number }> {
  const { data } = await axiosInstance.patch(PAYMENT_PATHS.deduct, { amount, bookingId });
  return data;
}

export async function withdraw(
  amount: number,
  cardHolderName?: string,
  cardNumber?: string,
): Promise<{ balance: number; withdrawn: number }> {
  const { data } = await axiosInstance.post(PAYMENT_PATHS.withdraw, {
    amount,
    ...(cardHolderName && { cardHolderName }),
    ...(cardNumber && { cardNumber }),
  });
  return data;
}
