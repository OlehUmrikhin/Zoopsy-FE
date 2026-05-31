import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Info } from 'lucide-react';
import { toast } from 'react-toastify';
import { calendarStatusQuery, getCalendarConnectUrl, useDisconnectCalendar } from '@api/calendar';

const BENEFITS = [
  'Нотатки з\'являються у Google Calendar на всіх пристроях',
  'Нагадування на телефон у потрібний час',
  'Можна ділитися розкладом догляду з родиною',
];

export function GoogleCalendarCard() {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const { data: status, isLoading } = useQuery(calendarStatusQuery);
  const { mutate: disconnect, isPending: isDisconnecting } = useDisconnectCalendar();

  async function handleConnect() {
    try {
      const url = await getCalendarConnectUrl();
      window.location.href = url;
    } catch {
      toast.error('Не вдалося отримати посилання для підключення.');
    }
  }

  function handleDisconnect() {
    disconnect(undefined, {
      onSuccess: () => toast.success('Google Calendar відключено.'),
      onError: () => toast.error('Не вдалося відключити.'),
    });
  }

  if (isLoading) return null;

  return (
    <div className="bg-white rounded-2xl p-5 flex flex-col gap-4 border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="https://www.gstatic.com/images/branding/product/1x/calendar_2020q4_48dp.png"
            alt="Google Calendar"
            className="w-6 h-6"
          />
          <span className="font-plus-jakarta font-semibold text-sm text-zoopsy-dark-gray">
            Google Calendar
          </span>
        </div>

        {/* Info tooltip */}
        <div
          className="relative"
          onMouseEnter={() => setTooltipVisible(true)}
          onMouseLeave={() => setTooltipVisible(false)}
        >
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 transition"
            aria-label="Що це дає?"
          >
            <Info size={16} />
          </button>

          {tooltipVisible && (
            <div className="absolute right-0 top-6 z-50 w-60 bg-zoopsy-dark-gray text-white text-xs rounded-xl p-3 shadow-lg">
              <p className="font-semibold mb-2">Навіщо підключати?</p>
              <ul className="flex flex-col gap-1.5">
                {BENEFITS.map((b) => (
                  <li key={b} className="flex gap-1.5 items-start">
                    <span className="text-emerald-400 mt-px">✓</span>
                    <span className="text-white/80">{b}</span>
                  </li>
                ))}
              </ul>
              {/* Arrow */}
              <div className="absolute -top-1.5 right-2 w-3 h-3 bg-zoopsy-dark-gray rotate-45 rounded-sm" />
            </div>
          )}
        </div>
      </div>

      {/* Status + action */}
      {status?.connected ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
            <span className="font-medium">Підключено</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Нотатки з календаря синхронізуються з вашим Google Calendar автоматично.
          </p>
          <button
            onClick={handleDisconnect}
            disabled={isDisconnecting}
            className="text-sm text-red-500 border border-red-200 rounded-xl py-2 hover:bg-red-50 transition disabled:opacity-50 font-medium"
          >
            {isDisconnecting ? 'Відключення...' : 'Відключити'}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-gray-500 leading-relaxed">
            Підключіть Google Calendar, щоб нотатки про догляд з'являлись у вашому особистому календарі.
          </p>
          <button
            onClick={handleConnect}
            className="flex items-center justify-center gap-2 text-sm font-medium border border-gray-200 rounded-xl py-2.5 hover:bg-gray-50 shadow-sm transition text-zoopsy-dark-gray"
          >
            <img
              src="https://www.gstatic.com/images/branding/product/1x/calendar_2020q4_48dp.png"
              alt=""
              className="w-4 h-4"
            />
            Підключити
          </button>
        </div>
      )}
    </div>
  );
}
