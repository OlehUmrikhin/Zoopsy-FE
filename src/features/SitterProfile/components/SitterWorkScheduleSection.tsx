import { Controller, useFormContext } from 'react-hook-form'
import cn from 'classnames'
import { TimeField } from '@heroui/react'
import { parseTime } from '@internationalized/date'
import type { TimeValue } from 'react-aria-components'
import type { SitterProfileFormValues } from './SitterProfileForm'

function timeFromString(value: string): TimeValue | null {
  try { return parseTime(value) } catch { return null }
}

function timeToString(value: TimeValue): string {
  return `${String(value.hour).padStart(2, '0')}:${String(value.minute).padStart(2, '0')}`
}

const DAYS = [
  { value: 0, label: 'Пн' },
  { value: 1, label: 'Вт' },
  { value: 2, label: 'Ср' },
  { value: 3, label: 'Чт' },
  { value: 4, label: 'Пт' },
  { value: 5, label: 'Сб' },
  { value: 6, label: 'Нд' },
]

export function SitterWorkScheduleSection() {
  const { control } = useFormContext<SitterProfileFormValues>()

  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Day selector */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-widest font-inter font-semibold text-zoopsy-gray">
            Графік роботи
          </span>
          <Controller
            name="workDays"
            control={control}
            render={({ field: { value, onChange } }) => (
              <div className="flex flex-wrap gap-2">
                {DAYS.map((day) => {
                  const selected = value?.includes(day.value)
                  return (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => {
                        if (selected) {
                          onChange(value.filter((d: number) => d !== day.value))
                        } else {
                          onChange([...value, day.value].sort())
                        }
                      }}
                      className={cn(
                        'w-11 h-11 rounded-full font-inter text-sm font-semibold transition-colors border-2',
                        selected
                          ? 'bg-zoopsy-green-900 border-zoopsy-green-900 text-white'
                          : 'bg-white border-zoopsy-light-gray text-zoopsy-dark-gray hover:border-zoopsy-green-500',
                      )}
                    >
                      {day.label}
                    </button>
                  )
                })}
              </div>
            )}
          />
        </div>

        {/* Time range */}
        <div className="flex flex-col gap-3">
          <span className="text-[10px] uppercase tracking-widest font-inter font-semibold text-zoopsy-gray">
            Час роботи
          </span>
          <Controller
            name="workStartTime"
            control={control}
            render={({ field: { value, onChange } }) => (
              <TimeField
                value={timeFromString(value)}
                onChange={(v) => v && onChange(timeToString(v))}
                className="w-full"
              >
                <TimeField.Group className="bg-zoopsy-mint rounded-2xl h-12 px-4 w-full flex items-center gap-3">
                  <TimeField.Prefix>
                    <span className="text-zoopsy-gray font-inter text-sm w-6">від</span>
                  </TimeField.Prefix>
                  <TimeField.Input>
                    {(segment) => (
                      <TimeField.Segment
                        segment={segment}
                        className="text-zoopsy-dark-gray font-inter font-semibold text-base tabular-nums outline-none rounded px-0.5 focus:bg-zoopsy-green-100"
                      />
                    )}
                  </TimeField.Input>
                </TimeField.Group>
              </TimeField>
            )}
          />
          <Controller
            name="workEndTime"
            control={control}
            render={({ field: { value, onChange } }) => (
              <TimeField
                value={timeFromString(value)}
                onChange={(v) => v && onChange(timeToString(v))}
                className="w-full"
              >
                <TimeField.Group className="bg-zoopsy-mint rounded-2xl h-12 px-4 w-full flex items-center gap-3">
                  <TimeField.Prefix>
                    <span className="text-zoopsy-gray font-inter text-sm w-6">до</span>
                  </TimeField.Prefix>
                  <TimeField.Input>
                    {(segment) => (
                      <TimeField.Segment
                        segment={segment}
                        className="text-zoopsy-dark-gray font-inter font-semibold text-base tabular-nums outline-none rounded px-0.5 focus:bg-zoopsy-green-100"
                      />
                    )}
                  </TimeField.Input>
                </TimeField.Group>
              </TimeField>
            )}
          />
        </div>
      </div>
    </div>
  )
}
