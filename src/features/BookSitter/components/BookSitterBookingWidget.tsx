import { Button } from '@heroui/react';
import { format, parseISO } from 'date-fns';
import { uk } from 'date-fns/locale';
import { toast } from 'react-toastify';
import { useNavigate } from '@tanstack/react-router';
import type { SitterService } from '@api/sitter/types';
import { useBookingFiltersStore } from '@stores';
import { useOwnerProfile } from '@api/owner/queries';
import { useBalance, useDeductBalance } from '@api/payments';
import { useCreateBooking } from '@api/booking/mutations';
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

function formatDate(iso: string) {
  return format(parseISO(iso), 'd MMM HH:mm', { locale: uk });
}

type Props = {
  sitterId: string;
  services: SitterService[];
};

export function BookSitterBookingWidget({ sitterId, services }: Props) {
  const { serviceType, startDate, endDate, petId } = useBookingFiltersStore();
  const { data: ownerProfile } = useOwnerProfile();
  const { data: balanceData } = useBalance();
  const { mutateAsync: createBooking, isPending: isBooking } = useCreateBooking();
  const { mutateAsync: deductBalance, isPending: isDeducting } = useDeductBalance();
  const navigate = useNavigate();

  if (services.length === 0) return null;

  const isBoarding = serviceType === 0;
  const effectiveService = services.find((s) => s.serviceType === serviceType) ?? services[0];
  const pet = ownerProfile?.pets.find((p) => p.id === petId);

  const totalHours =
    startDate && endDate
      ? Math.max(
          0,
          Math.round(
            (parseISO(endDate).getTime() - parseISO(startDate).getTime()) / (1000 * 60 * 60),
          ),
        )
      : null;

  const totalPrice =
    totalHours && effectiveService ? totalHours * effectiveService.pricePerUnit : null;

  const dateDisplay = startDate
    ? isBoarding && endDate
      ? `${formatDate(startDate)} – ${formatDate(endDate)}`
      : formatDate(startDate)
    : '—';

  const isBookingReady = !!(petId && startDate && (isBoarding ? endDate : true));

  async function handleBookingPress() {
    if (totalPrice !== null && (balanceData?.balance ?? 0) < totalPrice) {
      toast.error('Недостатньо коштів на балансі. Поповніть баланс і спробуйте ще раз.');
      return;
    }

    if (!startDate || !petId || serviceType === undefined) return;

    try {
      const booking = await createBooking({
        sitterProfileId: sitterId,
        petId,
        serviceType,
        startDate,
        endDate: endDate || startDate,
      });

      if (totalPrice) {
        await deductBalance({ amount: totalPrice, bookingId: booking.id });
      }

      toast.success('Бронювання успішно створено та оплачено!');
      navigate({ to: '/bookings' });
    } catch {
      toast.error('Не вдалося створити бронювання. Спробуйте ще раз.');
    }
  }

  const isLoading = isBooking || isDeducting;

  return (
    <>
      <div className="w-80 flex-shrink-0 bg-white rounded-2xl p-6 flex flex-col gap-4 sticky top-24">
        {effectiveService && (
          <div className="flex items-baseline gap-1">
            <span className="font-plus-jakarta font-bold text-zoopsy-dark-gray text-3xl">
              {effectiveService.pricePerUnit}₴
            </span>
            <span className="font-inter text-zoopsy-gray text-sm">/ година</span>
          </div>
        )}

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
          {pet && <InfoRow label="Тварина" value={pet.name} />}
        </div>

        <Button
          onPress={handleBookingPress}
          isDisabled={!isBookingReady || isLoading}
          className="w-full h-11 rounded-xl bg-zoopsy-green-900 text-white font-plus-jakarta font-bold transition-colors hover:bg-zoopsy-green-700"
        >
          {isBookingReady ? 'Забронювати' : 'Оберіть деталі'}
        </Button>

        {totalPrice !== null && effectiveService && (
          <div className="border-t border-zoopsy-light-gray/40 pt-4 flex flex-col gap-2">
            <div className="flex justify-between font-inter text-sm text-zoopsy-gray">
              <span>
                {effectiveService.pricePerUnit}×{totalHours} год
              </span>
              <span>{totalPrice}₴</span>
            </div>
            <div className="flex justify-between font-plus-jakarta font-bold text-zoopsy-dark-gray text-base">
              <span>Разом</span>
              <span>{totalPrice}₴</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
