import { useState } from 'react';
import { MdLocationOn, MdStar, MdHome } from 'react-icons/md';
import { useSitterById } from '@api/sitter/queries';

const SERVICE_TYPE_LABELS: Record<number, string> = {
  0: 'Перетримка',
  1: 'Вигул',
  2: 'Грумерство',
  3: 'Ветеринарство',
};

const SERVICE_TYPE_DESCRIPTIONS: Record<number, string> = {
  0: 'В моєму дружному домі',
  1: 'Приватна прогулянка для вашого улюбленця',
  2: 'Догляд за шерстю',
  3: 'Медична консультація',
};

type Props = {
  userId: string;
};

export function SitterInfoPage({ userId }: Props) {
  const { data: sitter, isLoading } = useSitterById(userId);

  const [selectedServiceType, setSelectedServiceType] = useState<number | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zoopsy-mint flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-zoopsy-green-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!sitter) {
    return (
      <div className="min-h-screen bg-zoopsy-mint flex items-center justify-center">
        <p className="font-inter text-zoopsy-gray">Профіль не знайдено</p>
      </div>
    );
  }

  const uniqueServiceTypes = [...new Set(sitter.services.map((s) => s.serviceType))];

  const selectedService = sitter.services.find((s) => s.serviceType === selectedServiceType);
  const effectiveService = selectedService ?? sitter.services[0];

  const totalHours =
    startDate && endDate
      ? Math.max(
          0,
          Math.round(
            (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60),
          ),
        )
      : null;

  const totalPrice =
    totalHours && effectiveService ? totalHours * effectiveService.pricePerUnit : null;

  return (
    <div className="min-h-screen bg-zoopsy-mint py-8 px-4">
      <div className="max-w-5xl mx-auto flex gap-8 items-start">
        {/* Left column */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Header */}
          <div className="bg-white rounded-2xl p-6 flex items-center gap-5">
            <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${sitter.userId}`}
                alt={sitter.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="font-plus-jakarta font-bold text-zoopsy-dark-gray text-2xl">
                {sitter.fullName}
              </h1>
              <div className="flex items-center gap-1 mt-1 text-zoopsy-gray font-inter text-sm">
                <MdLocationOn className="text-base flex-shrink-0" />
                <span>{sitter.city}</span>
              </div>
              {sitter.rating > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <MdStar className="text-yellow-400 text-base" />
                  <span className="font-inter font-semibold text-zoopsy-dark-gray text-sm">
                    {sitter.rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* About */}
          {sitter.description && (
            <div className="bg-white rounded-2xl p-6">
              <h2 className="font-plus-jakarta font-bold text-zoopsy-dark-gray text-lg mb-3">
                Про мене:
              </h2>
              <p className="font-inter text-zoopsy-gray text-sm leading-relaxed">
                {sitter.description}
              </p>
            </div>
          )}

          {/* Services & Prices */}
          {sitter.services.length > 0 && (
            <div className="bg-white rounded-2xl p-6">
              <h2 className="font-plus-jakarta font-bold text-zoopsy-dark-gray text-lg mb-4">
                Сервіси та ціни
              </h2>
              <div className="flex flex-col gap-3">
                {uniqueServiceTypes.map((type) => {
                  const service = sitter.services.find((s) => s.serviceType === type)!;
                  return (
                    <div
                      key={type}
                      className="flex items-center gap-4 p-4 rounded-xl border border-zoopsy-light-gray/40 hover:border-zoopsy-green-300 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-zoopsy-mint flex items-center justify-center flex-shrink-0">
                        <MdHome className="text-zoopsy-green-600 text-xl" />
                      </div>
                      <div className="flex-1">
                        <p className="font-inter font-semibold text-zoopsy-dark-gray text-sm">
                          {SERVICE_TYPE_LABELS[type] ?? `Послуга ${type}`}
                        </p>
                        <p className="font-inter text-zoopsy-gray text-xs mt-0.5">
                          {SERVICE_TYPE_DESCRIPTIONS[type] ?? ''}
                        </p>
                      </div>
                      <span className="font-plus-jakarta font-bold text-zoopsy-green-600 text-base whitespace-nowrap">
                        {service.pricePerUnit}₴{' '}
                        <span className="font-inter font-normal text-zoopsy-gray text-xs">
                          / год
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right column — Booking widget */}
        <div className="w-80 flex-shrink-0 bg-white rounded-2xl p-6 flex flex-col gap-4 sticky top-24">
          {effectiveService && (
            <div className="flex items-baseline gap-1">
              <span className="font-plus-jakarta font-bold text-zoopsy-dark-gray text-3xl">
                {effectiveService.pricePerUnit}₴
              </span>
              <span className="font-inter text-zoopsy-gray text-sm">/ година</span>
            </div>
          )}

          {/* Service selector */}
          <div>
            <label className="font-inter text-xs font-semibold text-zoopsy-gray uppercase tracking-wide mb-1.5 block">
              Сервіс
            </label>
            <select
              className="w-full rounded-xl border border-zoopsy-light-gray/60 bg-zoopsy-mint font-inter text-sm text-zoopsy-dark-gray px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zoopsy-green-400"
              value={selectedServiceType ?? uniqueServiceTypes[0] ?? ''}
              onChange={(e) => setSelectedServiceType(Number(e.target.value))}
            >
              {uniqueServiceTypes.map((type) => (
                <option key={type} value={type}>
                  {SERVICE_TYPE_LABELS[type] ?? `Послуга ${type}`}
                </option>
              ))}
            </select>
          </div>

          {/* Date range */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="font-inter text-xs font-semibold text-zoopsy-gray uppercase tracking-wide mb-1.5 block">
                Дата початку
              </label>
              <input
                type="datetime-local"
                className="w-full rounded-xl border border-zoopsy-light-gray/60 bg-zoopsy-mint font-inter text-xs text-zoopsy-dark-gray px-3 py-3 focus:outline-none focus:ring-2 focus:ring-zoopsy-green-400"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="font-inter text-xs font-semibold text-zoopsy-gray uppercase tracking-wide mb-1.5 block">
                Дата закінчення
              </label>
              <input
                type="datetime-local"
                className="w-full rounded-xl border border-zoopsy-light-gray/60 bg-zoopsy-mint font-inter text-xs text-zoopsy-dark-gray px-3 py-3 focus:outline-none focus:ring-2 focus:ring-zoopsy-green-400"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <button className="w-full bg-zoopsy-green-500 hover:bg-zoopsy-green-600 text-white font-plus-jakarta font-bold rounded-xl py-3.5 transition-colors">
            Забронювати
          </button>

          {/* Price breakdown */}
          {totalPrice !== null && effectiveService && (
            <div className="border-t border-zoopsy-light-gray/40 pt-4 flex flex-col gap-2">
              <div className="flex justify-between font-inter text-sm text-zoopsy-gray">
                <span>
                  {effectiveService.pricePerUnit}x{totalHours}
                </span>
                <span>{totalPrice}₴</span>
              </div>
              <div className="flex justify-between font-plus-jakarta font-bold text-zoopsy-dark-gray text-base">
                <span>Разом</span>
                <span>{totalPrice}₴</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
