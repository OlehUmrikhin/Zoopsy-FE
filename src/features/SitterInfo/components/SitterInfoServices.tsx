import { MdHome } from 'react-icons/md';
import type { SitterService } from '@api/sitter/types';

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
  services: SitterService[];
};

export function SitterInfoServices({ services }: Props) {
  if (services.length === 0) return null;

  const uniqueServiceTypes = [...new Set(services.map((s) => s.serviceType))];

  return (
    <div className="bg-white rounded-2xl p-6">
      <h2 className="font-plus-jakarta font-bold text-zoopsy-dark-gray text-lg mb-4">
        Сервіси та ціни
      </h2>
      <div className="flex flex-col gap-3">
        {uniqueServiceTypes.map((type) => {
          const service = services.find((s) => s.serviceType === type)!;
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
                <span className="font-inter font-normal text-zoopsy-gray text-xs">/ год</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
