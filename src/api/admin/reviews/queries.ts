import { useQuery, keepPreviousData, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAdminReviews, adminPatchReview, adminDeleteReview } from './fetchers';
import type { AdminReviewsParams, AdminPatchReviewPayload } from './types';

export const adminReviewsQueryKeys = {
  all: () => ['admin', 'reviews'] as const,
  list: (params: AdminReviewsParams) => ['admin', 'reviews', params] as const,
};

export function useAdminReviews(params: AdminReviewsParams) {
  return useQuery({
    queryKey: adminReviewsQueryKeys.list(params),
    queryFn: () => fetchAdminReviews(params),
    placeholderData: keepPreviousData,
  });
}

export function useAdminPatchReviewMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: AdminPatchReviewPayload) => adminPatchReview(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminReviewsQueryKeys.all() });
    },
  });
}

export function useAdminDeleteReviewMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminDeleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminReviewsQueryKeys.all() });
    },
  });
}
