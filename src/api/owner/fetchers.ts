import { axiosInstance } from '../../lib/axios';
import { OWNER_PATHS } from './paths';
import type { OwnerProfile } from './types';

export async function fetchOwnerProfile() {
  const { data } = await axiosInstance.get<OwnerProfile>(OWNER_PATHS.me);
  return data;
}
