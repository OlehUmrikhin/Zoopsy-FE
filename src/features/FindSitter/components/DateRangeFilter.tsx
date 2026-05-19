import { useState, useRef } from 'react';
import { RangeCalendar, Calendar, TimeField, DateRangePicker, DatePicker } from '@heroui/react';
import {
  today,
  getLocalTimeZone,
  parseTime,
  parseAbsolute,
  CalendarDate,
  CalendarDateTime,
  toZoned,
} from '@internationalized/date';
import type { TimeValue } from 'react-aria-components';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import cn from 'classnames';
import { MdCalendarToday } from 'react-icons/md';

type DateRange = { start: CalendarDate; end: CalendarDate };

function timeFromString(value: string): TimeValue | null {
  try {
    return parseTime(value);
  } catch {
    return null;
  }
}

function timeToString(value: TimeValue): string {
  return `${String(value.hour).padStart(2, '0')}:${String(value.minute).padStart(2, '0')}`;
}

function calendarDateToJsDate(cd: CalendarDate): Date {
  return new Date(cd.year, cd.month - 1, cd.day);
}

function calendarDateTimeToISOString(cd: CalendarDate, time: string): string {
  const [hours, minutes] = time ? time.split(':').map(Number) : [0, 0];
  const calDt = new CalendarDateTime(cd.year, cd.month, cd.day, hours, minutes);
  return toZoned(calDt, 'Europe/Kyiv').toDate().toISOString();
}

function isoToKyivParts(iso: string): { date: CalendarDate; time: string } | null {
  try {
    const zdt = parseAbsolute(iso, 'Europe/Kyiv');
    return {
      date: new CalendarDate(zdt.year, zdt.month, zdt.day),
      time: `${String(zdt.hour).padStart(2, '0')}:${String(zdt.minute).padStart(2, '0')}`,
    };
  } catch {
    return null;
  }
}

type Props = {
  isBoarding: boolean;
  isDisabled?: boolean;
  startDate?: string;
  endDate?: string;
  triggerClassName?: string;
  onChange: (startDate: string | undefined, endDate: string | undefined) => void;
};

export function DateRangeFilter({
  isBoarding,
  isDisabled,
  startDate,
  endDate,
  triggerClassName,
  onChange,
}: Props) {
  const [dateRange, setDateRange] = useState<DateRange | null>(() => {
    const s = startDate ? isoToKyivParts(startDate) : null;
    const e = endDate ? isoToKyivParts(endDate) : null;
    return s ? { start: s.date, end: e?.date ?? s.date } : null;
  });
  const [startTime, setStartTime] = useState(() =>
    startDate ? (isoToKyivParts(startDate)?.time ?? '') : '',
  );
  const [endTime, setEndTime] = useState(() =>
    endDate ? (isoToKyivParts(endDate)?.time ?? '') : '',
  );
  const triggerRef = useRef<HTMLButtonElement>(null);

  function notifyChange(range: DateRange | null, sTime: string, eTime: string) {
    if (!range) {
      onChange(undefined, undefined);
      return;
    }
    onChange(
      calendarDateTimeToISOString(range.start, sTime),
      calendarDateTimeToISOString(range.end, eTime),
    );
  }

  function handleRangeChange(range: DateRange | null) {
    setDateRange(range);
    notifyChange(range, startTime, endTime);
  }

  function handleStartTime(val: TimeValue | null) {
    const s = val ? timeToString(val) : '';
    setStartTime(s);
    notifyChange(dateRange, s, endTime);
  }

  function handleEndTime(val: TimeValue | null) {
    const e = val ? timeToString(val) : '';
    setEndTime(e);
    notifyChange(dateRange, startTime, e);
  }

  const dateLabel = dateRange
    ? (() => {
        const start = format(calendarDateToJsDate(dateRange.start), 'd MMM', { locale: uk });
        if (!isBoarding) return start;
        const end = format(calendarDateToJsDate(dateRange.end), 'd MMM', { locale: uk });
        return `${start} – ${end}`;
      })()
    : isBoarding
      ? 'Виберіть дати'
      : 'Виберіть дату';

  const defaultTriggerClassName =
    'bg-zoopsy-mint rounded-xl h-10 px-3 w-full flex items-center justify-between gap-2 font-inter text-sm outline-none data-[hovered]:bg-zoopsy-mint/80 data-[pressed]:bg-zoopsy-mint/80';
  const resolvedTriggerClassName = cn(
    triggerClassName ?? defaultTriggerClassName,
    isDisabled && 'opacity-50 cursor-not-allowed',
  );

  const timeFieldsJSX = (
    <div className="flex items-center gap-2 mb-4">
      <span className="font-inter text-sm text-zoopsy-gray whitespace-nowrap">від</span>
      <TimeField
        aria-label="Час початку"
        value={timeFromString(startTime)}
        onChange={handleStartTime}
        className="flex-1 min-w-0"
      >
        <TimeField.Group className="bg-transparent min-h-0 h-auto border border-zoopsy-light-gray/60 rounded-lg px-2 py-1.5 shadow-none focus-within:border-zoopsy-green-500 w-full flex items-center justify-center">
          <TimeField.Input>
            {(segment) => (
              <TimeField.Segment
                segment={segment}
                className="font-inter text-sm text-zoopsy-dark-gray outline-none px-px focus:bg-zoopsy-green-100 rounded"
              />
            )}
          </TimeField.Input>
        </TimeField.Group>
      </TimeField>
      <span className="font-inter text-sm text-zoopsy-gray whitespace-nowrap">до</span>
      <TimeField
        aria-label="Час завершення"
        value={timeFromString(endTime)}
        onChange={handleEndTime}
        className="flex-1 min-w-0"
      >
        <TimeField.Group className="bg-transparent min-h-0 h-auto border border-zoopsy-light-gray/60 rounded-lg px-2 py-1.5 shadow-none focus-within:border-zoopsy-green-500 w-full flex items-center justify-center">
          <TimeField.Input>
            {(segment) => (
              <TimeField.Segment
                segment={segment}
                className="font-inter text-sm text-zoopsy-dark-gray outline-none px-px focus:bg-zoopsy-green-100 rounded"
              />
            )}
          </TimeField.Input>
        </TimeField.Group>
      </TimeField>
      <span className="font-inter text-xs text-zoopsy-gray whitespace-nowrap">(ГОД)</span>
    </div>
  );

  const calendarPopoverContent = isBoarding ? (
    <>
      {timeFieldsJSX}
      <div className="flex justify-center">
        <RangeCalendar aria-label="Trip dates">
          <RangeCalendar.Header>
            <RangeCalendar.Heading />
            <RangeCalendar.NavButton slot="previous" />
            <RangeCalendar.NavButton slot="next" />
          </RangeCalendar.Header>
          <RangeCalendar.Grid>
            <RangeCalendar.GridHeader>
              {(day) => <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>}
            </RangeCalendar.GridHeader>
            <RangeCalendar.GridBody>
              {(date) => <RangeCalendar.Cell date={date} />}
            </RangeCalendar.GridBody>
          </RangeCalendar.Grid>
        </RangeCalendar>
      </div>
    </>
  ) : (
    <>
      {timeFieldsJSX}
      <div className="flex justify-center">
        <Calendar aria-label="Service date">
          <Calendar.Header>
            <Calendar.Heading />
            <Calendar.NavButton slot="previous" />
            <Calendar.NavButton slot="next" />
          </Calendar.Header>
          <Calendar.Grid>
            <Calendar.GridHeader>
              {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
            </Calendar.GridHeader>
            <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
          </Calendar.Grid>
        </Calendar>
      </div>
    </>
  );

  if (isBoarding) {
    return (
      <DateRangePicker
        value={dateRange}
        onChange={(range) => {
          if (range) {
            handleRangeChange({
              start: range.start as CalendarDate,
              end: range.end as CalendarDate,
            });
          }
        }}
        minValue={today(getLocalTimeZone())}
        isDisabled={isDisabled}
      >
        <DateRangePicker.Trigger ref={triggerRef} className={resolvedTriggerClassName}>
          <span
            className={cn(
              'flex-1 text-left font-normal',
              dateRange ? 'text-zoopsy-dark-gray' : 'text-zoopsy-gray',
            )}
          >
            {dateLabel}
          </span>
          <DateRangePicker.TriggerIndicator>
            <MdCalendarToday className="text-zoopsy-gray text-sm flex-shrink-0" />
          </DateRangePicker.TriggerIndicator>
        </DateRangePicker.Trigger>
        <DateRangePicker.Popover
          triggerRef={triggerRef}
          placement="bottom end"
          className="bg-white rounded-2xl shadow-2xl border border-zoopsy-light-gray/30 p-4 z-50 w-[336px]"
        >
          {calendarPopoverContent}
        </DateRangePicker.Popover>
      </DateRangePicker>
    );
  }

  return (
    <DatePicker
      value={dateRange?.start ?? null}
      onChange={(date) => {
        if (date) {
          const cd = date as CalendarDate;
          handleRangeChange({ start: cd, end: cd });
        }
      }}
      minValue={today(getLocalTimeZone())}
      isDisabled={isDisabled}
    >
      <DatePicker.Trigger ref={triggerRef} className={resolvedTriggerClassName}>
        <span
          className={cn(
            'flex-1 text-left font-normal',
            dateRange ? 'text-zoopsy-dark-gray' : 'text-zoopsy-gray',
          )}
        >
          {dateLabel}
        </span>
        <DatePicker.TriggerIndicator>
          <MdCalendarToday className="text-zoopsy-gray text-sm flex-shrink-0" />
        </DatePicker.TriggerIndicator>
      </DatePicker.Trigger>
      <DatePicker.Popover
        triggerRef={triggerRef}
        placement="bottom end"
        className="bg-white rounded-2xl shadow-2xl border border-zoopsy-light-gray/30 p-4 z-50 w-[336px]"
      >
        {calendarPopoverContent}
      </DatePicker.Popover>
    </DatePicker>
  );
}
