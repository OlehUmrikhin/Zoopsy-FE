export type Pet = {
  id: string;
  name: string;
  gender: number;
  breed: string;
  weight: number;
  species: number;
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
