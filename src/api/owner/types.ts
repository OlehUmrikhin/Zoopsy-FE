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
