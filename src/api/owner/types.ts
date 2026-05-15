export const SPECIES_MAP: Record<string, number> = {
  dog: 0,
  cat: 1,
};

export const SPECIES_REVERSE_MAP: Record<number, string> = {
  0: 'dog',
  1: 'cat',
};

export type OwnerPet = {
  id: string;
  name: string;
  gender: string;
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
