import type { BookingStatus } from '@api/booking';
import { BOOKING_STATUS_COLORS, BOOKING_STATUS_LABELS } from '@constants/bookingStatuses';
import { SERVICE_TYPE_LABELS } from '@constants/serviceTypes';
import { formatDate } from '@utils';

type Props = {
  serviceType: number;
  startDate: string;
  endDate: string;
  status: BookingStatus;
};

export function BookingCardHeader({ serviceType, startDate, endDate, status }: Props) {
  const isSameDay = startDate.slice(0, 10) === endDate.slice(0, 10);
  const dateDisplay = isSameDay
    ? formatDate(startDate)
    : `${formatDate(startDate)} — ${formatDate(endDate)}`;

  const statusColor = BOOKING_STATUS_COLORS[status] ?? 'bg-gray-100 text-gray-600';

  return (
    <div className="flex items-start justify-between gap-2">
      <div className="flex flex-col gap-0.5">
        <span className="font-plus-jakarta font-bold text-zoopsy-dark-gray text-base">
          {SERVICE_TYPE_LABELS[serviceType] ?? `Послуга ${serviceType}`}
        </span>
        <span className="font-inter text-xs text-zoopsy-gray">{dateDisplay}</span>
      </div>
      <span
        className={`text-xs font-semibold font-inter px-2.5 py-1 rounded-full whitespace-nowrap ${statusColor}`}
      >
        {BOOKING_STATUS_LABELS[status]}
      </span>
    </div>
  );
}
