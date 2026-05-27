import { axiosInstance } from '../../../lib/axios';
import { ADMIN_PATHS } from '../paths';
import type {
  AdminUsersPaginatedResponse,
  AdminUsersParams,
  UpdateUserStatusPayload,
  UpdateAdminUserPayload,
} from './types';

export async function fetchAdminUsers(params: AdminUsersParams): Promise<AdminUsersPaginatedResponse> {
  const { data } = await axiosInstance.get<AdminUsersPaginatedResponse>(ADMIN_PATHS.users, { params });
  return data;
}

export async function updateAdminUserStatus(
  userId: string,
  payload: UpdateUserStatusPayload,
): Promise<void> {
  await axiosInstance.patch(ADMIN_PATHS.userStatus(userId), payload);
}

export async function updateAdminUser(userId: string, payload: UpdateAdminUserPayload): Promise<void> {
  await axiosInstance.patch(`${ADMIN_PATHS.users}/${userId}`, payload);
}
