import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchAdminDashboardStats, fetchAdminOrders } from './fetchers';
import type { AdminOrdersParams } from './types';

export const adminQueryKeys = {
  dashboard: () => ['admin', 'dashboard'] as const,
  orders: (params: AdminOrdersParams) => ['admin', 'orders', params] as const,
};

export function useAdminDashboardStats() {
  return useQuery({
    queryKey: adminQueryKeys.dashboard(),
    queryFn: fetchAdminDashboardStats,
  });
}

export function useAdminOrders(params: AdminOrdersParams) {
  return useQuery({
    queryKey: adminQueryKeys.orders(params),
    queryFn: () => fetchAdminOrders(params),
    placeholderData: keepPreviousData,
  });
}
