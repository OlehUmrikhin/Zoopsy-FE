import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { MdFitnessCenter } from 'react-icons/md'
import { FaDog, FaCheck } from 'react-icons/fa'
import cn from 'classnames'
import type { SitterProfileFormValues } from './SitterProfileForm'

const WEIGHT_CATEGORIES = [
  { value: 0, label: 'Малі', description: 'до 10 кг', iconSize: 'text-lg' },
  { value: 1, label: 'Середні', description: '10–25 кг', iconSize: 'text-2xl' },
  { value: 2, label: 'Великі', description: 'понад 25 кг', iconSize: 'text-4xl' },
]

export function SitterDogWeightSection() {
  const { control } = useFormContext<SitterProfileFormValues>()
  const petSpecies = useWatch<SitterProfileFormValues, 'petSpecies'>({ name: 'petSpecies' })

  if (!petSpecies.includes(0)) return null


  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <MdFitnessCenter className="text-zoopsy-green-500 text-xl" />
        <h2 className="text-lg font-semibold text-zoopsy-dark-gray font-plus-jakarta">
          Вага собак, з якими працюю
        </h2>
      </div>

      <Controller
        name="dogWeightPreferences"
        control={control}
        render={({ field: { value, onChange } }) => (
          <div className="grid grid-cols-3 gap-3">
            {WEIGHT_CATEGORIES.map((cat) => {
              const selected = value.includes(cat.value)
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => {
                    if (selected) {
                      onChange(value.filter((v: number) => v !== cat.value))
                    } else {
                      onChange([...value, cat.value].sort())
                    }
                  }}
                  className={cn(
                    'relative rounded-xl p-4 flex flex-col items-center gap-2 border-2 transition-colors',
                    selected
                      ? 'bg-zoopsy-green-100 border-zoopsy-green-900 text-zoopsy-green-900'
                      : 'bg-zoopsy-mint border-transparent text-zoopsy-dark-gray hover:border-zoopsy-green-500',
                  )}
                >
                  {selected && (
                    <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-zoopsy-green-900 text-white flex items-center justify-center">
                      <FaCheck className="text-[8px]" />
                    </span>
                  )}
                  <FaDog className={cn(cat.iconSize)} />
                  <span className="font-inter font-semibold text-sm">{cat.label}</span>
                  <span className="font-inter text-[14px] text-zoopsy-gray">{cat.description}</span>
                </button>
              )
            })}
          </div>
        )}
      />
    </div>
  )
}
