import { useState } from 'react';
import { Search, Star, Pencil, Trash2 } from 'lucide-react';
import { useAdminReviews, useAdminPatchReviewMutation, useAdminDeleteReviewMutation } from '../../../api/admin/reviews';
import type { AdminReviewItem } from '../../../api/admin/reviews';

export function AdminReviewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [showEditModal, setShowEditModal] = useState<number | null>(null);
  const [editData, setEditData] = useState<Record<number, { rating: number; comment: string }>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const { data, isLoading, isError, refetch } = useAdminReviews({
    page: currentPage,
    limit: 12,
    search: searchQuery.trim() || undefined,
  });

  const patchMutation = useAdminPatchReviewMutation();
  const deleteMutation = useAdminDeleteReviewMutation();

  const reviews = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handleOpenEdit = (item: AdminReviewItem) => {
    setShowDeleteConfirm(null);
    setShowEditModal(item.id);
    if (!editData[item.id]) {
      setEditData((prev) => ({ ...prev, [item.id]: { rating: item.rating, comment: item.comment } }));
    }
  };

  const handleSaveEdit = (item: AdminReviewItem) => {
    const current = editData[item.id] ?? { rating: item.rating, comment: item.comment };
    patchMutation.mutate(
      { id: item.id, rating: current.rating, comment: current.comment },
      {
        onSuccess: () => {
          setShowEditModal(null);
          setEditData((prev) => {
            const next = { ...prev };
            delete next[item.id];
            return next;
          });
        },
      },
    );
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => setShowDeleteConfirm(null),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-140px)] text-gray-600">
        Завантаження відгуків...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-140px)] text-rose-600">
        Помилка при завантаженні відгуків. Спробуйте перезавантажити сторінку.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Відгуки</h1>
          <p className="text-sm text-gray-500 mt-1">Управління відгуками користувачів</p>
        </div>
        <span className="text-sm text-gray-500">Всього: {data?.totalItems ?? 0}</span>
      </div>

      <div className="flex gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Пошук по автору або тексту..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-zoopsy-green-500 text-sm"
          />
        </div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
        >
          Оновити
        </button>
      </div>

      {reviews.length === 0 ? (
        <div className="flex items-center justify-center min-h-[300px] bg-white rounded-2xl text-gray-400">
          Відгуків не знайдено
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((item) => {
            const currentEdit = editData[item.id] ?? { rating: item.rating, comment: item.comment };
            return (
              <div key={item.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span className="font-semibold text-gray-900 text-sm">
                        {item.authorFullName ?? 'Невідомий автор'}
                      </span>
                      <span className="text-gray-400 text-xs">→</span>
                      <span className="text-gray-600 text-sm">
                        {item.sitterFullName ?? 'Невідомий сіттер'}
                      </span>
                      <span className="text-xs text-gray-400 ml-auto">
                        {new Date(item.createdAt).toLocaleDateString('uk-UA')}
                      </span>
                    </div>

                    <div className="flex gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>

                    <p className="text-sm text-gray-700">{item.comment}</p>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
                      title="Редагувати"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setShowEditModal(null);
                        setShowDeleteConfirm(item.id);
                      }}
                      disabled={deleteMutation.isPending}
                      className="p-2 bg-gray-100 hover:bg-rose-100 text-gray-500 hover:text-rose-700 disabled:opacity-50 rounded-lg transition-colors"
                      title="Видалити"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {showEditModal === item.id && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-xs font-semibold text-blue-700 mb-3">Редагування відгуку</p>
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() =>
                            setEditData((prev) => ({
                              ...prev,
                              [item.id]: { ...prev[item.id], rating: i + 1 },
                            }))
                          }
                        >
                          <Star
                            size={22}
                            className={
                              i < currentEdit.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300 hover:text-yellow-300'
                            }
                          />
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={currentEdit.comment}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          [item.id]: { ...prev[item.id], comment: e.target.value },
                        }))
                      }
                      rows={3}
                      className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:outline-none mb-3 resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(item)}
                        disabled={patchMutation.isPending}
                        className="flex-1 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Зберегти
                      </button>
                      <button
                        onClick={() => setShowEditModal(null)}
                        className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                      >
                        Скасувати
                      </button>
                    </div>
                  </div>
                )}

                {showDeleteConfirm === item.id && (
                  <div className="mt-4 p-4 bg-rose-50 rounded-xl border border-rose-200">
                    <p className="text-sm text-rose-700 mb-3">Видалити цей відгук назавжди?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deleteMutation.isPending}
                        className="flex-1 py-2 bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Видалити
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(null)}
                        className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                      >
                        Скасувати
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 bg-white rounded-2xl border border-gray-100">
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
  );
}
