import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
  fetchAdminDashboardStats,
  fetchAdminOrders,
  fetchAdminOrderById,
  fetchAdminComplaints,
} from './fetchers';
import type {
  AdminOrdersParams,
  AdminComplaintsParams,
  AdminComplaintsPaginatedResponse,
} from './types';

export const adminQueryKeys = {
  dashboard: () => ['admin', 'dashboard'] as const,
  orders: (params: AdminOrdersParams) => ['admin', 'orders', params] as const,
  orderDetail: (id: string) => ['admin', 'order', id] as const,
  complaints: (params: AdminComplaintsParams) => ['admin', 'complaints', params] as const,
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

export function useAdminComplaints(params: AdminComplaintsParams) {
  return useQuery<AdminComplaintsPaginatedResponse>({
    queryKey: adminQueryKeys.complaints(params),
    queryFn: () => fetchAdminComplaints(params),
    placeholderData: keepPreviousData,
  });
}

export function useAdminOrder(id: string) {
  return useQuery({
    queryKey: adminQueryKeys.orderDetail(id),
    queryFn: () => fetchAdminOrderById(id),
    enabled: !!id,
  });
}
