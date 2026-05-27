import { axiosInstance } from '../../lib/axios';
import type { UserRole } from '../../types';
import { USER_PATHS } from './paths';
import type { CurrentUser } from './types';

export type UpdateOwnerProfilePayload = {
  fullName: string;
  gender: string;
  city: string;
  phoneNumber: string;
  email?: string;
  pets: {
    id?: string;
    name: string;
    gender: number;
    breed: string;
    weight: number;
    species: number;
  }[];
};

export async function fetchCurrentUser() {
  const { data } = await axiosInstance.get<CurrentUser>(USER_PATHS.me);
  return data;
}

export async function patchUserRole(role: UserRole) {
  const { data } = await axiosInstance.patch(USER_PATHS.meRole, { role });
  return data;
}

export async function patchOwnerProfile(payload: UpdateOwnerProfilePayload) {
  const { data } = await axiosInstance.patch(USER_PATHS.meOwnerProfile, payload);
  return data;
}

export async function deleteOwnerPet(id: string) {
  const { data } = await axiosInstance.delete(USER_PATHS.mePet(id));
  return data;
}
