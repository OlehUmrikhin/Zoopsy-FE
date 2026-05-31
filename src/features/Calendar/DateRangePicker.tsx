import { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  isAfter,
  isBefore,
} from 'date-fns';
import { uk } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (start: Date, end: Date) => void;
  onConfirm: () => void;
};

export function DateRangePicker({ startDate, endDate, onChange, onConfirm }: Props) {
  const [viewDate, setViewDate] = useState(startDate ?? new Date());
  const [hovered, setHovered] = useState<Date | null>(null);
  const [selecting, setSelecting] = useState<'start' | 'end'>(
    startDate && endDate ? 'start' : startDate ? 'end' : 'start',
  );

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  let day = calStart;
  while (!isAfter(day, calEnd)) {
    days.push(day);
    day = addDays(day, 1);
  }

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

  function handleDayClick(d: Date) {
    if (selecting === 'start') {
      onChange(d, d);
      setSelecting('end');
    } else {
      if (startDate && isBefore(d, startDate)) {
        onChange(d, startDate);
      } else {
        onChange(startDate!, d);
      }
      setSelecting('start');
    }
  }

  function isInRange(d: Date) {
    if (!startDate) return false;
    const rangeEnd = selecting === 'end' && hovered ? hovered : endDate;
    if (!rangeEnd) return false;
    const [from, to] = isBefore(startDate, rangeEnd) ? [startDate, rangeEnd] : [rangeEnd, startDate];
    return isWithinInterval(d, { start: from, end: to });
  }

  function isStart(d: Date) {
    return startDate ? isSameDay(d, startDate) : false;
  }

  function isEnd(d: Date) {
    const eff = selecting === 'end' && hovered ? hovered : endDate;
    return eff ? isSameDay(d, eff) : false;
  }

  const hasRange = startDate && endDate;
  const isSingleDay = hasRange && isSameDay(startDate, endDate);
  const confirmed = hasRange && selecting === 'start';

  return (
    <div className="select-none">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => setViewDate((d) => subMonths(d, 1))}
          className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 transition"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-semibold text-zoopsy-dark-gray capitalize">
          {format(viewDate, 'LLLL yyyy', { locale: uk })}
        </span>
        <button
          type="button"
          onClick={() => setViewDate((d) => addMonths(d, 1))}
          className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 transition"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {weekDays.map((wd) => (
          <div key={wd} className="text-center text-xs text-gray-400 font-medium py-1">
            {wd}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {days.map((d, i) => {
          const inRange = isInRange(d);
          const isS = isStart(d);
          const isE = isEnd(d);
          const isToday = isSameDay(d, new Date());
          const otherMonth = !isSameMonth(d, viewDate);

          return (
            <button
              key={i}
              type="button"
              onClick={() => handleDayClick(d)}
              onMouseEnter={() => selecting === 'end' && setHovered(d)}
              onMouseLeave={() => setHovered(null)}
              className={[
                'relative h-8 text-sm transition flex items-center justify-center',
                otherMonth ? 'text-gray-300' : 'text-gray-700',
                inRange && !isS && !isE ? 'bg-emerald-50' : '',
                isS || isE
                  ? 'bg-zoopsy-green text-white font-semibold rounded-full z-10'
                  : 'hover:bg-gray-100 rounded-full',
                isToday && !isS && !isE ? 'font-bold text-zoopsy-green' : '',
              ].join(' ')}
            >
              {format(d, 'd')}
            </button>
          );
        })}
      </div>

      {/* Selected range label */}
      {hasRange && (
        <div className="mt-3 text-xs text-center text-gray-500">
          {isSingleDay
            ? format(startDate, 'd MMMM yyyy', { locale: uk })
            : `${format(startDate, 'd MMM', { locale: uk })} — ${format(endDate, 'd MMM yyyy', { locale: uk })}`}
        </div>
      )}

      {/* Confirm button */}
      <button
        type="button"
        onClick={onConfirm}
        disabled={!confirmed}
        className="mt-3 w-full py-2 rounded-xl bg-zoopsy-green text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-40"
      >
        {selecting === 'end' ? 'Оберіть кінцеву дату' : 'Підтвердити'}
      </button>
    </div>
  );
}
