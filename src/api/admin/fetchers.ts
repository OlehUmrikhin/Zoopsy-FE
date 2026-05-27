import { axiosInstance } from '../../lib/axios';
import { ADMIN_PATHS } from './paths';
import type {
  AdminDashboardStats,
  AdminOrdersPaginatedResponse,
  AdminOrdersParams,
  AdminComplaintsParams,
  AdminComplaintsPaginatedResponse,
  OrderStatus,
  DetailedAdminOrder,
  RefundPayload,
} from './types';

export async function fetchAdminDashboardStats(): Promise<AdminDashboardStats> {
  const { data } = await axiosInstance.get<AdminDashboardStats>(ADMIN_PATHS.dashboard);
  return data;
}

export async function fetchAdminOrders(params: AdminOrdersParams): Promise<AdminOrdersPaginatedResponse> {
  const { data } = await axiosInstance.get<AdminOrdersPaginatedResponse>(ADMIN_PATHS.orders, { params });
  return data;
}

export async function fetchAdminComplaints(params: AdminComplaintsParams): Promise<AdminComplaintsPaginatedResponse> {
  const { data } = await axiosInstance.get<AdminComplaintsPaginatedResponse>(ADMIN_PATHS.complaints, { params });
  return data;
}

export async function fetchAdminOrderById(id: string): Promise<DetailedAdminOrder> {
  const { data } = await axiosInstance.get<DetailedAdminOrder>(ADMIN_PATHS.orderDetail(id));
  return data;
}

export async function updateAdminComplaintStatus(id: string, status: 'active' | 'resolved'): Promise<void> {
  await axiosInstance.patch(ADMIN_PATHS.complaintStatus(id), { status });
}

export async function updateAdminOrderStatus(id: string, status: OrderStatus): Promise<void> {
  await axiosInstance.patch(ADMIN_PATHS.orderStatus(id), { status });
}

export async function refundAdminOrder(payload: RefundPayload): Promise<void> {
  await axiosInstance.post(ADMIN_PATHS.orderRefund(payload.orderId), payload);
}
