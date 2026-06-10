import { useEffect, useState } from 'react';
import { Search, Image as ImageIcon, Clock, ShieldOff, Shield, UserCog, Expand, X, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from '@tanstack/react-router';
import {
  useAdminComplaints,
  useUpdateAdminComplaintStatusMutation,
} from '../../../api/admin';
import { useUpdateAdminUserStatusMutation } from '../../../api/admin/users';
import type { AdminComplaint, ComplaintUser } from '../../../api/admin/types';

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

const STATUS_FILTERS = [
  { value: 'all', label: 'Всі' },
  { value: 'active', label: 'Активні' },
  { value: 'resolved', label: 'Вирішені' },
  { value: 'rejected', label: 'Відхилені' },
] as const;

type StatusFilter = (typeof STATUS_FILTERS)[number]['value'];

function StatusBadge({ status }: { status: AdminComplaint['status'] }) {
  if (status === 'resolved')
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
        Вирішено
      </span>
    );
  if (status === 'rejected')
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-200 text-gray-500">
        Відхилено
      </span>
    );
  return (
    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
      Активна
    </span>
  );
}

// ─── ParticipantCard ─────────────────────────────────────────────────────────

interface ParticipantCardProps {
  user: ComplaintUser;
  onBlock: (userId: string, currentlyBlocked: boolean) => void;
  isBlocking: boolean;
  onEdit: (userId: string) => void;
}

function ParticipantCard({ user, onBlock, isBlocking, onEdit }: ParticipantCardProps) {
  const avatarSrc = user.avatarUrl ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`;
  const blocked = user.isBlocked ?? false;

  return (
    <div className="flex-1 bg-white rounded-3xl p-5 flex items-start gap-4 shadow-sm border border-gray-50">
      <div className="relative flex-shrink-0">
        <img
          src={avatarSrc}
          alt={user.name}
          className="w-14 h-14 rounded-full object-cover bg-[#EAF3EF]"
        />
        {blocked && (
          <span className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-0.5">
            <ShieldOff size={10} className="text-white" />
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 truncate">{user.name || 'Невідомо'}</h3>
            <span className="inline-block mt-0.5 text-[10px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-md font-mono">
              {user.id.slice(0, 18)}…
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 shrink-0">
            {user.role === 'owner' ? 'Власник' : 'Сіттер'}
          </span>
        </div>

        {blocked && (
          <span className="inline-block mt-1 text-[10px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
            Заблокований
          </span>
        )}

        <div className="flex gap-2 mt-3">
          <button
            onClick={() => onEdit(user.id)}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors"
          >
            <UserCog size={12} />
            Профіль
          </button>
          <button
            onClick={() => onBlock(user.id, blocked)}
            disabled={isBlocking}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${
              blocked
                ? 'bg-green-50 hover:bg-green-100 text-green-700'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-700'
            }`}
          >
            {blocked ? <Shield size={12} /> : <ShieldOff size={12} />}
            {isBlocking ? '…' : blocked ? 'Розблокувати' : 'Заблокувати'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

interface ComplaintsPageProps {
  usersPath?: string;
}

export function ComplaintsPage({ usersPath = '/admin/users' }: ComplaintsPageProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [blockingUserId, setBlockingUserId] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const { data, isLoading, isError } = useAdminComplaints({
    page: 1,
    limit: 100,
    status: statusFilter,
    search: searchQuery.trim(),
  });

  const updateStatusMutation = useUpdateAdminComplaintStatusMutation();
  const blockMutation = useUpdateAdminUserStatusMutation();

  const complaints: AdminComplaint[] = data?.items ?? [];
  const activeCount = complaints.filter((c) => c.status === 'active').length;
  const selected = complaints.find((c) => c.id === selectedId) ?? complaints[0] ?? null;

  useEffect(() => {
    if (!selectedId && complaints.length > 0) setSelectedId(complaints[0].id);
    if (selectedId && complaints.length > 0 && !complaints.some((c) => c.id === selectedId))
      setSelectedId(complaints[0].id);
  }, [complaints, selectedId]);

  useEffect(() => { setPhotoIndex(0); }, [selectedId]);

  const handleBlock = (userId: string, currentlyBlocked: boolean) => {
    const newStatus = currentlyBlocked ? 'active' : 'blocked';
    setBlockingUserId(userId);
    blockMutation.mutate(
      { userId, payload: { status: newStatus } },
      {
        onSuccess: () => {
          toast.success(currentlyBlocked ? 'Користувача розблоковано' : 'Користувача заблоковано');
          setBlockingUserId(null);
        },
        onError: () => {
          toast.error('Помилка зміни статусу');
          setBlockingUserId(null);
        },
      },
    );
  };

  const handleEditProfile = (_userId: string) => {
    navigate({ to: usersPath as any });
    toast.info('Знайдіть користувача у списку користувачів');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-140px)] text-gray-600">
        Завантаження скарг...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-140px)] text-rose-600">
        Помилка при завантаженні скарг. Спробуйте перезавантажити сторінку.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">Управління скаргами</h1>
        <div className="relative w-80">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Пошук квитків модерації..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white rounded-full border border-gray-100 shadow-sm focus:outline-none focus:border-zoopsy-green-500 focus:ring-1 focus:ring-zoopsy-green-500 text-sm"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-6 flex-1 min-h-0">
        {/* LEFT COLUMN */}
        <div className="w-[340px] flex flex-col bg-white rounded-3xl p-5 shadow-sm min-h-0 shrink-0 border border-gray-50">
          {/* Header + count */}
          <div className="flex justify-between items-center mb-3 shrink-0">
            <h2 className="font-bold text-gray-900">Скарги</h2>
            {activeCount > 0 && (
              <span className="bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                {activeCount} активних
              </span>
            )}
          </div>

          {/* Status filter tabs */}
          <div className="flex gap-1 mb-3 shrink-0 flex-wrap">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                  statusFilter === f.value
                    ? 'bg-[#2C694E] text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="overflow-y-auto flex-1 pr-1 space-y-2 custom-scrollbar">
            {complaints.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">Скарг не знайдено</div>
            ) : (
              complaints.map((complaint) => {
                const isActive = selected?.id === complaint.id;
                return (
                  <div
                    key={complaint.id}
                    onClick={() => setSelectedId(complaint.id)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                      isActive
                        ? 'bg-zoopsy-mint border-zoopsy-green-200 shadow-sm'
                        : 'bg-gray-50 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between text-[11px] text-gray-500 mb-1.5 font-medium">
                      <span className={isActive ? 'text-zoopsy-green-800 font-bold' : ''}>
                        #{complaint.ticketId}
                      </span>
                      <div className="flex items-center gap-1">
                        <Clock size={11} />
                        <span>{fmtDate(complaint.createdAt)}</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-sm text-gray-900 leading-tight line-clamp-1">
                      {complaint.title}
                    </h3>
                    <p className="text-xs mt-1 line-clamp-2 text-gray-500">{complaint.shortDesc}</p>
                    <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-gray-200/60">
                      <div className="flex items-center gap-1.5">
                        <img
                          src={
                            complaint.owner?.avatarUrl ??
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${complaint.owner?.id}`
                          }
                          alt=""
                          className="w-5 h-5 rounded-full bg-[#EAF3EF]"
                        />
                        <span className="text-[11px] font-medium text-gray-600 truncate max-w-[100px]">
                          {complaint.owner?.name || 'Невідомо'}
                        </span>
                      </div>
                      <StatusBadge status={complaint.status} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex-1 flex flex-col gap-5 min-h-0 min-w-0">
          {selected ? (
            <>
              {/* Participant cards */}
              <div className="flex gap-5 shrink-0">
                <ParticipantCard
                  user={selected.owner}
                  onBlock={handleBlock}
                  isBlocking={blockingUserId === selected.owner?.id}
                  onEdit={handleEditProfile}
                />
                <ParticipantCard
                  user={selected.sitter}
                  onBlock={handleBlock}
                  isBlocking={blockingUserId === selected.sitter?.id}
                  onEdit={handleEditProfile}
                />
              </div>

              {/* Evidence gallery */}
              {(() => {
                const photos = selected.photos ?? [];
                const total = photos.length;
                const current = photos[photoIndex] ?? null;
                const hasGps = current && (current.lat !== 0 || current.lng !== 0);

                return (
                  <div className="flex flex-col bg-white rounded-3xl p-5 shadow-sm min-h-0 border border-gray-50 flex-1">
                    {/* Header */}
                    <div className="flex items-center justify-between shrink-0 mb-4">
                      <h3 className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                        Фотозвіти та докази
                      </h3>
                      <div className="flex items-center gap-2">
                        {total > 1 && (
                          <>
                            <button
                              onClick={() => setPhotoIndex((i) => Math.max(0, i - 1))}
                              disabled={photoIndex === 0}
                              className="p-0.5 rounded-full hover:bg-gray-100 disabled:opacity-30 transition-colors"
                            >
                              <ChevronLeft size={14} />
                            </button>
                            <span className="text-[11px] font-semibold text-gray-500">
                              {photoIndex + 1} / {total}
                            </span>
                            <button
                              onClick={() => setPhotoIndex((i) => Math.min(total - 1, i + 1))}
                              disabled={photoIndex === total - 1}
                              className="p-0.5 rounded-full hover:bg-gray-100 disabled:opacity-30 transition-colors"
                            >
                              <ChevronRight size={14} />
                            </button>
                          </>
                        )}
                        <span className="text-[10px] font-semibold text-gray-400 ml-1">
                          {total} {total === 1 ? 'фото' : 'фото'}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-5 flex-1 min-h-0">
                      {/* Photo */}
                      <div className="flex-1 flex items-center justify-center overflow-hidden">
                        {current ? (
                          <div
                            className="w-full h-full relative group cursor-zoom-in"
                            onClick={() => setLightboxOpen(true)}
                          >
                            <img
                              src={current.photoUrl}
                              alt={`Фото ${photoIndex + 1}`}
                              className="object-contain w-full h-full rounded-xl"
                            />
                            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/0 group-hover:bg-black/25 transition-colors">
                              <Expand size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                            </div>
                            {current.timestamp && (
                              <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full font-mono backdrop-blur-sm">
                                {new Date(current.timestamp).toLocaleString('uk-UA')}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center text-gray-300">
                            <ImageIcon size={36} className="mb-2" strokeWidth={1.5} />
                            <span className="text-xs font-medium">Фото не додано</span>
                          </div>
                        )}
                      </div>

                      {/* GPS info */}
                      {hasGps && current && (
                        <div className="w-[180px] shrink-0 flex flex-col gap-4 justify-center">
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                              <MapPin size={10} /> GPS
                            </p>
                            <p className="text-xs font-mono text-gray-700">{current.lat.toFixed(6)}</p>
                            <p className="text-xs font-mono text-gray-700">{current.lng.toFixed(6)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Цілісність</p>
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                              current.integrityStatus === 'Підтверджено' || current.integrityStatus === 'GPS наявний'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                              {current.integrityStatus}
                            </span>
                          </div>
                          {current.timestamp && (
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Час зйомки</p>
                              <p className="text-[11px] font-mono text-gray-700">
                                {new Date(current.timestamp).toLocaleString('uk-UA')}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Thumbnail strip for multiple photos */}
                    {total > 1 && (
                      <div className="flex gap-2 mt-3 shrink-0 overflow-x-auto pb-1">
                        {photos.map((p, i) => (
                          <button
                            key={i}
                            onClick={() => setPhotoIndex(i)}
                            className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                              i === photoIndex ? 'border-[#2C694E] opacity-100' : 'border-transparent opacity-50 hover:opacity-80'
                            }`}
                          >
                            <img src={p.photoUrl} alt={`thumb ${i + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Action buttons */}
              <div className="flex gap-4 shrink-0">
                {selected.status !== 'active' ? (
                  <div className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-center bg-gray-100 text-gray-500">
                    {selected.status === 'resolved' ? '✓ Скаргу вирішено' : '✗ Скаргу відхилено'}
                  </div>
                ) : (
                  <>
                    <button
                      className="flex-1 py-3.5 bg-zoopsy-green-700 text-white rounded-2xl text-sm font-bold shadow-sm hover:bg-zoopsy-green-800 hover:-translate-y-0.5 transition-all active:translate-y-0 disabled:opacity-50"
                      disabled={!selected.bookingId}
                      onClick={() => {
                        if (selected.bookingId) {
                          navigate({ to: '/admin/orders/$orderId' as any, params: { orderId: selected.bookingId } as any });
                        }
                      }}
                    >
                      Вирішити скаргу
                    </button>
                    <button
                      className="flex-1 py-3.5 bg-rose-900 text-white rounded-2xl text-sm font-bold shadow-sm hover:bg-rose-950 hover:-translate-y-0.5 transition-all active:translate-y-0 disabled:opacity-50"
                      disabled={updateStatusMutation.isPending}
                      onClick={() =>
                        updateStatusMutation.mutate(
                          { id: selected.id, status: 'rejected' },
                          {
                            onSuccess: () => toast.info('Скаргу відхилено'),
                            onError: () => toast.error('Помилка'),
                          },
                        )
                      }
                    >
                      Відхилити скаргу
                    </button>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 text-gray-400">
              Виберіть скаргу для перегляду
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && selected && (() => {
        const photos = selected.photos ?? [];
        const current = photos[photoIndex] ?? null;
        if (!current) return null;
        return (
          <div
            className="fixed inset-0 z-50 bg-black/92 flex flex-col items-center justify-center gap-3"
            onClick={() => setLightboxOpen(false)}
          >
            {/* Close */}
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
              onClick={() => setLightboxOpen(false)}
            >
              <X size={28} />
            </button>

            {/* Prev / Next */}
            {photos.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white disabled:opacity-20 transition-colors"
                  disabled={photoIndex === 0}
                  onClick={(e) => { e.stopPropagation(); setPhotoIndex((i) => Math.max(0, i - 1)); }}
                >
                  <ChevronLeft size={40} />
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white disabled:opacity-20 transition-colors"
                  disabled={photoIndex === photos.length - 1}
                  onClick={(e) => { e.stopPropagation(); setPhotoIndex((i) => Math.min(photos.length - 1, i + 1)); }}
                >
                  <ChevronRight size={40} />
                </button>
              </>
            )}

            <img
              src={current.photoUrl}
              alt={`Фото ${photoIndex + 1}`}
              className="max-w-[85vw] max-h-[78vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Meta bar */}
            <div
              className="flex items-center gap-5 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-2xl text-white text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              {photos.length > 1 && (
                <span className="font-semibold">{photoIndex + 1} / {photos.length}</span>
              )}
              {current.timestamp && (
                <span className="flex items-center gap-1.5 font-mono">
                  <Clock size={12} />
                  {new Date(current.timestamp).toLocaleString('uk-UA')}
                </span>
              )}
              {(current.lat !== 0 || current.lng !== 0) && (
                <span className="flex items-center gap-1.5 font-mono">
                  <MapPin size={12} />
                  {current.lat.toFixed(5)}, {current.lng.toFixed(5)}
                </span>
              )}
              {current.integrityStatus && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  current.integrityStatus === 'Підтверджено' || current.integrityStatus === 'GPS наявний'
                    ? 'bg-green-500/30 text-green-300'
                    : 'bg-amber-500/30 text-amber-300'
                }`}>
                  {current.integrityStatus}
                </span>
              )}
            </div>
          </div>
        );
      })()}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e5e7eb; border-radius: 20px; }
      `}</style>
    </div>
  );
}
