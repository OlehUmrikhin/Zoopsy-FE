import { FormProvider, useForm } from 'react-hook-form'
import { Button } from '@heroui/react'
import { PersonalDataSection } from './PersonalDataSection'
import { PetsSection } from './PetsSection'
import { useUpdateOwnerProfile } from '@api/user/mutations'
import { useOwnerProfile } from '@api'
import { SPECIES_MAP, SPECIES_REVERSE_MAP } from '@api/owner/types'

export type OwnerProfileFormValues = {
  fullName: string
  gender: string
  city: string
  phoneNumber: string
  email: string
  pets: {
    id?: string
    species: string
    name: string
    breed: string
    weight: string
  }[]
}

export function OwnerProfileForm() {
  const { data: currentUser } = useOwnerProfile()

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
            breed: pet.breed,
            weight: String(pet.weight),
          })),
        }
      : undefined,
  })

  const { mutate: updateOwnerProfile } = useUpdateOwnerProfile()

  const onSubmit = methods.handleSubmit((values) => {
    const payload: any = {
      fullName: values.fullName,
      gender: values.gender,
      city: values.city,
      phoneNumber: values.phoneNumber,
      pets: values.pets.map((pet) => ({
        id: pet.id,
        name: pet.name,
        breed: pet.breed,
        weight: Number(pet.weight),
        species: SPECIES_MAP[pet.species] ?? 0,
        gender: '',
        age: 0,
      })),
    }

    if (values.email) payload.email = values.email

    updateOwnerProfile(payload)
  })

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
  )
}
