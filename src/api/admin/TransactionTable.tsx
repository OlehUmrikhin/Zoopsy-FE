import React from 'react';
import classNames from 'classnames';
import type { Transaction } from '@api/admin/finance';
import { formatCurrency, formatDate } from './utils';

interface Props {
  transactions?: Transaction[];
  totalCount?: number;
  isLoading?: boolean;
}

const statusConfig = {
  success: { color: 'bg-green-500', text: 'Успішно' },
  pending: { color: 'bg-yellow-500', text: 'Очікується' },
  error: { color: 'bg-red-500', text: 'Помилка' },
};

export const TransactionTable: React.FC<Props> = ({ transactions, totalCount, isLoading }) => {
  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-bold font-plus-jakarta text-zoopsy-dark-gray">Останні транзакції</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zoopsy-bg/50">
              <th className="px-6 py-4 text-xs font-semibold text-zoopsy-gray uppercase tracking-wider font-inter">Користувач</th>
              <th className="px-6 py-4 text-xs font-semibold text-zoopsy-gray uppercase tracking-wider font-inter">Тип</th>
              <th className="px-6 py-4 text-xs font-semibold text-zoopsy-gray uppercase tracking-wider font-inter">Сума</th>
              <th className="px-6 py-4 text-xs font-semibold text-zoopsy-gray uppercase tracking-wider font-inter">Дата</th>
              <th className="px-6 py-4 text-xs font-semibold text-zoopsy-gray uppercase tracking-wider font-inter">Статус</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-200"></div>
                    <div className="w-24 h-4 bg-gray-200 rounded"></div>
                  </td>
                  <td className="px-6 py-4"><div className="w-20 h-6 bg-gray-200 rounded-full"></div></td>
                  <td className="px-6 py-4"><div className="w-16 h-4 bg-gray-200 rounded"></div></td>
                  <td className="px-6 py-4"><div className="w-24 h-4 bg-gray-200 rounded"></div></td>
                  <td className="px-6 py-4"><div className="w-20 h-4 bg-gray-200 rounded"></div></td>
                </tr>
              ))
            ) : transactions?.length ? (
              transactions.map((t) => (
                <tr key={t.id} className="hover:bg-zoopsy-bg transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {t.user.avatarUrl ? (
                        <img src={t.user.avatarUrl} alt={t.user.name} className="w-10 h-10 rounded-xl object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-zoopsy-mint text-zoopsy-green-700 flex items-center justify-center font-bold text-sm">
                          {t.user.initials}
                        </div>
                      )}
                      <span className="font-medium text-zoopsy-dark-gray font-inter">{t.user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 text-zoopsy-gray text-xs font-medium rounded-lg font-inter">
                      {t.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={classNames('font-bold font-plus-jakarta', t.amount > 0 ? 'text-green-600' : 'text-red-500')}>
                      {t.amount > 0 ? '+' : ''}{formatCurrency(t.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-zoopsy-gray font-inter">
                    {formatDate(t.date)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={classNames('w-2 h-2 rounded-full', statusConfig[t.status].color)}></div>
                      <span className="text-sm text-zoopsy-dark-gray font-inter">{statusConfig[t.status].text}</span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-zoopsy-gray font-inter">Транзакцій не знайдено</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-gray-100 bg-zoopsy-bg/30 text-sm text-zoopsy-gray text-center font-inter">
        {totalCount !== undefined ? `Показано ${transactions?.length || 0} з ${totalCount}` : '—'}
      </div>
    </div>
  );
};