import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { FaPaw } from 'react-icons/fa';
import { FiTrash2 } from 'react-icons/fi';
import { IoAdd } from 'react-icons/io5';
import { DOG_BREEDS } from '@constants/dogBreeds';
import { ZoopsyInput } from './ZoopsyInput';
import { ZoopsySelect, ZoopsySelectItem } from './ZoopsySelect';
import { useDeleteOwnerPet } from '@api';
import type { Control } from 'react-hook-form';
import type { OwnerProfileFormValues } from './OwnerProfileForm';

const PET_TYPES = [
  { value: 'dog', label: 'Собака' },
  { value: 'cat', label: 'Кішка' },
];

type PetRowProps = {
  index: number;
  control: Control<OwnerProfileFormValues>;
  register: ReturnType<typeof useFormContext<OwnerProfileFormValues>>['register'];
  onRemove: () => void;
};

function PetRow({ index, control, register, onRemove }: PetRowProps) {
  const petSpecies = useWatch({ control, name: `pets.${index}.species` });
  const isDog = petSpecies === 'dog';

  return (
    <div className="bg-zoopsy-bg rounded-2xl p-4 flex items-center gap-4">
      <div className="w-16 h-16 rounded-xl bg-zoopsy-mint flex-shrink-0 overflow-hidden">
        <img src="https://placedog.net/200/200" alt="Pet" className="w-full h-full object-cover" />
      </div>
      <div
        className={`flex-1 grid gap-3 ${isDog ? 'grid-cols-[230px_1fr_1fr_1fr]' : 'grid-cols-[120px_1fr_1fr]'}`}
      >
        <Controller
          name={`pets.${index}.species`}
          control={control}
          render={({ field: { onChange, value } }) => (
            <ZoopsySelect
              label="ТИП ТВАРИНИ"
              placeholder="Виберіть тип"
              selectedKey={value || null}
              onSelectionChange={(key) => onChange(key as string)}
            >
              {PET_TYPES.map((opt) => (
                <ZoopsySelectItem key={opt.value} id={opt.value}>
                  {opt.label}
                </ZoopsySelectItem>
              ))}
            </ZoopsySelect>
          )}
        />
        <ZoopsyInput label="КЛИЧКА" placeholder="Ім'я" {...register(`pets.${index}.name`)} />
        {isDog && (
          <Controller
            name={`pets.${index}.breed`}
            control={control}
            render={({ field: { onChange, value } }) => (
              <ZoopsySelect
                label="ПОРОДА"
                placeholder="Виберіть породу"
                selectedKey={value || null}
                onSelectionChange={(key) => onChange(key as string)}
              >
                {DOG_BREEDS.map((breed) => (
                  <ZoopsySelectItem key={breed} id={breed}>
                    {breed}
                  </ZoopsySelectItem>
                ))}
              </ZoopsySelect>
            )}
          />
        )}
        <ZoopsyInput
          label="ВАГА"
          placeholder="0"
          endContent={
            <span className="text-zoopsy-gray font-inter text-sm self-center pointer-events-none">
              кг
            </span>
          }
          {...register(`pets.${index}.weight`)}
        />
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="text-zoopsy-gray hover:text-red-500 transition-colors flex-shrink-0"
        aria-label="Видалити тварину"
      >
        <FiTrash2 className="text-xl" />
      </button>
    </div>
  );
}

export function PetsSection() {
  const { register, control, getValues } = useFormContext<OwnerProfileFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: 'pets' });
  const { mutate: deletePet } = useDeleteOwnerPet();

  const handleRemove = (index: number) => {
    const id = getValues(`pets.${index}.id`);
    if (id) deletePet(id);
    remove(index);
  };

  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FaPaw className="text-zoopsy-green-500 text-lg" />
          <h2 className="text-lg font-semibold text-zoopsy-dark-gray font-plus-jakarta">
            Мої тварини
          </h2>
        </div>
        <button
          type="button"
          onClick={() => append({ species: '', name: '', breed: '', weight: '' })}
          className="flex items-center gap-1 text-zoopsy-green-500 font-inter text-sm hover:text-zoopsy-green-700 transition-colors"
        >
          <IoAdd className="text-lg" />
          Додати ще одного
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {fields.map((field, index) => (
          <PetRow
            key={field.id}
            index={index}
            control={control}
            register={register}
            onRemove={() => handleRemove(index)}
          />
        ))}
      </div>
    </div>
  );
}
