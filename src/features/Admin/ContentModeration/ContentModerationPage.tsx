import { useState } from 'react';
import { Search, ThumbsUp, ThumbsDown, MapPin, Star, Pencil, Trash2 } from 'lucide-react';
import {
  useContentModeration,
  useApproveContentMutation,
  useRejectContentMutation,
  useAdminUpdateReviewMutation,
  useAdminDeleteReviewMutation,
} from '../../../api/admin/content-moderation';
import { useAdminReviews, useAdminPatchReviewMutation, useAdminDeleteReviewMutation as useAdminDeleteBookingReview } from '../../../api/admin/reviews';
import type { ContentItem, UserReview } from '../../../api/admin/content-moderation/types';
import type { AdminReviewItem } from '../../../api/admin/reviews';

type Tab = 'moderation' | 'reviews';

export function ContentModerationPage() {
  const [activeTab, setActiveTab] = useState<Tab>('reviews');

  // --- Moderation tab state ---
  const [searchQuery, setSearchQuery] = useState('');
  const [contentTypeFilter, setContentTypeFilter] = useState<'all' | 'userReview' | 'userPhoto' | 'profileTest'>('all');
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [currentPage, setCurrentPage] = useState(1);
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({});
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, { rating: number; comment: string }>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // --- Reviews tab state ---
  const [reviewSearch, setReviewSearch] = useState('');
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewEditModal, setReviewEditModal] = useState<number | null>(null);
  const [reviewEditData, setReviewEditData] = useState<Record<number, { rating: number; comment: string }>>({});
  const [reviewDeleteConfirm, setReviewDeleteConfirm] = useState<number | null>(null);

  // --- Moderation queries ---
  const { data: moderationData, isLoading: moderationLoading, isError: moderationError, refetch: moderationRefetch } = useContentModeration({
    page: currentPage,
    limit: 12,
    contentType: contentTypeFilter,
    status: statusFilter,
    search: searchQuery.trim(),
  });

  const approveMutation = useApproveContentMutation();
  const rejectMutation = useRejectContentMutation();
  const updateContentReviewMutation = useAdminUpdateReviewMutation();
  const deleteContentReviewMutation = useAdminDeleteReviewMutation();

  const content = moderationData?.items ?? [];
  const totalModerationPages = moderationData?.totalPages ?? 1;

  // --- Reviews queries ---
  const { data: reviewsData, isLoading: reviewsLoading, isError: reviewsError, refetch: reviewsRefetch } = useAdminReviews({
    page: reviewPage,
    limit: 12,
    search: reviewSearch.trim() || undefined,
  });

  const patchReviewMutation = useAdminPatchReviewMutation();
  const deleteReviewMutation = useAdminDeleteBookingReview();

  const reviews = reviewsData?.items ?? [];
  const totalReviewPages = reviewsData?.totalPages ?? 1;

  // --- Moderation handlers ---
  const handleApprove = (id: string, contentType: string) => {
    approveMutation.mutate({ itemId: parseInt(id), contentType });
  };

  const handleReject = (id: string, contentType: string) => {
    if (!rejectReason[id]) return;
    rejectMutation.mutate({ itemId: parseInt(id), contentType, reason: rejectReason[id] });
    setShowRejectModal(null);
    setRejectReason((prev) => { const next = { ...prev }; delete next[id]; return next; });
  };

  const handleOpenContentEdit = (item: UserReview & { id: string }) => {
    setShowRejectModal(null);
    setShowDeleteConfirm(null);
    setShowEditModal(item.id);
    if (!editData[item.id]) {
      setEditData((prev) => ({ ...prev, [item.id]: { rating: item.rating, comment: item.reviewText } }));
    }
  };

  const handleUpdateContentReview = (id: string, item: UserReview) => {
    const current = editData[id] ?? { rating: item.rating, comment: item.reviewText };
    updateContentReviewMutation.mutate(
      { id: parseInt(id), rating: current.rating, comment: current.comment },
      { onSuccess: () => { setShowEditModal(null); setEditData((prev) => { const next = { ...prev }; delete next[id]; return next; }); } },
    );
  };

  const handleDeleteContentReview = (id: string) => {
    deleteContentReviewMutation.mutate(parseInt(id), { onSuccess: () => setShowDeleteConfirm(null) });
  };

  // --- Reviews handlers ---
  const handleOpenReviewEdit = (item: AdminReviewItem) => {
    setReviewDeleteConfirm(null);
    setReviewEditModal(item.id);
    if (!reviewEditData[item.id]) {
      setReviewEditData((prev) => ({ ...prev, [item.id]: { rating: item.rating, comment: item.comment } }));
    }
  };

  const handleSaveReviewEdit = (item: AdminReviewItem) => {
    const current = reviewEditData[item.id] ?? { rating: item.rating, comment: item.comment };
    patchReviewMutation.mutate(
      { id: item.id, rating: current.rating, comment: current.comment },
      { onSuccess: () => { setReviewEditModal(null); setReviewEditData((prev) => { const next = { ...prev }; delete next[item.id]; return next; }); } },
    );
  };

  const handleDeleteReview = (id: number) => {
    deleteReviewMutation.mutate(id, { onSuccess: () => setReviewDeleteConfirm(null) });
  };

  // --- Content card renderer ---
  const renderContentCard = (item: ContentItem & { id: string; moderationStatus: string }) => {
    if (item.contentType === 'userReview') {
      const currentEdit = editData[item.id] ?? { rating: item.rating, comment: item.reviewText };
      return (
        <div key={item.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="flex gap-3 mb-4">
            <img src={item.author.avatarUrl ?? 'https://via.placeholder.com/40'} alt={item.author.name} className="w-10 h-10 rounded-full object-cover" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900">{item.author.name}</p>
              <p className="text-xs text-gray-500">на {item.targetUser.name}</p>
            </div>
          </div>
          <div className="flex gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={16} className={i < item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
            ))}
          </div>
          <p className="text-sm text-gray-700 line-clamp-3 mb-4 flex-1">{item.reviewText}</p>
          <span className="inline-block mb-4 px-2 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-medium">СКАРГА</span>
          <div className="flex gap-2 mt-auto">
            <button onClick={() => handleApprove(item.id, item.contentType)} disabled={approveMutation.isPending} className="flex-1 py-2 bg-zoopsy-green-700 hover:bg-zoopsy-green-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors">
              <ThumbsUp size={14} />Одобрити
            </button>
            <button onClick={() => setShowRejectModal(item.id)} disabled={rejectMutation.isPending} className="flex-1 py-2 bg-rose-100 hover:bg-rose-200 disabled:opacity-50 text-rose-700 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors">
              <ThumbsDown size={14} />Відхилити
            </button>
          </div>
          <div className="flex gap-2 mt-2">
            <button onClick={() => handleOpenContentEdit(item as UserReview & { id: string })} className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors">
              <Pencil size={14} />Редагувати
            </button>
            <button onClick={() => { setShowEditModal(null); setShowRejectModal(null); setShowDeleteConfirm(item.id); }} disabled={deleteContentReviewMutation.isPending} className="flex-1 py-2 bg-gray-100 hover:bg-rose-100 disabled:opacity-50 text-gray-600 hover:text-rose-700 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors">
              <Trash2 size={14} />Видалити
            </button>
          </div>
          {showRejectModal === item.id && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <input type="text" placeholder="Причина відхилення..." value={rejectReason[item.id] ?? ''} onChange={(e) => setRejectReason((prev) => ({ ...prev, [item.id]: e.target.value }))} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none mb-2" />
              <div className="flex gap-2">
                <button onClick={() => handleReject(item.id, item.contentType)} disabled={!rejectReason[item.id]} className="flex-1 py-1 bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-white rounded text-xs font-medium transition-colors">Підтвердити</button>
                <button onClick={() => setShowRejectModal(null)} className="flex-1 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-xs font-medium transition-colors">Скасувати</button>
              </div>
            </div>
          )}
          {showEditModal === item.id && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs font-medium text-blue-700 mb-2">Редагування відгуку</p>
              <div className="flex gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button key={i} type="button" onClick={() => setEditData((prev) => ({ ...prev, [item.id]: { ...prev[item.id], rating: i + 1 } }))}>
                    <Star size={20} className={i < currentEdit.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-300'} />
                  </button>
                ))}
              </div>
              <textarea value={currentEdit.comment} onChange={(e) => setEditData((prev) => ({ ...prev, [item.id]: { ...prev[item.id], comment: e.target.value } }))} rows={3} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-xs focus:outline-none mb-2 resize-none" />
              <div className="flex gap-2">
                <button onClick={() => handleUpdateContentReview(item.id, item as unknown as UserReview)} disabled={updateContentReviewMutation.isPending} className="flex-1 py-1 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white rounded text-xs font-medium transition-colors">Зберегти</button>
                <button onClick={() => setShowEditModal(null)} className="flex-1 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-xs font-medium transition-colors">Скасувати</button>
              </div>
            </div>
          )}
          {showDeleteConfirm === item.id && (
            <div className="mt-3 p-3 bg-rose-50 rounded-lg border border-rose-200">
              <p className="text-xs text-rose-700 mb-2">Видалити цей відгук назавжди?</p>
              <div className="flex gap-2">
                <button onClick={() => handleDeleteContentReview(item.id)} disabled={deleteContentReviewMutation.isPending} className="flex-1 py-1 bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-white rounded text-xs font-medium transition-colors">Видалити</button>
                <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-xs font-medium transition-colors">Скасувати</button>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (item.contentType === 'userPhoto') {
      return (
        <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="h-48 bg-gray-100 overflow-hidden">
            <img src={item.photoUrl} alt="User photo" className="w-full h-full object-cover" />
          </div>
          <div className="p-4 flex flex-col flex-1">
            <div className="flex gap-2 items-center mb-3">
              <img src={item.author.avatarUrl ?? 'https://via.placeholder.com/32'} alt={item.author.name} className="w-8 h-8 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900">{item.author.name}</p>
                <p className="text-xs text-gray-500">{item.author.role === 'owner' ? 'Власник' : 'Сіттер'}</p>
              </div>
            </div>
            {item.description && <p className="text-xs text-gray-600 line-clamp-2 mb-3">{item.description}</p>}
            <div className="flex gap-2 mt-auto">
              <button onClick={() => handleApprove(item.id, item.contentType)} disabled={approveMutation.isPending} className="flex-1 py-2 bg-zoopsy-green-700 hover:bg-zoopsy-green-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors">
                <ThumbsUp size={14} />Одобрити
              </button>
              <button onClick={() => setShowRejectModal(item.id)} disabled={rejectMutation.isPending} className="flex-1 py-2 bg-rose-100 hover:bg-rose-200 disabled:opacity-50 text-rose-700 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors">
                <ThumbsDown size={14} />Відхилити
              </button>
            </div>
            {showRejectModal === item.id && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <input type="text" placeholder="Причина відхилення..." value={rejectReason[item.id] ?? ''} onChange={(e) => setRejectReason((prev) => ({ ...prev, [item.id]: e.target.value }))} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none mb-2" />
                <div className="flex gap-2">
                  <button onClick={() => handleReject(item.id, item.contentType)} disabled={!rejectReason[item.id]} className="flex-1 py-1 bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-white rounded text-xs font-medium transition-colors">Підтвердити</button>
                  <button onClick={() => setShowRejectModal(null)} className="flex-1 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-xs font-medium transition-colors">Скасувати</button>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (item.contentType === 'profileTest') {
      const passPercentage = (item.score / item.maxScore) * 100;
      return (
        <div key={item.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col h-full">
          <div className="flex gap-3 mb-4">
            <img src={item.author.avatarUrl ?? 'https://via.placeholder.com/40'} alt={item.author.name} className="w-10 h-10 rounded-full object-cover" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900">{item.author.name}</p>
              <p className="text-xs text-gray-500">{item.author.role === 'owner' ? 'Власник' : 'Сіттер'}</p>
            </div>
          </div>
          <h3 className="font-bold text-gray-900 mb-2">{item.testName}</h3>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-gray-600">Результат тесту</span>
              <span className="text-sm font-bold text-gray-900">{item.score} / {item.maxScore}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className={`h-full rounded-full transition-all ${passPercentage >= 70 ? 'bg-zoopsy-green-700' : 'bg-rose-600'}`} style={{ width: `${passPercentage}%` }} />
            </div>
          </div>
          <span className={`inline-block mb-4 px-2 py-1 rounded-full text-xs font-medium ${item.status === 'passed' ? 'bg-green-100 text-green-700' : item.status === 'failed' ? 'bg-rose-100 text-rose-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {item.status === 'passed' ? 'Пройдено' : item.status === 'failed' ? 'Не пройдено' : 'На розгляді'}
          </span>
          <a href={item.testUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-zoopsy-green-700 hover:underline mb-4 flex items-center gap-1">
            <MapPin size={12} />Переглянути результати
          </a>
          <div className="flex gap-2 mt-auto">
            <button onClick={() => handleApprove(item.id, item.contentType)} disabled={approveMutation.isPending} className="flex-1 py-2 bg-zoopsy-green-700 hover:bg-zoopsy-green-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors">
              <ThumbsUp size={14} />Одобрити
            </button>
            <button onClick={() => setShowRejectModal(item.id)} disabled={rejectMutation.isPending} className="flex-1 py-2 bg-rose-100 hover:bg-rose-200 disabled:opacity-50 text-rose-700 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors">
              <ThumbsDown size={14} />Відхилити
            </button>
          </div>
          {showRejectModal === item.id && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <input type="text" placeholder="Причина відхилення..." value={rejectReason[item.id] ?? ''} onChange={(e) => setRejectReason((prev) => ({ ...prev, [item.id]: e.target.value }))} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none mb-2" />
              <div className="flex gap-2">
                <button onClick={() => handleReject(item.id, item.contentType)} disabled={!rejectReason[item.id]} className="flex-1 py-1 bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-white rounded text-xs font-medium transition-colors">Підтвердити</button>
                <button onClick={() => setShowRejectModal(null)} className="flex-1 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-xs font-medium transition-colors">Скасувати</button>
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Модерація контенту</h1>
        <p className="text-sm text-gray-500 mt-1">Перегляд нових та посумнівалих матеріалів для спільноти Zoopsy</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-2xl p-1 shadow-sm border border-gray-100 w-fit">
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === 'reviews' ? 'bg-zoopsy-green-700 text-white' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Відгуки
        </button>
        <button
          onClick={() => setActiveTab('moderation')}
          className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === 'moderation' ? 'bg-zoopsy-green-700 text-white' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Модерація
        </button>
      </div>

      {/* ── REVIEWS TAB ── */}
      {activeTab === 'reviews' && (
        <>
          <div className="flex gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Пошук по автору або тексту..."
                value={reviewSearch}
                onChange={(e) => { setReviewSearch(e.target.value); setReviewPage(1); }}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-zoopsy-green-500 text-sm"
              />
            </div>
            <button onClick={() => reviewsRefetch()} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors">Оновити</button>
          </div>

          {reviewsLoading ? (
            <div className="flex items-center justify-center min-h-[300px] text-gray-600">Завантаження відгуків...</div>
          ) : reviewsError ? (
            <div className="flex items-center justify-center min-h-[300px] text-rose-600">Помилка при завантаженні відгуків.</div>
          ) : reviews.length === 0 ? (
            <div className="flex items-center justify-center min-h-[300px] bg-white rounded-2xl text-gray-400">Відгуків не знайдено</div>
          ) : (
            <div className="flex flex-col gap-3">
              {reviews.map((item) => {
                const currentEdit = reviewEditData[item.id] ?? { rating: item.rating, comment: item.comment };
                return (
                  <div key={item.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <span className="font-semibold text-gray-900 text-sm">{item.authorFullName ?? 'Невідомий автор'}</span>
                          <span className="text-gray-400 text-xs">→</span>
                          <span className="text-gray-600 text-sm">{item.sitterFullName ?? 'Невідомий сіттер'}</span>
                          <span className="text-xs text-gray-400 ml-auto">{new Date(item.createdAt).toLocaleDateString('uk-UA')}</span>
                        </div>
                        <div className="flex gap-1 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={14} className={i < item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                          ))}
                        </div>
                        <p className="text-sm text-gray-700">{item.comment}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => handleOpenReviewEdit(item)} className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors" title="Редагувати">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => { setReviewEditModal(null); setReviewDeleteConfirm(item.id); }} disabled={deleteReviewMutation.isPending} className="p-2 bg-gray-100 hover:bg-rose-100 text-gray-500 hover:text-rose-700 disabled:opacity-50 rounded-lg transition-colors" title="Видалити">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {reviewEditModal === item.id && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <p className="text-xs font-semibold text-blue-700 mb-3">Редагування відгуку</p>
                        <div className="flex gap-1 mb-3">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <button key={i} type="button" onClick={() => setReviewEditData((prev) => ({ ...prev, [item.id]: { ...prev[item.id], rating: i + 1 } }))}>
                              <Star size={22} className={i < currentEdit.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-300'} />
                            </button>
                          ))}
                        </div>
                        <textarea value={currentEdit.comment} onChange={(e) => setReviewEditData((prev) => ({ ...prev, [item.id]: { ...prev[item.id], comment: e.target.value } }))} rows={3} className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:outline-none mb-3 resize-none" />
                        <div className="flex gap-2">
                          <button onClick={() => handleSaveReviewEdit(item)} disabled={patchReviewMutation.isPending} className="flex-1 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors">Зберегти</button>
                          <button onClick={() => setReviewEditModal(null)} className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors">Скасувати</button>
                        </div>
                      </div>
                    )}

                    {reviewDeleteConfirm === item.id && (
                      <div className="mt-4 p-4 bg-rose-50 rounded-xl border border-rose-200">
                        <p className="text-sm text-rose-700 mb-3">Видалити цей відгук назавжди?</p>
                        <div className="flex gap-2">
                          <button onClick={() => handleDeleteReview(item.id)} disabled={deleteReviewMutation.isPending} className="flex-1 py-2 bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors">Видалити</button>
                          <button onClick={() => setReviewDeleteConfirm(null)} className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors">Скасувати</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {totalReviewPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 bg-white rounded-2xl border border-gray-100">
              <p className="text-sm text-gray-600">Сторінка {reviewPage} з {totalReviewPages}</p>
              <div className="flex gap-2">
                <button onClick={() => setReviewPage(Math.max(1, reviewPage - 1))} disabled={reviewPage === 1} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors">Назад</button>
                <button onClick={() => setReviewPage(Math.min(totalReviewPages, reviewPage + 1))} disabled={reviewPage === totalReviewPages} className="px-4 py-2 bg-zoopsy-green-700 hover:bg-zoopsy-green-800 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors">Далі</button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── MODERATION TAB ── */}
      {activeTab === 'moderation' && (
        <>
          <div className="flex gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Пошук по авторові, назві..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-zoopsy-green-500 text-sm"
              />
            </div>
            <select value={contentTypeFilter} onChange={(e) => { setContentTypeFilter(e.target.value as any); setCurrentPage(1); }} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none">
              <option value="all">Всі типи</option>
              <option value="userReview">Відгуки</option>
              <option value="userPhoto">Фото</option>
              <option value="profileTest">Тест профіля</option>
            </select>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as any); setCurrentPage(1); }} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none">
              <option value="pending">На розгляді</option>
              <option value="approved">Одобрені</option>
              <option value="rejected">Відхилені</option>
              <option value="all">Всі статуси</option>
            </select>
            <button onClick={() => moderationRefetch()} className="px-3 py-1 bg-gray-100 rounded-md text-sm">Оновити</button>
          </div>

          {moderationLoading ? (
            <div className="flex items-center justify-center min-h-[300px] text-gray-600">Завантаження контенту...</div>
          ) : moderationError ? (
            <div className="flex items-center justify-center min-h-[300px] text-rose-600">Помилка при завантаженні контенту.</div>
          ) : content.length === 0 ? (
            <div className="flex items-center justify-center min-h-[300px] bg-white rounded-2xl text-gray-400">Контенту на розгляді не знайдено</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.map((item) => renderContentCard(item))}
            </div>
          )}

          {totalModerationPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 bg-white rounded-2xl border border-gray-100">
              <p className="text-sm text-gray-600">Сторінка {currentPage} з {totalModerationPages}</p>
              <div className="flex gap-2">
                <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors">Назад</button>
                <button onClick={() => setCurrentPage(Math.min(totalModerationPages, currentPage + 1))} disabled={currentPage === totalModerationPages} className="px-4 py-2 bg-zoopsy-green-700 hover:bg-zoopsy-green-800 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors">Далі</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
