import { FormProvider, useForm } from 'react-hook-form';
import { Button } from '@heroui/react';
import { PersonalDataSection } from './PersonalDataSection';
import { PetsSection } from './PetsSection';
import { useUpdateOwnerProfile } from '@api/user/mutations';
import type { UpdateOwnerProfilePayload } from '@api/user/fetchers';
import { useOwnerProfile } from '@api';
import {
  SPECIES_MAP,
  SPECIES_REVERSE_MAP,
  PET_GENDER_MAP,
  PET_GENDER_REVERSE_MAP,
} from '@api/owner/types';
import { toast } from 'react-toastify';

export type OwnerProfileFormValues = {
  fullName: string;
  gender: string;
  city: string;
  phoneNumber: string;
  email: string;
  pets: {
    id?: string;
    species: string;
    name: string;
    gender: string;
    breed: string;
    weight: string;
  }[];
};

export function OwnerProfileForm() {
  const { data: currentUser } = useOwnerProfile();

  const methods = useForm<OwnerProfileFormValues>({
    values: currentUser
      ? {
          fullName: currentUser.fullName ?? '',
          gender: currentUser.gender ?? '',
          city: currentUser.city ?? '',
          phoneNumber: currentUser.phoneNumber ?? '',
          email: currentUser.email ?? '',
          pets: currentUser.pets.map((pet) => ({
            id: pet.id,
            species: SPECIES_REVERSE_MAP[pet.species] ?? 'dog',
            name: pet.name,
            gender: PET_GENDER_REVERSE_MAP[pet.gender] ?? 'Male',
            breed: pet.breed,
            weight: String(pet.weight),
          })),
        }
      : undefined,
  });

  const { mutateAsync: updateOwnerProfile } = useUpdateOwnerProfile();

  const onSubmit = methods.handleSubmit(async (values) => {
    const payload: UpdateOwnerProfilePayload = {
      fullName: values.fullName,
      gender: values.gender,
      city: values.city,
      phoneNumber: values.phoneNumber,
      pets: values.pets.map((pet) => ({
        id: pet.id,
        name: pet.name,
        gender: PET_GENDER_MAP[pet.gender] ?? 0,
        breed: pet.breed,
        weight: Number(pet.weight),
        species: SPECIES_MAP[pet.species] ?? 0,
      })),
    };

    if (values.email) payload.email = values.email;

    try {
      await updateOwnerProfile(payload);
      toast.success('Профіль успішно оновлено!');
    } catch {
      toast.error('Помилка при оновленні профілю. Спробуйте ще раз.');
    }
  });

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col gap-5" onSubmit={onSubmit}>
        <PersonalDataSection />
        <PetsSection />
        <Button
          type="submit"
          fullWidth
          className="bg-zoopsy-green-900 text-white font-inter font-semibold text-base rounded-xl h-13 hover:bg-zoopsy-green-700 transition-colors"
        >
          Зберегти зміни
        </Button>
      </form>
    </FormProvider>
  );
}
