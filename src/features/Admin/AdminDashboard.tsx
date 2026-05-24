import { useAdminDashboardStats } from '../../api/admin/queries';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MdErrorOutline } from 'react-icons/md';

// Форматування чисел та валюти
const formatNumber = (num?: number) => new Intl.NumberFormat('uk-UA').format(num || 0);
const formatCurrency = (num?: number) =>
  new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0,
  }).format(num || 0);

// Форматування дати для графіка (наприклад: "2023-10-20" -> "20 ЖОВ")
const formatDateTick = (tickItem: any): string => {
  if (!tickItem) return '';
  const date = new Date(tickItem);
  if (!isNaN(date.getTime())) {
    const months = [
      'СІЧ',
      'ЛЮТ',
      'БЕР',
      'КВІ',
      'ТРА',
      'ЧЕР',
      'ЛИП',
      'СЕР',
      'ВЕР',
      'ЖОВ',
      'ЛИС',
      'ГРУ',
    ];
    return `${date.getDate()} ${months[date.getMonth()]}`;
  }
  return String(tickItem);
};

export function AdminDashboard() {
  const { data, isLoading, isError } = useAdminDashboardStats();

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zoopsy-green-500 border-t-transparent"></div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-64 w-full items-center justify-center p-6">
        <div className="max-w-md rounded-3xl bg-red-50 p-8 text-center shadow-sm">
          <MdErrorOutline className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h2 className="mb-2 text-xl font-bold text-red-800">Помилка завантаження</h2>
          <p className="text-red-600">
            Не вдалося завантажити дані дашборда. Перевірте підключення до сервера або права
            доступу.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans text-gray-800">
      <div className="mb-8 mt-2">
        <h2 className="text-3xl font-bold text-gray-900">Панель управління</h2>
        <p className="mt-1 text-gray-500">
          Огляд ключових показників вашого сервісу за останній місяць.
        </p>
      </div>

      {/* Карточки метрик */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {/* Карточка 1: Користувачі */}
        <div className="flex flex-col justify-between rounded-3xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div>
            <div className="flex items-start justify-between">
              <h3 className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                ЗАГАЛОМ КОРИСТУВАЧІВ
              </h3>
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                +12%
              </span>
            </div>
            <p className="mt-2 text-3xl font-black text-gray-900">
              {formatNumber(data?.totalUsers)}
            </p>
          </div>
          <div className="mt-6 flex h-8 items-end gap-1">
            {[40, 50, 45, 60, 80, 100].map((h, i) => (
              <div
                key={i}
                className="w-1/6 rounded-t-sm bg-green-500 transition-all duration-300"
                style={{ height: `${h}%`, opacity: 0.3 + i * 0.14 }}
              ></div>
            ))}
          </div>
        </div>

        {/* Карточка 2: Дохід */}
        <div className="flex flex-col justify-between rounded-3xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div>
            <div className="flex items-start justify-between">
              <h3 className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                ДОХІД ЗА МІСЯЦЬ
              </h3>
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                +8.4%
              </span>
            </div>
            <p className="mt-2 text-3xl font-black text-gray-900">
              {formatCurrency(data?.monthlyRevenue)}
            </p>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="h-7 w-7 rounded-full border-2 border-white bg-green-200"></div>
              <div className="h-7 w-7 rounded-full border-2 border-white bg-green-300"></div>
              <div className="h-7 w-7 rounded-full border-2 border-white bg-green-400"></div>
            </div>
            <span className="text-sm font-medium text-gray-500">
              +{data?.newTransactions || 0} нових транзакцій
            </span>
          </div>
        </div>

        {/* Карточка 3: Послуги */}
        <div className="flex flex-col justify-between rounded-3xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div>
            <div className="flex items-start justify-between">
              <h3 className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                АКТИВНІ ПОСЛУГИ
              </h3>
              <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-bold text-blue-600">
                В процесі
              </span>
            </div>
            <p className="mt-2 text-3xl font-black text-gray-900">
              {formatNumber(data?.activeServices)}
            </p>
          </div>
          <div className="mt-6">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-green-500"
                style={{ width: `${data?.activeSitterShare || 0}%` }}
              ></div>
            </div>
            <p className="mt-2 text-xs font-medium text-gray-500">
              {data?.activeSitterShare || 0}% завантаженості сіттерів
            </p>
          </div>
        </div>

        {/* Карточка 4: Скарги */}
        <div className="flex flex-col justify-between rounded-3xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div>
            <div className="flex items-start justify-between">
              <h3 className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                ВІДКРИТІ СКАРГИ
              </h3>
              <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-bold text-red-600">
                -5
              </span>
            </div>
            <p className="mt-2 text-3xl font-black text-gray-900">{data?.openComplaints || 0}</p>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <button className="text-sm font-semibold text-gray-400 transition-colors hover:text-green-600">
              Переглянути всі &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Графік зростання користувачів */}
      <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900">Ріст користувачів</h2>
          <p className="text-sm text-gray-500">Динаміка реєстрацій за останні 30 днів</p>
        </div>

        <div className="h-[340px] w-full">
          {data?.userGrowth && data.userGrowth.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.userGrowth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUserGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis
                  dataKey="day"
                  tickFormatter={(tick: any) => formatDateTick(tick)}
                  tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 500 }}
                  tickLine={false}
                  axisLine={false}
                  dy={15}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 500 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  labelFormatter={(label: any) => formatDateTick(label)}
                  contentStyle={{
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    padding: '12px 16px',
                    fontWeight: 600,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  name="Нові реєстрації"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorUserGrowth)"
                  activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-400">
              Немає даних для відображення графіка
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
