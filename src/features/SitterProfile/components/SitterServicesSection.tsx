import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { MdOutlineHandshake } from 'react-icons/md';
import { FaCheck } from 'react-icons/fa';
import cn from 'classnames';
import { ZoopsyInput } from '@features/OwnerProfile/components/ZoopsyInput';
import {
  DOG_SERVICE_DEFS,
  CAT_SERVICE_DEFS,
  type SitterProfileFormValues,
  type ServiceFormEntry,
} from './SitterProfileForm';

type ServiceRowsProps = {
  fieldName: 'dogServices' | 'catServices';
  defs: typeof DOG_SERVICE_DEFS;
};

function ServiceRows({ fieldName, defs }: ServiceRowsProps) {
  const { control, register, watch } = useFormContext<SitterProfileFormValues>();
  const entries = watch(fieldName) as ServiceFormEntry[];

  return (
    <div className="grid grid-cols-2 gap-3">
      {defs.map((def, idx) => {
        const enabled = entries?.[idx]?.enabled ?? false;

        return (
          <div
            key={def.serviceType}
            className={cn(
              'rounded-xl p-3 flex items-center gap-3 transition-colors bg-zoopsy-green-100 border ',
              enabled ? 'border-zoopsy-green-500' : 'border-grey',
            )}
          >
            <Controller
              name={`${fieldName}.${idx}.enabled` as const}
              control={control}
              render={({ field: { value, onChange } }) => (
                <button
                  type="button"
                  onClick={() => onChange(!value)}
                  className={cn(
                    'w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center transition-colors border-2',
                    value
                      ? 'bg-zoopsy-green-900 border-zoopsy-green-900 text-white'
                      : 'bg-white border-zoopsy-gray',
                  )}
                >
                  {value && <FaCheck className="text-[10px]" />}
                </button>
              )}
            />
            <div className="flex-1 min-w-0">
              <p className="font-inter text-sm font-medium text-zoopsy-dark-gray truncate">
                {def.label}
              </p>
            </div>
            <ZoopsyInput
              placeholder="0"
              type="number"
              min={0}
              wrapperClassName="w-40 flex-shrink-0"
              endContent={<span className="text-[10px] text-zoopsy-gray">грн</span>}
              {...register(`${fieldName}.${idx}.pricePerUnit` as const)}
            />
            {/* hidden field to carry serviceType */}
            <input type="hidden" {...register(`${fieldName}.${idx}.serviceType` as const)} />
          </div>
        );
      })}
    </div>
  );
}

export function SitterServicesSection() {
  const petSpecies = useWatch<SitterProfileFormValues, 'petSpecies'>({ name: 'petSpecies' });
  const hasDogs = petSpecies.includes(0);
  const hasCats = petSpecies.includes(1);

  if (!hasDogs && !hasCats) return null;

  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <MdOutlineHandshake className="text-zoopsy-green-500 text-xl" />
        <h2 className="text-lg font-semibold text-zoopsy-dark-gray font-plus-jakarta">
          Послуги та ставки (UAH/год)
        </h2>
      </div>

      <div className="flex flex-col gap-6">
        {hasDogs && (
          <div>
            <p className="text-[10px] uppercase tracking-widest font-inter font-semibold text-zoopsy-gray mb-3">
              Для собак
            </p>
            <ServiceRows fieldName="dogServices" defs={DOG_SERVICE_DEFS} />
          </div>
        )}

        {hasCats && (
          <div>
            <p className="text-[10px] uppercase tracking-widest font-inter font-semibold text-zoopsy-gray mb-3">
              Для котів
            </p>
            <ServiceRows fieldName="catServices" defs={CAT_SERVICE_DEFS} />
          </div>
        )}
      </div>
    </div>
  );
}
