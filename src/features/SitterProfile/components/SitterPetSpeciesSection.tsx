import { Controller, useFormContext } from 'react-hook-form';
import { FaDog, FaCat, FaCheck } from 'react-icons/fa';
import cn from 'classnames';
import type { SitterProfileFormValues } from './SitterProfileForm';

const SPECIES_OPTIONS = [
  { value: 0, label: 'Собаки', Icon: FaDog },
  { value: 1, label: 'Коти', Icon: FaCat },
];

export function SitterPetSpeciesSection() {
  const { control } = useFormContext<SitterProfileFormValues>();

  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-zoopsy-dark-gray font-plus-jakarta">
          З якими тваринами працюєте?
        </h2>
        <p className="text-zoopsy-gray font-inter text-sm mt-1">
          Оберіть один або декілька варіантів
        </p>
      </div>

      <Controller
        name="petSpecies"
        control={control}
        render={({ field: { value, onChange } }) => (
          <div className="flex gap-4">
            {SPECIES_OPTIONS.map(({ value: species, label, Icon }) => {
              const selected = value.includes(species);
              return (
                <button
                  key={species}
                  type="button"
                  onClick={() => {
                    if (selected) {
                      onChange(value.filter((v: number) => v !== species));
                    } else {
                      onChange([...value, species].sort());
                    }
                  }}
                  className={cn(
                    'flex-1 relative flex flex-col items-center gap-3 rounded-2xl py-6 border-2 transition-colors',
                    selected
                      ? 'bg-zoopsy-green-100 border-zoopsy-green-900 text-zoopsy-green-900'
                      : 'bg-zoopsy-mint border-transparent text-zoopsy-dark-gray hover:border-zoopsy-green-500',
                  )}
                >
                  {selected && (
                    <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-zoopsy-green-900 text-white flex items-center justify-center">
                      <FaCheck className="text-[9px]" />
                    </span>
                  )}
                  <Icon className="text-3xl" />
                  <span className="font-inter font-semibold text-sm">{label}</span>
                </button>
              );
            })}
          </div>
        )}
      />
    </div>
  );
}
