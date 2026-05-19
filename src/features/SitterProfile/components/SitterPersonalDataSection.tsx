import { Controller, useFormContext } from 'react-hook-form';
import { MdOutlineEdit } from 'react-icons/md';
import { ZoopsyInput } from '@features/OwnerProfile/components/ZoopsyInput';
import { ZoopsySelect, ZoopsySelectItem } from '@features/OwnerProfile/components/ZoopsySelect';
import { PhoneInput } from '@features/OwnerProfile/components/PhoneInput';
import { AddressAutocomplete } from './AddressAutocomplete';
import type { SitterProfileFormValues } from './SitterProfileForm';

const GENDER_OPTIONS = [
  { value: 'male', label: 'Чоловіча' },
  { value: 'female', label: 'Жіноча' },
];

const CITY_OPTIONS = [
  { value: 'kyiv', label: 'Київ' },
  { value: 'lviv', label: 'Львів' },
  { value: 'kharkiv', label: 'Харків' },
  { value: 'odesa', label: 'Одеса' },
  { value: 'dnipro', label: 'Дніпро' },
];

const HOUSING_OPTIONS = [
  { value: 'apartment', label: 'Квартира' },
  { value: 'house', label: 'Будинок' },
  { value: 'studio', label: 'Студія' },
];

export function SitterPersonalDataSection() {
  const { register, control, setValue } = useFormContext<SitterProfileFormValues>();

  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <MdOutlineEdit className="text-zoopsy-green-500 text-xl" />
        <h2 className="text-lg font-semibold text-zoopsy-dark-gray font-plus-jakarta">
          Особисті дані
        </h2>
      </div>

      <div className="flex flex-col gap-5">
        <ZoopsyInput
          label="ПОВНЕ ІМ'Я"
          placeholder="Введіть повне ім'я"
          {...register('fullName')}
        />

        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="gender"
            control={control}
            render={({ field: { onChange, value } }) => (
              <ZoopsySelect
                label="СТАТЬ"
                placeholder="Виберіть стать"
                selectedKey={value || null}
                onSelectionChange={(key) => onChange(key as string)}
              >
                {GENDER_OPTIONS.map((opt) => (
                  <ZoopsySelectItem key={opt.value} id={opt.value}>
                    {opt.label}
                  </ZoopsySelectItem>
                ))}
              </ZoopsySelect>
            )}
          />
          <Controller
            name="city"
            control={control}
            render={({ field: { onChange, value } }) => (
              <ZoopsySelect
                label="МІСТО"
                placeholder="Виберіть місто"
                selectedKey={value || null}
                onSelectionChange={(key) => onChange(key as string)}
              >
                {CITY_OPTIONS.map((opt) => (
                  <ZoopsySelectItem key={opt.value} id={opt.value}>
                    {opt.label}
                  </ZoopsySelectItem>
                ))}
              </ZoopsySelect>
            )}
          />
        </div>

        <Controller
          name="address"
          control={control}
          render={({ field: { value, onChange } }) => (
            <AddressAutocomplete
              value={value}
              onChange={onChange}
              onCoordinatesChange={(lat, lng) => {
                setValue('latitude', lat, { shouldDirty: true });
                setValue('longitude', lng, { shouldDirty: true });
              }}
              onCityChange={(cityKey) => {
                setValue('city', cityKey, { shouldDirty: true });
              }}
            />
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field: { onChange, onBlur, value, name } }) => (
              <PhoneInput value={value} onChange={onChange} onBlur={onBlur} name={name} />
            )}
          />
          <ZoopsyInput
            label="ЕЛЕКТРОННА ПОШТА"
            placeholder="email@example.com"
            type="email"
            {...register('email')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ZoopsyInput
            label="ДОСВІД РОБОТИ (РОКІВ)"
            placeholder="0"
            type="number"
            min={0}
            {...register('experienceYears')}
          />
          <Controller
            name="housingType"
            control={control}
            render={({ field: { onChange, value } }) => (
              <ZoopsySelect
                label="ТИП ЖИТЛА"
                placeholder="Виберіть тип"
                selectedKey={value || null}
                onSelectionChange={(key) => onChange(key as string)}
              >
                {HOUSING_OPTIONS.map((opt) => (
                  <ZoopsySelectItem key={opt.value} id={opt.value}>
                    {opt.label}
                  </ZoopsySelectItem>
                ))}
              </ZoopsySelect>
            )}
          />
        </div>

        <ZoopsyInput
          label="ПРО СЕБЕ"
          placeholder="Розкажіть про свій досвід та підхід до роботи"
          {...register('description')}
        />
      </div>
    </div>
  );
}
