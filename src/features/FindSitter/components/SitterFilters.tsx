import { useForm, Controller } from 'react-hook-form';
import cn from 'classnames';
import { Button, Spinner, Select, ListBox } from '@heroui/react';
import { CitySelect } from '@components';
import { ZoopsyInput } from '@features/OwnerProfile/components/ZoopsyInput';
import type { SitterSearchParams } from '@api/sitter/types';
import { DateRangeFilter } from './DateRangeFilter';
import { useOwnerProfile } from '@api/owner/queries';

const SERVICE_TYPES = [
  { value: 0, label: 'Перетримка' },
  { value: 1, label: 'Прогулянка' },
  { value: 2, label: 'Грумерство' },
  { value: 3, label: 'Ветеринарство' },
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

export type FilterFormValues = {
  minPrice: string;
  maxPrice: string;
  serviceType: number | null;
  petId: string;
  housingType: string[];
  minExperienceYears: number | null;
  gender: string[];
  city: string;
  startDate: string;
  endDate: string;
};

type Props = {
  onChange: (params: SitterSearchParams, petId?: string) => void;
  initialValues?: SitterSearchParams;
  initialPetId?: string;
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

function CheckboxOption({
  label,
  value,
  checked,
  onToggle,
}: {
  label: string;
  value: string;
  checked: boolean;
  onToggle: (value: string, checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <button
        type="button"
        onClick={() => onToggle(value, !checked)}
        className={cn(
          'w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border-2 transition-colors',
          checked
            ? 'border-zoopsy-green-900 bg-zoopsy-green-900'
            : 'bg-white border-zoopsy-gray group-hover:border-zoopsy-green-500',
        )}
      >
        {checked && (
          <svg viewBox="0 0 10 8" fill="none" className="w-3 h-3">
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
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

export function SitterFilters({ onChange, initialValues, initialPetId, isLoading }: Props) {
  const { data: ownerProfile } = useOwnerProfile();
  const pets = ownerProfile?.pets ?? [];

  const { register, control, watch, handleSubmit, setValue } = useForm<FilterFormValues>({
    defaultValues: {
      minPrice: initialValues?.minPrice?.toString() ?? '',
      maxPrice: initialValues?.maxPrice?.toString() ?? '',
      serviceType: initialValues?.serviceType ?? null,
      petId: initialPetId ?? '',
      housingType: initialValues?.housingType ?? [],
      minExperienceYears: initialValues?.minExperienceYears ?? 0,
      gender: initialValues?.gender ?? [],
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
    if (values.housingType.length > 0) params.housingType = values.housingType;
    if (values.minExperienceYears) params.minExperienceYears = values.minExperienceYears;
    if (values.gender.length > 0) params.gender = values.gender;
    if (values.city) params.city = values.city;
    if (values.startDate) params.startDate = values.startDate;
    if (values.endDate) params.endDate = values.endDate;

    const pet = pets.find((p) => p.id === values.petId);
    if (pet) {
      params.petSpecies = pet.species;
      if (pet.species === 0 && pet.weight != null) {
        params.dogWeightCategory = pet.weight < 10 ? 0 : pet.weight <= 25 ? 1 : 2;
      }
    }

    onChange(params, values.petId || undefined);
  });

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
                    if (v === null) return;
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

      {/* Pet selector from owner profile */}
      <FilterGroup title="Тварина">
        <Controller
          name="petId"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Select
              aria-label="Оберіть тварину"
              placeholder="Всі тварини"
              value={value}
              onChange={(val) => onChange(val as string)}
            >
              <Select.Trigger className="bg-zoopsy-mint rounded-xl h-10 px-3 w-full flex items-center justify-between gap-2 text-zoopsy-dark-gray font-inter text-sm outline-none data-[hovered]:bg-zoopsy-mint/80 data-[pressed]:bg-zoopsy-mint/80">
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {pets.map((pet) => (
                    <ListBox.Item key={pet.id} id={pet.id} textValue={pet.name}>
                      {pet.name}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
          )}
        />
      </FilterGroup>

      {/* Housing type — checkboxes */}
      <FilterGroup title="Тип житла">
        <Controller
          name="housingType"
          control={control}
          render={({ field: { value, onChange } }) => (
            <>
              {HOUSING_TYPES.map((opt) => (
                <CheckboxOption
                  key={opt.value}
                  label={opt.label}
                  value={opt.value}
                  checked={value.includes(opt.value)}
                  onToggle={(v, isChecked) => {
                    //const current = getValues('housingType');
                    onChange(isChecked ? [...value, v] : value.filter((x) => x !== v));
                  }}
                />
              ))}
            </>
          )}
        />
      </FilterGroup>

      {/* Experience */}
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
                  onSelect={(v) => {
                    if (v === null) return;
                    onChange(v);
                  }}
                />
              ))}
            </>
          )}
        />
      </FilterGroup>

      {/* Gender — checkboxes */}
      <FilterGroup title="Стать">
        <Controller
          name="gender"
          control={control}
          render={({ field: { value, onChange } }) => (
            <>
              {GENDERS.map((opt) => (
                <CheckboxOption
                  key={opt.value}
                  label={opt.label}
                  value={opt.value}
                  checked={value.includes(opt.value)}
                  onToggle={(v, isChecked) => {
                    //const current = getValues('gender');
                    onChange(isChecked ? [...value, v] : value.filter((x) => x !== v));
                  }}
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
