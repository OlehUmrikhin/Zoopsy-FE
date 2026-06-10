import { MdAccessTime } from 'react-icons/md';
import { useCurrentBooking } from '@api/booking';
import { format, parseISO } from 'date-fns';
import { uk } from 'date-fns/locale';
import { SERVICE_TYPE_LABELS } from '@constants/serviceTypes';

export function OwnerCurrentBooking() {
  const { data: booking, isLoading } = useCurrentBooking();

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-5 text-left flex flex-col gap-4 animate-pulse">
        <p className="text-[10px] uppercase tracking-widest text-zoopsy-gray font-inter font-semibold">
          Поточне бронювання
        </p>
        <div className="h-20 bg-zoopsy-bg rounded-xl" />
        <div className="h-24 bg-zoopsy-bg rounded-xl" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="bg-white rounded-2xl p-5 text-left flex flex-col gap-4">
        <p className="text-[10px] uppercase tracking-widest text-zoopsy-gray font-inter font-semibold">
          Поточне бронювання
        </p>
        <p className="font-inter text-sm text-zoopsy-gray">Немає активних бронювань.</p>
      </div>
    );
  }

  const startFmt = format(parseISO(booking.startDate), 'd.MM', { locale: uk });
  const endFmt = format(parseISO(booking.endDate), 'd.MM', { locale: uk });
  const dateLabel = `${startFmt} – ${endFmt} (${booking.durationDays} діб)`;

  const details = [
    {
      label: 'Послуга:',
      value: SERVICE_TYPE_LABELS[Number(booking.serviceType)] ?? booking.serviceType,
    },
    { label: 'Термін:', value: dateLabel },
    { label: 'Ціна:', value: `${booking.cost} грн` },
    { label: 'Пет-сіттер:', value: booking.contactName },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 text-left flex flex-col gap-4">
      <p className="text-[10px] uppercase tracking-widest text-zoopsy-gray font-inter font-semibold">
        Поточне бронювання
      </p>

      {/* Pet card */}
      <div className="bg-zoopsy-bg rounded-xl p-3 flex items-center gap-3">
        <div className="w-14 h-14 rounded-xl bg-zoopsy-mint flex-shrink-0 overflow-hidden">
          {booking.petPhotoUrl ? (
            <img
              src={booking.petPhotoUrl}
              alt={booking.petName}
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src="https://placedog.net/200/200"
              alt={booking.petName}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div>
          <p className="font-plus-jakarta font-bold text-zoopsy-dark-gray text-base leading-tight">
            {booking.petName}
          </p>
          <p className="text-zoopsy-gray font-inter text-xs mt-0.5">{booking.petWeight} КГ</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            <span className="text-green-600 font-inter text-[10px] font-semibold uppercase tracking-wide">
              Активне
            </span>
          </div>
        </div>
      </div>

      {/* Service details */}
      <div className="flex flex-col gap-2">
        {details.map(({ label, value }) => (
          <div key={label} className="flex justify-between items-center">
            <span className="text-zoopsy-gray font-inter text-sm">{label}</span>
            <span className="text-zoopsy-dark-gray font-inter text-sm font-medium">{value}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center pt-3 border-t border-zoopsy-light-gray/60">
        <div className="flex items-center gap-2 text-zoopsy-gray">
          <MdAccessTime className="text-base flex-shrink-0" />
          <span className="text-xs font-inter">Очікування фотозвіту від сіттера</span>
        </div>
      </div>
    </div>
  );
}
