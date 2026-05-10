import { MdStar } from 'react-icons/md'
import cn from 'classnames'
import type { SitterSearchResult } from '@api/sitter/types'

const SERVICE_TYPE_LABELS: Record<number, string> = {
  0: 'Перетримка',
  1: 'Прогулянка',
  2: 'Грумерство',
  3: 'Ветеринарство',
}

const BADGE_COLORS: Record<number, string> = {
  0: 'bg-zoopsy-green-100 text-zoopsy-green-900',
  1: 'bg-blue-100 text-blue-700',
  2: 'bg-purple-100 text-purple-700',
  3: 'bg-orange-100 text-orange-700',
}

type SitterCardProps = {
  sitter: SitterSearchResult
}

export function SitterCard({ sitter }: SitterCardProps) {
  const minPrice = sitter.services.length
    ? Math.min(...sitter.services.map((s) => s.pricePerUnit))
    : null

  const uniqueServiceTypes = [...new Set(sitter.services.map((s) => s.serviceType))]

  return (
    <div className="bg-white rounded-2xl p-4 flex gap-4 hover:shadow-md transition-shadow">
      {/* Avatar */}
      <div className="w-20 h-20 rounded-xl bg-zoopsy-mint flex-shrink-0 overflow-hidden">
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${sitter.userId}`}
          alt={sitter.fullName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-plus-jakarta font-bold text-zoopsy-dark-gray text-base leading-tight">
              {sitter.fullName}
            </h3>
            <div className="flex items-center gap-1 mt-0.5">
              <MdStar className="text-yellow-400 text-sm flex-shrink-0" />
              <span className="font-inter text-sm font-semibold text-zoopsy-dark-gray">
                {sitter.rating?.toFixed(1) ?? '—'}
              </span>
              <span className="font-inter text-xs text-zoopsy-gray">{sitter.city}</span>
            </div>
          </div>

          {minPrice !== null && (
            <div className="text-right flex-shrink-0">
              <span className="font-plus-jakarta font-bold text-zoopsy-dark-gray text-lg">
                {minPrice}
              </span>
              <span className="font-inter text-xs text-zoopsy-gray"> грн/год</span>
            </div>
          )}
        </div>

        {sitter.description && (
          <p className="font-inter text-sm text-zoopsy-gray mt-1.5 line-clamp-2">
            {sitter.description}
          </p>
        )}

        {/* Service badges */}
        {uniqueServiceTypes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {uniqueServiceTypes.map((type) => (
              <span
                key={type}
                className={cn(
                  'text-[10px] font-inter font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full',
                  BADGE_COLORS[type] ?? 'bg-zoopsy-mint text-zoopsy-dark-gray',
                )}
              >
                {SERVICE_TYPE_LABELS[type] ?? `Послуга ${type}`}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
