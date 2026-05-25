import { axiosInstance } from '../../lib/axios';
import { ADMIN_PATHS } from './paths';
import type { AdminDashboardStats, AdminOrdersPaginatedResponse, AdminOrdersParams, OrderStatus } from './types';

export async function fetchAdminDashboardStats(): Promise<AdminDashboardStats> {
  const { data } = await axiosInstance.get<AdminDashboardStats>(ADMIN_PATHS.dashboard);
  return data;
}

export async function fetchAdminOrders(params: AdminOrdersParams): Promise<AdminOrdersPaginatedResponse> {
  const { data } = await axiosInstance.get<AdminOrdersPaginatedResponse>(ADMIN_PATHS.orders, { params });
  return data;
}

export async function updateAdminOrderStatus(id: string, status: OrderStatus): Promise<void> {
  await axiosInstance.patch(ADMIN_PATHS.orderStatus(id), { status });
}
