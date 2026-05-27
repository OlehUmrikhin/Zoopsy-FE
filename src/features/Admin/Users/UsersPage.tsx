import { useState } from 'react';
import { Search, Shield, ShieldCheck, Ban } from 'lucide-react';
import {
  useAdminUsers,
  useUpdateAdminUserMutation,
  useUpdateAdminUserStatusMutation,
} from '../../../api/admin/users';
import type { AdminUser } from '../../../api/admin/users/types';

const roleLabels: Record<string, { label: string; color: string }> = {
  owner: { label: 'Власник', color: 'bg-blue-100 text-blue-700' },
  sitter: { label: 'Сіттер', color: 'bg-green-100 text-green-700' },
  moderator: { label: 'Модератор', color: 'bg-purple-100 text-purple-700' },
  admin: { label: 'Адміністратор', color: 'bg-red-100 text-red-700' },
};

const statusLabels: Record<string, { label: string; color: string; badge: string }> = {
  active: { label: 'Активний', color: 'text-green-600', badge: 'bg-green-100' },
  inactive: { label: 'Неактивний', color: 'text-gray-600', badge: 'bg-gray-100' },
  blocked: { label: 'Заблокований', color: 'text-red-600', badge: 'bg-red-100' },
  pending: { label: 'На розгляді', color: 'text-yellow-600', badge: 'bg-yellow-100' },
};

export function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editForm, setEditForm] = useState<{
    name: string;
    email: string;
    role: AdminUser['role'];
    status: AdminUser['status'];
  }>({
    name: '',
    email: '',
    role: 'owner',
    status: 'active',
  });
  const [roleFilter, setRoleFilter] = useState<'all' | 'owner' | 'sitter' | 'moderator' | 'admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'blocked' | 'pending'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const editMutation = useUpdateAdminUserMutation();
  const statusMutation = useUpdateAdminUserStatusMutation();

  const { data, isLoading, isError } = useAdminUsers({
    page: currentPage,
    limit: 20,
    role: roleFilter,
    status: statusFilter,
    search: searchQuery.trim(),
  });

  const users: AdminUser[] = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  const openEditModal = (user: AdminUser) => {
    setEditingUser(user);
    setEditForm({
      name: user.name ?? '',
      email: user.email ?? '',
      role: user.role,
      status: user.status,
    });
  };

  const closeEditModal = () => {
    setEditingUser(null);
  };

  const handleSaveEdit = () => {
    if (!editingUser) return;
    editMutation.mutate(
      {
        userId: editingUser.id,
        payload: {
          name: editForm.name.trim(),
          email: editForm.email.trim(),
          role: editForm.role,
          status: editForm.status,
        },
      },
      {
        onSuccess: () => {
          closeEditModal();
        },
      },
    );
  };

  const handleToggleBlock = (user: AdminUser) => {
    const nextStatus = user.status === 'blocked' ? 'active' : 'blocked';
    statusMutation.mutate({
      userId: user.id,
      payload: { status: nextStatus },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-140px)] text-gray-600">
        Завантаження користувачів...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-140px)] text-rose-600">
        Помилка при завантаженні користувачів. Спробуйте перезавантажити сторінку.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Управління користувачами</h1>
          <p className="text-sm text-gray-500 mt-1">Керування користувачами та регуляціями експоненти спільноти Zoopsy</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Пошук по імені, email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-zoopsy-green-500 text-sm"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value as any);
            setCurrentPage(1);
          }}
          className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none"
        >
          <option value="all">Всі ролі</option>
          <option value="owner">Власник</option>
          <option value="sitter">Сіттер</option>
          <option value="moderator">Модератор</option>
          <option value="admin">Адміністратор</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as any);
            setCurrentPage(1);
          }}
          className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none"
        >
          <option value="all">Всі статуси</option>
          <option value="active">Активний</option>
          <option value="inactive">Неактивний</option>
          <option value="blocked">Заблокований</option>
          <option value="pending">На розгляді</option>
        </select>
      </div>

      {/* Table */}
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => (data as any)?.refetch?.()}
          className="px-3 py-1 bg-gray-100 rounded-md text-sm"
        >
          Оновити
        </button>
      </div>

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Редагувати користувача</h2>
                <p className="text-sm text-gray-500">Змінити ім’я, email, роль або статус.</p>
              </div>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
                aria-label="Закрити"
              >
                ×
              </button>
            </div>
            <div className="grid gap-4">
              <label className="block">
                <span className="text-sm text-gray-700">Ім'я</span>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:outline-none focus:border-zoopsy-green-500"
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-700">Email</span>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:outline-none focus:border-zoopsy-green-500"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm text-gray-700">Роль</span>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, role: e.target.value as any }))}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:outline-none focus:border-zoopsy-green-500"
                  >
                    <option value="owner">Власник</option>
                    <option value="sitter">Сіттер</option>
                    <option value="moderator">Модератор</option>
                    <option value="admin">Адміністратор</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm text-gray-700">Статус</span>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, status: e.target.value as any }))}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:outline-none focus:border-zoopsy-green-500"
                  >
                    <option value="active">Активний</option>
                    <option value="inactive">Неактивний</option>
                    <option value="blocked">Заблокований</option>
                    <option value="pending">На розгляді</option>
                  </select>
                </label>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={closeEditModal}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Скасувати
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={editMutation.isPending}
                className="rounded-xl bg-zoopsy-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-zoopsy-green-800 disabled:opacity-50"
              >
                {editMutation.isPending ? 'Зберігаю...' : 'Зберегти'}
              </button>
            </div>
            {editMutation.isError && (
              <p className="mt-3 text-sm text-rose-600">Не вдалось зберегти зміни. Спробуйте ще раз.</p>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Користувач</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Роль</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Статус</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Рейтинг</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Остання активність</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    Користувачів не знайдено
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const roleConfig = roleLabels[user.role?.toLowerCase()] ?? { label: user.role || 'Невідомо', color: 'bg-gray-100 text-gray-700' };
                  const statusConfig = statusLabels[user.status?.toLowerCase()] ?? { label: user.status || 'Невідомо', color: 'text-gray-600', badge: 'bg-gray-100' };
                  return (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatarUrl ?? 'https://via.placeholder.com/40'}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleConfig.color}`}>
                          {roleConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusConfig.badge} ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-gray-900">★ {(user.rating ?? 0).toFixed(1)}</span>
                          <span className="text-xs text-gray-500">({user.totalBookings ?? 0})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(user.lastActivityAt).toLocaleDateString('uk-UA')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(user)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
                            title="Редагувати"
                          >
                            <Shield size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleBlock(user)}
                            className="p-2 rounded-lg transition-colors text-gray-600 hover:text-rose-600 hover:bg-rose-100"
                            title={user.status === 'blocked' ? 'Розблокувати' : 'Заблокувати'}
                          >
                            {user.status === 'blocked' ? <ShieldCheck size={18} /> : <Ban size={18} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Сторінка {currentPage} з {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors"
              >
                Назад
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-zoopsy-green-700 hover:bg-zoopsy-green-800 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Далі
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
