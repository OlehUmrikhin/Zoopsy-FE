import { axiosInstance } from '../../lib/axios';
import { ADMIN_PATHS } from './paths';
import type { AdminDashboardStats } from './types';

export async function fetchAdminDashboardStats(): Promise<AdminDashboardStats> {
  const { data } = await axiosInstance.get<AdminDashboardStats>(ADMIN_PATHS.dashboard);
  return data;
}
