export type Pet = {
  id: string;
  name: string;
  gender: string;
  breed: string;
  weight: number;
  species: number;
  age: number;
};

export type CurrentUser = {
  id: string;
  fullName: string;
  email: string | null;
  gender: string;
  city: string;
  phoneNumber: string;
  pets: Pet[];
};
