import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAdminOrderStatus, refundAdminOrder, updateAdminComplaintStatus } from './fetchers';
import type { OrderStatus, RefundPayload } from './types';
import { adminQueryKeys } from './queries';

export function useUpdateAdminOrderStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateAdminOrderStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.orders({} as any).slice(0, 2) });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.orderDetail(variables.id) });
    },
  });
}

export function useUpdateAdminComplaintStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'resolved' | 'rejected' }) =>
      updateAdminComplaintStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.complaints({} as any).slice(0, 2) });
    },
  });
}

export function useRefundAdminOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RefundPayload) => refundAdminOrder(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.orders({} as any).slice(0, 2) });
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.orderDetail(variables.orderId) });
    },
  });
}
