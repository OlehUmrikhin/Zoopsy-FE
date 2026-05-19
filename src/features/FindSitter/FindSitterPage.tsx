import { useState } from 'react'
import { useSitters } from '@api'
import type { SitterSearchParams } from '@api/sitter/types'
import { SitterFilters } from './components/SitterFilters'
import { SitterCard } from './components/SitterCard'
import { SittersMap } from './components/SittersMap'
import { MapStub } from './components/MapStub'

type Props = {
  initialParams?: SitterSearchParams
}

export function FindSitterPage({ initialParams }: Props = {}) {
  const [params, setParams] = useState<SitterSearchParams>(initialParams ?? {})
  const [highlightedSitterId, setHighlightedSitterId] = useState<string | null>(null)
  const { data: sitters, isLoading } = useSitters(params)

  return (
    <div className="min-h-screen bg-zoopsy-mint flex">
      {/* Filters sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-zoopsy-light-gray/40 p-5 overflow-y-auto">
        <SitterFilters onChange={setParams} initialValues={initialParams} />
      </aside>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-4">
          <SittersMap
            sitters={sitters?.items ?? []}
            highlightedSitterId={highlightedSitterId}
            onSitterClick={setHighlightedSitterId}
          />
          {/* <MapStub />  */}
          {/* stub */}
        </div>

        {/* Results panel */}
        <div className="w-[380px] flex-shrink-0 flex flex-col bg-white border-l border-zoopsy-light-gray/40">
          <div className="p-4 border-b border-zoopsy-light-gray/40">
            <h2 className="font-plus-jakarta font-bold text-zoopsy-dark-gray text-lg">
              Результати пошуку
            </h2>
            {!isLoading && sitters && (
              <p className="font-inter text-sm text-zoopsy-gray mt-0.5">
                Знайдено: {sitters.totalCount}
              </p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {isLoading && (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 rounded-full border-4 border-zoopsy-green-500 border-t-transparent animate-spin" />
              </div>
            )}

            {!isLoading && sitters?.items.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="font-inter font-semibold text-zoopsy-dark-gray">Нічого не знайдено</p>
                <p className="font-inter text-sm text-zoopsy-gray mt-1">
                  Спробуйте змінити фільтри
                </p>
              </div>
            )}

            {!isLoading &&
              sitters?.items.map((sitter) => (
                <div
                  key={sitter.userId}
                  onMouseEnter={() => setHighlightedSitterId(sitter.userId)}
                  onMouseLeave={() => setHighlightedSitterId(null)}
                >
                  <SitterCard sitter={sitter} />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
