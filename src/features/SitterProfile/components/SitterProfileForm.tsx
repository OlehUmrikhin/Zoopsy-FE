import { FormProvider, useForm } from 'react-hook-form'
import { Button } from '@heroui/react'
import { SitterPersonalDataSection } from './SitterPersonalDataSection'
import { SitterWorkScheduleSection } from './SitterWorkScheduleSection'
import { SitterPetSpeciesSection } from './SitterPetSpeciesSection'
import { SitterServicesSection } from './SitterServicesSection'
import { SitterDogWeightSection } from './SitterDogWeightSection'
import { useSitterProfile, useUpdateSitterProfile } from '@api'

export type ServiceFormEntry = {
  serviceType: number
  enabled: boolean
  pricePerUnit: string
}

export type SitterProfileFormValues = {
  fullName: string
  gender: string
  city: string
  address: string
  phoneNumber: string
  email: string
  experienceYears: string
  housingType: string
  description: string
  workDays: number[]
  workStartTime: string
  workEndTime: string
  petSpecies: number[]
  dogServices: ServiceFormEntry[]
  catServices: ServiceFormEntry[]
  dogWeightPreferences: number[]
}

export const DOG_SERVICE_DEFS = [
  { serviceType: 0, label: 'Перетримка' },
  { serviceType: 1, label: 'Прогулянка' },
  { serviceType: 2, label: 'Грумерство' },
  { serviceType: 3, label: 'Ветеринарство' },
]

export const CAT_SERVICE_DEFS = [
  { serviceType: 0, label: 'Перетримка' },
  { serviceType: 3, label: 'Ветеринарство' },
]

function buildInitialValues(profile: ReturnType<typeof useSitterProfile>['data']): SitterProfileFormValues {
  const firstSchedule = profile?.workSchedules?.[0]
  const workDays = profile?.workSchedules?.map((s) => s.dayOfWeek) ?? []
  const workStartTime = firstSchedule?.startTime ?? '08:00'
  const workEndTime = firstSchedule?.endTime ?? '20:00'

  const dogMap = new Map(
    (profile?.services ?? []).filter((s) => s.petSpecies === 0).map((s) => [s.serviceType, s.pricePerUnit]),
  )
  const catMap = new Map(
    (profile?.services ?? []).filter((s) => s.petSpecies === 1).map((s) => [s.serviceType, s.pricePerUnit]),
  )

  const hasDogServices = dogMap.size > 0
  const hasCatServices = catMap.size > 0
  const petSpecies = [
    ...(hasDogServices ? [0] : []),
    ...(hasCatServices ? [1] : []),
  ]

  return {
    fullName: profile?.fullName ?? '',
    gender: profile?.gender ?? '',
    city: profile?.city ?? '',
    address: profile?.address ?? '',
    phoneNumber: profile?.phoneNumber ?? '',
    email: profile?.email ?? '',
    experienceYears: String(profile?.experienceYears ?? ''),
    housingType: profile?.housingType ?? '',
    description: profile?.description ?? '',
    workDays,
    workStartTime,
    workEndTime,
    petSpecies,
    dogServices: DOG_SERVICE_DEFS.map(({ serviceType }) => ({
      serviceType,
      enabled: dogMap.has(serviceType),
      pricePerUnit: String(dogMap.get(serviceType) ?? ''),
    })),
    catServices: CAT_SERVICE_DEFS.map(({ serviceType }) => ({
      serviceType,
      enabled: catMap.has(serviceType),
      pricePerUnit: String(catMap.get(serviceType) ?? ''),
    })),
    dogWeightPreferences: profile?.dogWeightPreferences ?? [],
  }
}

export function SitterProfileForm() {
  const { data: sitterProfile } = useSitterProfile()
  const { mutate: updateSitterProfile } = useUpdateSitterProfile()

  const methods = useForm<SitterProfileFormValues>({
    values: buildInitialValues(sitterProfile),
  })

  const onSubmit = methods.handleSubmit((values) => {
    const workSchedules = values.workDays.map((dayOfWeek) => ({
      dayOfWeek,
      startTime: values.workStartTime,
      endTime: values.workEndTime,
    }))

    const services = [
      ...(values.petSpecies.includes(0)
        ? values.dogServices
            .filter((s) => s.enabled)
            .map((s) => ({ serviceType: s.serviceType, petSpecies: 0, pricePerUnit: Number(s.pricePerUnit) }))
        : []),
      ...(values.petSpecies.includes(1)
        ? values.catServices
            .filter((s) => s.enabled)
            .map((s) => ({ serviceType: s.serviceType, petSpecies: 1, pricePerUnit: Number(s.pricePerUnit) }))
        : []),
    ]

    const payload = {
      fullName: values.fullName,
      gender: values.gender,
      city: values.city,
      address: values.address,
      phoneNumber: values.phoneNumber,
      experienceYears: Number(values.experienceYears),
      housingType: values.housingType,
      description: values.description,
      workSchedules,
      services,
      dogWeightPreferences: values.petSpecies.includes(0) ? values.dogWeightPreferences : [],
    } as any

    if (values.email) payload.email = values.email

    updateSitterProfile(payload)
  })

  if(!sitterProfile) return null

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col gap-5" onSubmit={onSubmit}>
        <SitterPersonalDataSection />
        <SitterWorkScheduleSection />
        <SitterPetSpeciesSection />
        <SitterDogWeightSection />
        <SitterServicesSection />
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
