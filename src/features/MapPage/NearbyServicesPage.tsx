import { useState, useCallback } from 'react';
import { Link } from '@tanstack/react-router';
import { MdMyLocation, MdStar } from 'react-icons/md';
import { useSitters } from '../../api/sitter';
import type { SitterSearchResult } from '../../api/sitter/types';
import { SittersMap } from '../FindSitter/components/SittersMap';
import { SERVICE_TYPE_LABELS } from '../../constants/serviceTypes';

const SERVICE_FILTERS = [
  { value: null, label: 'Всі' },
  { value: 0, label: 'Перетримка' },
  { value: 1, label: 'Вигул' },
  { value: 2, label: 'Грумерство' },
  { value: 3, label: 'Ветеринарство' },
];

export function NearbyServicesPage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const [serviceType, setServiceType] = useState<number | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const { data, isLoading } = useSitters({
    pageSize: 50,
    page: 1,
    ...(serviceType !== null ? { serviceType } : {}),
  });

  const sitters: SitterSearchResult[] = data?.items ?? [];
  const sittersWithCoords = sitters.filter((s) => s.latitude != null && s.longitude != null);

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) {
      setLocError('Геолокація не підтримується вашим браузером');
      return;
    }
    setLocating(true);
    setLocError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setLocError('Не вдалось визначити місцезнаходження');
        setLocating(false);
      },
      { timeout: 10000 },
    );
  }, []);

  const highlighted = highlightedId ? sitters.find((s) => s.userId === highlightedId) : null;

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - var(--site-header-height))' }}>
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-5 py-3 flex items-center gap-3 flex-shrink-0 flex-wrap">
        <span className="font-plus-jakarta font-bold text-[#2C694E] text-base">
          Найближчі сервіси
        </span>

        {/* Service type pills */}
        <div className="flex items-center gap-2 flex-wrap flex-1">
          {SERVICE_FILTERS.map((f) => (
            <button
              key={String(f.value)}
              onClick={() => setServiceType(f.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold font-inter transition-colors ${
                serviceType === f.value
                  ? 'bg-[#2C694E] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Locate button */}
        <div className="flex flex-col items-end gap-0.5">
          <button
            onClick={handleLocate}
            disabled={locating}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#EAF3EF] text-[#2C694E] text-xs font-semibold font-inter hover:bg-[#d5ece3] transition-colors disabled:opacity-50"
          >
            <MdMyLocation size={15} className={locating ? 'animate-pulse' : ''} />
            {locating ? 'Визначаємо...' : 'Знайти мене'}
          </button>
          {locError && <span className="text-[10px] text-rose-500">{locError}</span>}
          {userLocation && !locating && (
            <span className="text-[10px] text-[#2C694E]">✓ Місце визначено</span>
          )}
        </div>
      </div>

      {/* Main: Map + Side panel */}
      <div className="flex flex-1 min-h-0">
        {/* Map */}
        <div className="flex-1 relative min-h-0">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
              <div className="w-8 h-8 rounded-full border-4 border-[#2C694E] border-t-transparent animate-spin" />
            </div>
          )}
          <SittersMap
            sitters={sitters}
            highlightedSitterId={highlightedId}
            onSitterClick={setHighlightedId}
            userLocation={userLocation}
          />
        </div>

        {/* Side panel */}
        <div className="w-[340px] flex-shrink-0 flex flex-col bg-white border-l border-gray-100 min-h-0">
          {/* Selected sitter card */}
          {highlighted && (
            <div className="border-b border-gray-100 p-4 bg-[#EAF3EF]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#2C694E] mb-2">
                Обрано
              </p>
              <SitterListCard sitter={highlighted} />
            </div>
          )}

          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
            <p className="font-plus-jakarta font-bold text-gray-900 text-sm">
              Сіттери на карті{' '}
              <span className="font-normal text-gray-500 font-inter">
                ({sittersWithCoords.length})
              </span>
            </p>
            {sitters.length > sittersWithCoords.length && (
              <p className="text-[11px] text-gray-400 font-inter mt-0.5">
                {sitters.length - sittersWithCoords.length} сіттерів без геолокації не показані
              </p>
            )}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {sitters.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm gap-2">
                <p>Сіттерів не знайдено</p>
              </div>
            )}
            {sitters.map((sitter) => (
              <div
                key={sitter.userId}
                className={`border-b border-gray-50 transition-colors ${
                  highlightedId === sitter.userId ? 'bg-[#EAF3EF]' : 'hover:bg-gray-50'
                }`}
                onMouseEnter={() => setHighlightedId(sitter.userId)}
                onMouseLeave={() => setHighlightedId(null)}
              >
                <div className="p-3">
                  <SitterListCard sitter={sitter} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SitterListCard({ sitter }: { sitter: SitterSearchResult }) {
  const minPrice = sitter.services.length
    ? Math.min(...sitter.services.map((s) => s.pricePerUnit))
    : null;

  const uniqueTypes = [...new Set(sitter.services.map((s) => s.serviceType))];

  return (
    <Link
      to="/sitter/$userId"
      params={{ userId: sitter.userId }}
      search={{ info: false }}
      className="flex gap-3 group"
    >
      <img
        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${sitter.userId}`}
        alt={sitter.fullName}
        className="w-11 h-11 rounded-full object-cover bg-[#EAF3EF] flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1">
          <p className="font-plus-jakarta font-bold text-gray-900 text-sm leading-tight truncate group-hover:text-[#2C694E] transition-colors">
            {sitter.fullName || 'Сіттер'}
          </p>
          {minPrice !== null && (
            <span className="font-inter text-xs font-bold text-gray-700 flex-shrink-0">
              від {minPrice} ₴
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <MdStar className="text-yellow-400 text-xs flex-shrink-0" />
          <span className="font-inter text-xs font-semibold text-gray-700">
            {sitter.rating > 0 ? sitter.rating.toFixed(1) : '—'}
          </span>
          {sitter.city && (
            <span className="font-inter text-xs text-gray-400 truncate">• {sitter.city}</span>
          )}
        </div>
        {uniqueTypes.length > 0 && (
          <div className="flex gap-1 mt-1 flex-wrap">
            {uniqueTypes.slice(0, 2).map((t) => (
              <span
                key={t}
                className="text-[9px] font-inter font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-[#EAF3EF] text-[#2C694E]"
              >
                {SERVICE_TYPE_LABELS[t] ?? `#${t}`}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
