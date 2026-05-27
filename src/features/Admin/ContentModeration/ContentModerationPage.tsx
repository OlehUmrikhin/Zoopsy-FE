import { useState } from 'react';
import { Search, ThumbsUp, ThumbsDown, MapPin, Star } from 'lucide-react';
import { useContentModeration, useApproveContentMutation, useRejectContentMutation } from '../../../api/admin/content-moderation';
import type { ContentItem } from '../../../api/admin/content-moderation/types';

export function ContentModerationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [contentTypeFilter, setContentTypeFilter] = useState<'all' | 'review' | 'photo' | 'profile_test'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({});
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);

  const { data, isLoading, isError } = useContentModeration({
    page: currentPage,
    limit: 12,
    contentType: contentTypeFilter,
    status: 'pending',
    search: searchQuery.trim(),
  });

  const approveMutation = useApproveContentMutation();
  const rejectMutation = useRejectContentMutation();

  const content = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handleApprove = (contentId: string) => {
    approveMutation.mutate({ contentId });
  };

  const handleReject = (contentId: string) => {
    if (!rejectReason[contentId]) return;
    rejectMutation.mutate({ contentId, reason: rejectReason[contentId] });
    setShowRejectModal(null);
    setRejectReason((prev) => {
      const newReason = { ...prev };
      delete newReason[contentId];
      return newReason;
    });
  };

  const renderContentCard = (item: ContentItem & { id: string; moderationStatus: string }) => {
    if (item.contentType === 'review') {
      return (
        <div key={item.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="flex gap-3 mb-4">
            <img
              src={item.author.avatarUrl ?? 'https://via.placeholder.com/40'}
              alt={item.author.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900">{item.author.name}</p>
              <p className="text-xs text-gray-500">на {item.targetUser.name}</p>
            </div>
          </div>

          <div className="flex gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
              />
            ))}
          </div>

          <p className="text-sm text-gray-700 line-clamp-3 mb-4 flex-1">{item.reviewText}</p>

          <span className="inline-block mb-4 px-2 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-medium">
            СКАРГА
          </span>

          <div className="flex gap-2 mt-auto">
            <button
              onClick={() => handleApprove(item.id)}
              disabled={approveMutation.isPending}
              className="flex-1 py-2 bg-zoopsy-green-700 hover:bg-zoopsy-green-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
            >
              <ThumbsUp size={14} />
              Одобрити
            </button>
            <button
              onClick={() => setShowRejectModal(item.id)}
              disabled={rejectMutation.isPending}
              className="flex-1 py-2 bg-rose-100 hover:bg-rose-200 disabled:opacity-50 text-rose-700 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
            >
              <ThumbsDown size={14} />
              Відхилити
            </button>
          </div>

          {showRejectModal === item.id && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <input
                type="text"
                placeholder="Причина відхилення..."
                value={rejectReason[item.id] ?? ''}
                onChange={(e) => setRejectReason((prev) => ({ ...prev, [item.id]: e.target.value }))}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none mb-2"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleReject(item.id)}
                  disabled={!rejectReason[item.id]}
                  className="flex-1 py-1 bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-white rounded text-xs font-medium transition-colors"
                >
                  Підтвердити
                </button>
                <button
                  onClick={() => setShowRejectModal(null)}
                  className="flex-1 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-xs font-medium transition-colors"
                >
                  Скасувати
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (item.contentType === 'photo') {
      return (
        <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="h-48 bg-gray-100 overflow-hidden relative">
            <img
              src={item.photoUrl}
              alt="User photo"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-4 flex flex-col flex-1">
            <div className="flex gap-2 items-center mb-3">
              <img
                src={item.author.avatarUrl ?? 'https://via.placeholder.com/32'}
                alt={item.author.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900">{item.author.name}</p>
                <p className="text-xs text-gray-500">{item.author.role === 'owner' ? 'Власник' : 'Сіттер'}</p>
              </div>
            </div>

            {item.description && (
              <p className="text-xs text-gray-600 line-clamp-2 mb-3">{item.description}</p>
            )}

            <div className="flex gap-2 mt-auto">
              <button
                onClick={() => handleApprove(item.id)}
                disabled={approveMutation.isPending}
                className="flex-1 py-2 bg-zoopsy-green-700 hover:bg-zoopsy-green-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
              >
                <ThumbsUp size={14} />
                Одобрити
              </button>
              <button
                onClick={() => setShowRejectModal(item.id)}
                disabled={rejectMutation.isPending}
                className="flex-1 py-2 bg-rose-100 hover:bg-rose-200 disabled:opacity-50 text-rose-700 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
              >
                <ThumbsDown size={14} />
                Відхилити
              </button>
            </div>

            {showRejectModal === item.id && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <input
                  type="text"
                  placeholder="Причина відхилення..."
                  value={rejectReason[item.id] ?? ''}
                  onChange={(e) => setRejectReason((prev) => ({ ...prev, [item.id]: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none mb-2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReject(item.id)}
                    disabled={!rejectReason[item.id]}
                    className="flex-1 py-1 bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-white rounded text-xs font-medium transition-colors"
                  >
                    Підтвердити
                  </button>
                  <button
                    onClick={() => setShowRejectModal(null)}
                    className="flex-1 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-xs font-medium transition-colors"
                  >
                    Скасувати
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (item.contentType === 'profile_test') {
      const passPercentage = (item.score / item.maxScore) * 100;
      return (
        <div key={item.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="flex gap-3 mb-4">
            <img
              src={item.author.avatarUrl ?? 'https://via.placeholder.com/40'}
              alt={item.author.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900">{item.author.name}</p>
              <p className="text-xs text-gray-500">{item.author.role === 'owner' ? 'Власник' : 'Сіттер'}</p>
            </div>
          </div>

          <h3 className="font-bold text-gray-900 mb-2">{item.testName}</h3>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-gray-600">Результат тесту</span>
              <span className="text-sm font-bold text-gray-900">
                {item.score} / {item.maxScore}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-full rounded-full transition-all ${
                  passPercentage >= 70 ? 'bg-zoopsy-green-700' : 'bg-rose-600'
                }`}
                style={{ width: `${passPercentage}%` }}
              />
            </div>
          </div>

          <span
            className={`inline-block mb-4 px-2 py-1 rounded-full text-xs font-medium ${
              item.status === 'passed'
                ? 'bg-green-100 text-green-700'
                : item.status === 'failed'
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {item.status === 'passed' ? 'Пройдено' : item.status === 'failed' ? 'Не пройдено' : 'На розгляді'}
          </span>

          <a
            href={item.testUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zoopsy-green-700 hover:underline mb-4 flex items-center gap-1"
          >
            <MapPin size={12} />
            Переглянути результати
          </a>

          <div className="flex gap-2 mt-auto">
            <button
              onClick={() => handleApprove(item.id)}
              disabled={approveMutation.isPending}
              className="flex-1 py-2 bg-zoopsy-green-700 hover:bg-zoopsy-green-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
            >
              <ThumbsUp size={14} />
              Одобрити
            </button>
            <button
              onClick={() => setShowRejectModal(item.id)}
              disabled={rejectMutation.isPending}
              className="flex-1 py-2 bg-rose-100 hover:bg-rose-200 disabled:opacity-50 text-rose-700 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
            >
              <ThumbsDown size={14} />
              Відхилити
            </button>
          </div>

          {showRejectModal === item.id && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <input
                type="text"
                placeholder="Причина відхилення..."
                value={rejectReason[item.id] ?? ''}
                onChange={(e) => setRejectReason((prev) => ({ ...prev, [item.id]: e.target.value }))}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none mb-2"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleReject(item.id)}
                  disabled={!rejectReason[item.id]}
                  className="flex-1 py-1 bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-white rounded text-xs font-medium transition-colors"
                >
                  Підтвердити
                </button>
                <button
                  onClick={() => setShowRejectModal(null)}
                  className="flex-1 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-xs font-medium transition-colors"
                >
                  Скасувати
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-140px)] text-gray-600">
        Завантаження контенту...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-140px)] text-rose-600">
        Помилка при завантаженні контенту. Спробуйте перезавантажити сторінку.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Модерація контенту</h1>
          <p className="text-sm text-gray-500 mt-1">Перегляд нових та посумнівалих матеріалів для спільноти Zoopsy</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Пошук по авторові, назві..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-zoopsy-green-500 text-sm"
          />
        </div>
        <select
          value={contentTypeFilter}
          onChange={(e) => {
            setContentTypeFilter(e.target.value as any);
            setCurrentPage(1);
          }}
          className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none"
        >
          <option value="all">Всі типи</option>
          <option value="review">Відзиви</option>
          <option value="photo">Фото</option>
          <option value="profile_test">Тест профіля</option>
        </select>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => (data as any)?.refetch?.()}
          className="px-3 py-1 bg-gray-100 rounded-md text-sm"
        >
          Оновити
        </button>
      </div>

      {/* Content Grid */}
      <div>
        {content.length === 0 ? (
          <div className="flex items-center justify-center min-h-[300px] bg-white rounded-2xl text-gray-400">
            Контенту на розгляді не знайдено
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {content.map((item) => renderContentCard(item))}
          </div>
        )}
      </div>

      {/* Pagination */}
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
