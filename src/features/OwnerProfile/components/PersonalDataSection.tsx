import { Controller, useFormContext } from 'react-hook-form'
import { MdOutlineEdit } from 'react-icons/md'
import { ZoopsyInput } from './ZoopsyInput'
import { ZoopsySelect, ZoopsySelectItem } from './ZoopsySelect'
import { PhoneInput } from './PhoneInput'
import type { OwnerProfileFormValues } from './OwnerProfileForm'

const GENDER_OPTIONS = [
  { value: 'male', label: 'Чоловіча' },
  { value: 'female', label: 'Жіноча' },
]

const CITY_OPTIONS = [
  { value: 'kyiv', label: 'Київ' },
  { value: 'lviv', label: 'Львів' },
  { value: 'kharkiv', label: 'Харків' },
  { value: 'odesa', label: 'Одеса' },
  { value: 'dnipro', label: 'Дніпро' },
]

export function PersonalDataSection() {
  const { register, control } = useFormContext<OwnerProfileFormValues>()

  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <MdOutlineEdit className="text-zoopsy-green-500 text-xl" />
        <h2 className="text-lg font-semibold text-zoopsy-dark-gray font-plus-jakarta">
          Особисті дані
        </h2>
      </div>

      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <ZoopsyInput label="ПОВНЕ ІМ'Я" placeholder="Введіть повне ім'я" {...register('fullName')} />
          <Controller
            name="gender"
            control={control}
            render={({ field: { onChange, value } }) => (
              <ZoopsySelect
                label="СТАТЬ"
                placeholder='Виберіть стать'
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
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="city"
            control={control}
            render={({ field: { onChange, value } }) => (
              <ZoopsySelect
                label="МІСТО"
                placeholder='Виберіть місто'
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
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field: { onChange, onBlur, value, name } }) => (
              <PhoneInput value={value} onChange={onChange} onBlur={onBlur} name={name} />
            )}
          />
        </div>

        <ZoopsyInput
          label="ЕЛЕКТРОННА ПОШТА"
          placeholder="email@example.com"
          type="email"
          {...register('email')}
        />
      </div>
    </div>
  )
}
