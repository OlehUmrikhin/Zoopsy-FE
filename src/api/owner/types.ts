export const SPECIES_MAP: Record<string, number> = {
  dog: 0,
  cat: 1,
};

export const SPECIES_REVERSE_MAP: Record<number, string> = {
  0: 'dog',
  1: 'cat',
};

export const PET_GENDER_MAP: Record<string, number> = {
  Male: 0,
  Female: 1,
};

export const PET_GENDER_REVERSE_MAP: Record<number, string> = {
  0: 'Male',
  1: 'Female',
};

export type OwnerPet = {
  id: string;
  name: string;
  gender: number;
  breed: string;
  weight: number;
  species: number;
  age: number;
};

export type OwnerProfile = {
  id: string;
  fullName: string;
  email: string;
  gender: string;
  city: string;
  phoneNumber: string;
  pets: OwnerPet[];
};
