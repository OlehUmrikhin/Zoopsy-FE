import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAdminOrderStatus } from './fetchers';
import type { OrderStatus } from './types';

export function useUpdateAdminOrderStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateAdminOrderStatus(id, status),
    onSuccess: () => {
      // Invalidate the admin orders query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
    },
  });
}
