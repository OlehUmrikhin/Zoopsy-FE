import { Link } from '@tanstack/react-router';
import { MdStar } from 'react-icons/md';
import { useSitters } from '../../api/sitter';

const MEDAL_COLORS: Record<number, string> = {
  0: 'bg-yellow-400 text-white',
  1: 'bg-gray-300 text-white',
  2: 'bg-amber-600 text-white',
};

function experienceLabel(years: number): string {
  if (years === 1) return '1 рік досвіду';
  if (years >= 2 && years <= 4) return `${years} роки досвіду`;
  return `${years} років досвіду`;
}

export function TopSittersPage() {
  const { data, isLoading, isError } = useSitters({ pageSize: 20, page: 1 });

  const sitters = data?.items ?? [];

  return (
    <div className="min-h-screen bg-zoopsy-mint px-4 pb-16 pt-10">
      {/* Header */}
      <div className="text-center mb-10 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold font-plus-jakarta text-[#1a3a2a] leading-tight">
          Рейтинг найкращих
          <br />
          пет-сіттерів
        </h1>
        <p className="text-sm text-[#5a7a6a] font-inter mt-3">
          Відкрийте для себе найбільш кваліфікованих сіттерів у нашій спільноті, перевірених на
          досвідність та любов до тварин
        </p>
      </div>

      <div className="max-w-2xl mx-auto flex flex-col gap-3">
        {isLoading &&
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 flex items-center gap-4 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
              <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
              <div className="w-20 h-8 bg-gray-200 rounded-xl" />
            </div>
          ))}

        {isError && (
          <div className="text-center text-rose-600 py-10">
            Помилка завантаження. Спробуйте оновити сторінку.
          </div>
        )}

        {!isLoading && !isError && sitters.length === 0 && (
          <div className="text-center text-[#5a7a6a] py-10">Сіттерів поки немає</div>
        )}

        {!isLoading &&
          !isError &&
          sitters.map((sitter, index) => (
            <div
              key={sitter.userId}
              className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Rank */}
              <div
                className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold font-plus-jakarta ${
                  MEDAL_COLORS[index] ?? 'bg-[#EAF3EF] text-[#2C694E]'
                }`}
              >
                {index + 1}
              </div>

              {/* Avatar */}
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${sitter.userId}`}
                alt={sitter.fullName}
                className="w-12 h-12 rounded-full object-cover flex-shrink-0 bg-[#EAF3EF]"
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-bold font-plus-jakarta text-[#1a3a2a] text-sm leading-tight truncate">
                  {sitter.fullName || 'Сіттер'}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  <MdStar className="text-yellow-400 text-base flex-shrink-0" />
                  <span className="text-sm font-semibold text-[#1a3a2a]">
                    {sitter.rating > 0 ? sitter.rating.toFixed(1) : '—'}
                  </span>
                  {sitter.city && (
                    <>
                      <span className="text-[#9ab8a8] text-xs">•</span>
                      <span className="text-xs text-[#5a7a6a] font-inter truncate">
                        {sitter.city}
                      </span>
                    </>
                  )}
                  {sitter.experienceYears > 0 && (
                    <>
                      <span className="text-[#9ab8a8] text-xs">•</span>
                      <span className="text-xs text-[#5a7a6a] font-inter whitespace-nowrap">
                        {experienceLabel(sitter.experienceYears)}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <Link
                to="/sitter/$userId"
                params={{ userId: sitter.userId }}
                search={{ info: true }}
                className="flex-shrink-0 px-4 py-1.5 rounded-xl border border-[#2C694E] text-[#2C694E] text-xs font-semibold font-inter hover:bg-[#EAF3EF] transition-colors whitespace-nowrap"
              >
                Профіль
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}
