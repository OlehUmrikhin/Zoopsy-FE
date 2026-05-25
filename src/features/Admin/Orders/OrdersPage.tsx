import { useState } from 'react';
import { LuSearch, LuEye, LuChevronLeft, LuChevronRight, LuCheck, LuX } from 'react-icons/lu';
import { MdOutlinePets, MdDirectionsWalk, MdHome, MdPets, MdWarning } from 'react-icons/md';
import classNames from 'classnames';
import { useDebounce } from '@uidotdev/usehooks';
import { toast } from 'react-toastify';
import { useAdminOrders, useUpdateAdminOrderStatusMutation } from '../../../api/admin';
import type { AdminOrder, OrderStatus, UserSnippet } from '../../../api/admin/types';

const TABS = [
  { key: 'ALL', label: 'Усі' },
  { key: 'ACTIVE', label: 'Активні' },
  { key: 'COMPLETED', label: 'Виконані' },
  { key: 'DISPUTED', label: 'Спірні' },
  { key: 'CANCELLED', label: 'Скасовані' },
];

export function OrdersPage() {
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 500);
  
  const [activeTab, setActiveTab] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const { data, isLoading, isFetching } = useAdminOrders({
    page: currentPage,
    limit: itemsPerPage,
    status: activeTab,
    search: debouncedSearch,
  });

  const updateStatusMutation = useUpdateAdminOrderStatusMutation();

  const orders = data?.items || [];

  const totalItems = data?.totalItems || 0;
  const totalPages = data?.totalPages || 1;
  
  const currentRange = totalItems === 0 ? 0 : `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, totalItems)}`;

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* Header & Search */}
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-[#2C694E]">Управління замовленнями</h1>
        <div className="relative w-full max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <LuSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#2C694E]/50 focus:bg-white outline-none transition-colors"
            placeholder="Пошук за ID, клієнтом або сіттером..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setCurrentPage(1); // Reset pagination on search
            }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setCurrentPage(1); // Reset pagination on tab change
            }}
            className={classNames(
              'px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors cursor-pointer',
              activeTab === tab.key
                ? 'bg-[#EAF3EF] text-[#2C694E]'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col relative">
        {/* Loading overlay for background fetches */}
        {isFetching && !isLoading && (
          <div className="absolute inset-0 bg-white/50 z-10 flex items-start justify-center pt-20">
            <div className="w-6 h-6 border-2 border-[#2C694E] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-[#f4f9f7] text-gray-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4 rounded-tl-3xl">ID Замовлення</th>
                <th className="px-6 py-4">Послуга</th>
                <th className="px-6 py-4">Клієнт</th>
                <th className="px-6 py-4">Сіттер</th>
                <th className="px-6 py-4">Дата та Час</th>
                <th className="px-6 py-4">Сума</th>
                <th className="px-6 py-4">Статус</th>
                <th className="px-6 py-4 rounded-tr-3xl text-center">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {isLoading ? (
                // Skeletons
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-8 w-8 bg-gray-200 rounded-full inline-block"></div></td>
                    <td className="px-6 py-4"><div className="h-8 w-8 bg-gray-200 rounded-full inline-block"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-12 mx-auto"></div></td>
                  </tr>
                ))
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                    {/* ID */}
                    <td className="px-6 py-4 font-bold text-[#2C694E] whitespace-nowrap">
                      {order.displayId}
                    </td>
                    
                    {/* Service */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <ServiceIcon type={order.serviceIconType} />
                        <div>
                          <div className="font-medium text-gray-900">{order.serviceName}</div>
                          <div className="text-gray-500 text-xs">{order.serviceDetails}</div>
                        </div>
                      </div>
                    </td>

                    {/* Client */}
                    <td className="px-6 py-4">
                      <UserBadge user={order.client} />
                    </td>

                    {/* Sitter */}
                    <td className="px-6 py-4">
                      <UserBadge user={order.sitter} />
                    </td>

                    {/* Date/Time */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{order.dateStr}</div>
                      <div className="text-gray-500 text-xs">{order.timeStr}</div>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      ₴{order.amount.toLocaleString('uk-UA')}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const promise = updateStatusMutation.mutateAsync({ id: order.id, status: 'COMPLETED' });
                            toast.promise(promise, {
                              pending: 'Оновлення статусу...',
                              success: 'Статус змінено на "Виконано"',
                              error: 'Помилка оновлення статусу'
                            });
                          }}
                          disabled={order.status === 'COMPLETED'}
                          className={classNames(
                            "flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm",
                            order.status === 'COMPLETED'
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer active:scale-95"
                          )}
                          title="Відмітити як Виконано"
                        >
                          <LuCheck className="w-3.5 h-3.5" />
                          Виконати
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const promise = updateStatusMutation.mutateAsync({ id: order.id, status: 'CANCELLED' });
                            toast.promise(promise, {
                              pending: 'Оновлення статусу...',
                              success: 'Статус змінено на "Скасовано"',
                              error: 'Помилка оновлення статусу'
                            });
                          }}
                          disabled={order.status === 'CANCELLED'}
                          className={classNames(
                            "flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm",
                            order.status === 'CANCELLED'
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-red-100 text-red-700 hover:bg-red-200 cursor-pointer active:scale-95"
                          )}
                          title="Скасувати"
                        >
                          <LuX className="w-3.5 h-3.5" />
                          Скасувати
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const promise = updateStatusMutation.mutateAsync({ id: order.id, status: 'DISPUTED' });
                            toast.promise(promise, {
                              pending: 'Оновлення статусу...',
                              success: 'Відкрито спір',
                              error: 'Помилка оновлення статусу'
                            });
                          }}
                          disabled={order.status === 'DISPUTED'}
                          className={classNames(
                            "flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm",
                            order.status === 'DISPUTED'
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-orange-100 text-orange-700 hover:bg-orange-200 cursor-pointer active:scale-95"
                          )}
                          title="Відкрити спір"
                        >
                          <MdWarning className="w-3.5 h-3.5" />
                          Спір
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <LuSearch className="w-12 h-12 text-gray-300" />
                      <p className="text-lg font-medium text-gray-600">Нічого не знайдено</p>
                      <p className="text-sm">Спробуйте змінити параметри пошуку або фільтри</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50 mt-auto">
          <div className="text-sm text-gray-500 font-medium">
            Показано {currentRange} з {totalItems} замовлень
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1 || isLoading}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-transparent transition-colors cursor-pointer"
              >
                <LuChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const page = i + 1;
                  const isActive = page === currentPage;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      disabled={isLoading}
                      className={classNames(
                        'w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors cursor-pointer',
                        isActive
                          ? 'bg-[#2C694E] text-white shadow-sm'
                          : 'text-gray-600 hover:bg-gray-200',
                        isLoading && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || isLoading}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-transparent transition-colors cursor-pointer"
              >
                <LuChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ServiceIcon({ type }: { type: AdminOrder['serviceIconType'] }) {
  const iconProps = { className: "w-5 h-5 text-[#2C694E]" };
  const wrapperClass = "w-10 h-10 rounded-full bg-[#EAF3EF] flex items-center justify-center flex-shrink-0";
  
  return (
    <div className={wrapperClass}>
      {type === 'WALK' && <MdDirectionsWalk {...iconProps} />}
      {type === 'BOARDING' && <MdHome {...iconProps} />}
      {type === 'SITTING' && <MdOutlinePets {...iconProps} />}
      {type === 'TRAINING' && <MdPets {...iconProps} />}
    </div>
  );
}

function UserBadge({ user }: { user: UserSnippet }) {
  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="flex items-center gap-3">
      {user.avatarUrl ? (
        <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover shadow-sm" />
      ) : (
        <div className="w-8 h-8 rounded-full bg-[#EAF3EF] text-[#2C694E] flex items-center justify-center text-xs font-bold shadow-sm">
          {initials}
        </div>
      )}
      <span className="font-medium text-gray-900 truncate max-w-[120px]" title={user.name}>
        {user.name}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  switch (status) {
    case 'ACTIVE':
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          Активно
        </div>
      );
    case 'COMPLETED':
      return (
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold whitespace-nowrap">
          Виконано
        </div>
      );
    case 'DISPUTED':
      return (
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-semibold whitespace-nowrap">
          Спір
        </div>
      );
    case 'CANCELLED':
      return (
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold whitespace-nowrap">
          Скасовано
        </div>
      );
    default:
      return null;
  }
}
