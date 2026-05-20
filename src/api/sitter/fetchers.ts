import { axiosInstance } from '../../lib/axios';
import { SITTER_PATHS } from './paths';
import type {
  SitterProfile,
  SitterSearchParams,
  SitterSearchResult,
  PaginatedResponse,
  WorkSchedule,
  SitterService,
} from './types';

export async function fetchSitterById(userId: string) {
  const { data } = await axiosInstance.get<SitterProfile>(SITTER_PATHS.byId(userId));
  return data;
}

export async function fetchSitterProfile() {
  const { data } = await axiosInstance.get<SitterProfile>(SITTER_PATHS.me);
  return data;
}

export async function fetchSitters(
  params: SitterSearchParams,
): Promise<PaginatedResponse<SitterSearchResult>> {
  const { data } = await axiosInstance.get<PaginatedResponse<SitterSearchResult>>(
    SITTER_PATHS.list,
    { params },
  );
  return data;
}

export type UpdateSitterProfilePayload = {
  fullName: string;
  gender: string;
  city: string;
  address: string;
  phoneNumber: string;
  email?: string;
  experienceYears: number;
  housingType: string;
  description: string;
  workSchedules: WorkSchedule[];
  services: SitterService[];
  dogWeightPreferences: number[];
  latitude?: number | null;
  longitude?: number | null;
};

export async function patchSitterProfile(payload: UpdateSitterProfilePayload) {
  const { data } = await axiosInstance.patch<SitterProfile>(SITTER_PATHS.me, payload);
  return data;
}
