import { useForm, Controller } from 'react-hook-form';
import cn from 'classnames';
import { Button, Spinner } from '@heroui/react';
import { CitySelect } from '@components';
import { ZoopsyInput } from '@features/OwnerProfile/components/ZoopsyInput';
import type { SitterSearchParams } from '@api/sitter/types';
import { DateRangeFilter } from './DateRangeFilter';

const SERVICE_TYPES = [
  { value: 0, label: 'Перетримка' },
  { value: 1, label: 'Прогулянка' },
  { value: 2, label: 'Грумерство' },
  { value: 3, label: 'Ветеринарство' },
];

const PET_SPECIES = [
  { value: 0, label: 'Собаки' },
  { value: 1, label: 'Коти' },
];

const HOUSING_TYPES = [
  { value: 'apartment', label: 'Квартира' },
  { value: 'studio', label: 'Студія' },
  { value: 'house', label: 'Власний будинок' },
];

const GENDERS = [
  { value: 'male', label: 'Чоловік' },
  { value: 'female', label: 'Жінка' },
];

const EXPERIENCE_OPTIONS = [
  { value: 0, label: 'Будь-який' },
  { value: 1, label: '1+ рік' },
  { value: 3, label: '3+ роки' },
  { value: 5, label: '5+ років' },
];

const DOG_WEIGHT_CATEGORIES = [
  { value: 0, label: 'Малі (до 10 кг)' },
  { value: 1, label: 'Середні (10–25 кг)' },
  { value: 2, label: 'Великі (понад 25 кг)' },
];

export type FilterFormValues = {
  minPrice: string;
  maxPrice: string;
  serviceType: number | null;
  petSpecies: number | null;
  housingType: string | null;
  minExperienceYears: number | null;
  gender: string | null;
  dogWeightCategory: number | null;
  city: string;
  startDate: string;
  endDate: string;
};

type Props = {
  onChange: (params: SitterSearchParams) => void;
  initialValues?: SitterSearchParams;
  isLoading?: boolean;
};

function RadioOption<T extends string | number>({
  label,
  value,
  selected,
  onSelect,
}: {
  label: string;
  value: T;
  selected: boolean;
  onSelect: (value: T | null) => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <button
        type="button"
        onClick={() => onSelect(selected ? null : value)}
        className={cn(
          'w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-colors',
          selected
            ? 'border-zoopsy-green-900 bg-zoopsy-green-900'
            : 'bg-white border-zoopsy-gray group-hover:border-zoopsy-green-500',
        )}
      >
        {selected && <span className="w-2 h-2 rounded-full bg-white block" />}
      </button>
      <span className="font-inter text-sm text-zoopsy-dark-gray">{label}</span>
    </label>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-[10px] uppercase tracking-widest font-inter font-semibold text-zoopsy-gray">
        {title}
      </p>
      {children}
    </div>
  );
}

export function SitterFilters({ onChange, initialValues, isLoading }: Props) {
  const { register, control, watch, handleSubmit, setValue } = useForm<FilterFormValues>({
    defaultValues: {
      minPrice: initialValues?.minPrice?.toString() ?? '',
      maxPrice: initialValues?.maxPrice?.toString() ?? '',
      serviceType: initialValues?.serviceType ?? null,
      petSpecies: initialValues?.petSpecies ?? null,
      housingType: initialValues?.housingType ?? null,
      minExperienceYears: initialValues?.minExperienceYears ?? null,
      gender: initialValues?.gender ?? null,
      dogWeightCategory: initialValues?.dogWeightCategory ?? null,
      city: initialValues?.city ?? '',
      startDate: initialValues?.startDate ?? '',
      endDate: initialValues?.endDate ?? '',
    },
  });

  const onSubmit = handleSubmit((values) => {
    const params: SitterSearchParams = {};
    if (values.minPrice) params.minPrice = Number(values.minPrice);
    if (values.maxPrice) params.maxPrice = Number(values.maxPrice);
    if (values.serviceType !== null) params.serviceType = values.serviceType;
    if (values.petSpecies !== null) params.petSpecies = values.petSpecies;
    if (values.housingType) params.housingType = values.housingType;
    if (values.minExperienceYears !== null) params.minExperienceYears = values.minExperienceYears;
    if (values.gender) params.gender = values.gender;
    if (values.dogWeightCategory !== null) params.dogWeightCategory = values.dogWeightCategory;
    if (values.city) params.city = values.city;
    if (values.startDate) params.startDate = values.startDate;
    if (values.endDate) params.endDate = values.endDate;
    onChange(params);
  });

  const petSpecies = watch('petSpecies');
  const city = watch('city');
  const serviceType = watch('serviceType');
  const isBoarding = serviceType === 0;

  const isSubmitDisabled = !city || serviceType === null;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <h2 className="font-plus-jakarta font-bold text-zoopsy-dark-gray text-lg">Фільтри</h2>

      <Controller
        name="city"
        control={control}
        render={({ field: { value, onChange } }) => (
          <FilterGroup title="МІСТО">
            <CitySelect
              value={value}
              onChange={onChange}
              className="w-full"
              triggerClassName="bg-zoopsy-mint rounded-xl h-12 px-3 w-full flex items-center justify-between gap-2 text-zoopsy-dark-gray font-inter text-sm outline-none data-[hovered]:bg-zoopsy-mint/80 data-[pressed]:bg-zoopsy-mint/80"
            />
          </FilterGroup>
        )}
      />

      <FilterGroup title="Дата">
        <DateRangeFilter
          key={String(serviceType)}
          isBoarding={isBoarding}
          isDisabled={serviceType === null}
          startDate={initialValues?.startDate}
          endDate={initialValues?.endDate}
          onChange={(s, e) => {
            setValue('startDate', s ?? '');
            setValue('endDate', e ?? '');
          }}
        />
      </FilterGroup>

      {/* Price */}
      <FilterGroup title="Ціна (грн/год)">
        <div className="grid grid-cols-2 gap-2">
          <ZoopsyInput
            label="від"
            placeholder="100"
            type="number"
            min={0}
            {...register('minPrice')}
          />
          <ZoopsyInput
            label="до"
            placeholder="2000"
            type="number"
            min={0}
            {...register('maxPrice')}
          />
        </div>
      </FilterGroup>

      {/* Service type */}
      <FilterGroup title="Послуга">
        <Controller
          name="serviceType"
          control={control}
          render={({ field: { value, onChange } }) => (
            <>
              {SERVICE_TYPES.map((opt) => (
                <RadioOption
                  key={opt.value}
                  label={opt.label}
                  value={opt.value}
                  selected={value === opt.value}
                  onSelect={(v) => {
                    onChange(v);
                    setValue('startDate', '');
                    setValue('endDate', '');
                  }}
                />
              ))}
            </>
          )}
        />
      </FilterGroup>

      {/* Pet species */}
      <FilterGroup title="Тип тварини">
        <Controller
          name="petSpecies"
          control={control}
          render={({ field: { value, onChange } }) => (
            <>
              {PET_SPECIES.map((opt) => (
                <RadioOption
                  key={opt.value}
                  label={opt.label}
                  value={opt.value}
                  selected={value === opt.value}
                  onSelect={onChange}
                />
              ))}
            </>
          )}
        />
      </FilterGroup>

      {petSpecies === 0 && (
        <FilterGroup title="Вага собак">
          <Controller
            name="dogWeightCategory"
            control={control}
            render={({ field: { value, onChange } }) => (
              <>
                {DOG_WEIGHT_CATEGORIES.map((opt) => (
                  <RadioOption
                    key={opt.value}
                    label={opt.label}
                    value={opt.value}
                    selected={value === opt.value}
                    onSelect={onChange}
                  />
                ))}
              </>
            )}
          />
        </FilterGroup>
      )}

      <FilterGroup title="Тип житла">
        <Controller
          name="housingType"
          control={control}
          render={({ field: { value, onChange } }) => (
            <>
              {HOUSING_TYPES.map((opt) => (
                <RadioOption
                  key={opt.value}
                  label={opt.label}
                  value={opt.value}
                  selected={value === opt.value}
                  onSelect={onChange}
                />
              ))}
            </>
          )}
        />
      </FilterGroup>

      <FilterGroup title="Досвід">
        <Controller
          name="minExperienceYears"
          control={control}
          render={({ field: { value, onChange } }) => (
            <>
              {EXPERIENCE_OPTIONS.map((opt) => (
                <RadioOption
                  key={opt.value}
                  label={opt.label}
                  value={opt.value}
                  selected={value === opt.value}
                  onSelect={onChange}
                />
              ))}
            </>
          )}
        />
      </FilterGroup>

      <FilterGroup title="Стать">
        <Controller
          name="gender"
          control={control}
          render={({ field: { value, onChange } }) => (
            <>
              {GENDERS.map((opt) => (
                <RadioOption
                  key={opt.value}
                  label={opt.label}
                  value={opt.value}
                  selected={value === opt.value}
                  onSelect={onChange}
                />
              ))}
            </>
          )}
        />
      </FilterGroup>

      <Button
        type="submit"
        isPending={isLoading}
        isDisabled={isSubmitDisabled}
        className="w-full h-11 rounded-xl bg-zoopsy-green-900 text-white font-inter font-semibold text-sm hover:bg-zoopsy-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {({ isPending }) => (
          <>
            {isPending ? <Spinner color="current" size="sm" /> : null}
            Застосувати
          </>
        )}
      </Button>
    </form>
  );
}
