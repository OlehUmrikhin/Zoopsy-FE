import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

export function LogsPage() {
  const { getToken } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const limit = 20;
  const [page, setPage] = useState(1);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      const headers: Record<string, string> = {
        Accept: 'application/json',
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const params = new URLSearchParams();
      params.append('limit', limit.toString());
      params.append('page', page.toString());

      const res = await fetch(`${import.meta.env.VITE_PHP_ZOOPSY_URL}/logs?${params.toString()}`, {
        headers,
      });

      if (res.ok) {
        const responseData = await res.json();
        if (responseData.data && Array.isArray(responseData.data)) {
          setLogs(responseData.data);
          setTotalCount(responseData.meta?.total || responseData.total || 0);
        } else if (Array.isArray(responseData)) {
          setLogs(responseData);
          setTotalCount(responseData.length); // Fallback
        }
      } else {
        console.error('Failed to fetch logs', await res.text());
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, limit]);

  const totalPages = totalCount > 0 ? Math.ceil(totalCount / limit) : 1;

  return (
    <div className="flex flex-col gap-6 p-6 w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-plus-jakarta text-zoopsy-green-900">
          Логи системи (Мікросервіс)
        </h1>
      </div>

      {/* Table block */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Час
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Користувач / Token
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Евент
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Маршрут (Page)
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  IP
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  User Agent
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Деталі
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400 italic">
                    Завантаження логів...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400 italic">
                    Логів не знайдено за заданими критеріями.
                  </td>
                </tr>
              ) : (
                logs.map((log: any) => {
                  let parsedMeta: any = {};
                  try {
                    parsedMeta = log.data
                      ? typeof log.data === 'string'
                        ? JSON.parse(log.data)
                        : log.data
                      : log.meta || {};
                  } catch (e) {}

                  return (
                    <tr
                      key={log.id || log._id || Math.random().toString()}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.created_at ? new Date(log.created_at).toLocaleString('uk-UA') : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {log.user_id ? (
                          <span className="bg-gray-100 px-2 py-1 rounded text-gray-600 font-mono text-xs">
                            {log.user_id}
                          </span>
                        ) : (
                          <span className="text-xs italic text-gray-400">anonymous</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="font-semibold text-zoopsy-green-900">
                          {log.event_type || log.event || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{parsedMeta?.page || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{log.ip || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="min-w-[200px] text-xs whitespace-normal break-words">
                          {log.user_agent || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="min-w-[250px] text-xs whitespace-normal break-words">
                          {typeof log.data === 'string'
                            ? log.data
                            : JSON.stringify(log.data || log.meta || '-')}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination below table */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-auto px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Сторінка {page} з {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-2 border rounded text-gray-600 disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                <MdChevronLeft size={20} />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-2 border rounded text-gray-600 disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                <MdChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
