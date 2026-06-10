import { axiosInstance } from '../../../lib/axios';
import { ADMIN_PATHS } from '../paths';
import type { AdminReviewsPaginatedResponse, AdminReviewsParams, AdminReviewItem } from './types';

export async function fetchAdminReviews(params: AdminReviewsParams): Promise<AdminReviewsPaginatedResponse> {
  const { data } = await axiosInstance.get<AdminReviewsPaginatedResponse>(ADMIN_PATHS.adminReviews, { params });
  return data;
}

export async function adminPatchReview(id: number, payload: { rating?: number; comment?: string }): Promise<AdminReviewItem> {
  const { data } = await axiosInstance.patch<AdminReviewItem>(ADMIN_PATHS.adminReviewById(id), payload);
  return data;
}

export async function adminDeleteReview(id: number): Promise<void> {
  await axiosInstance.delete(ADMIN_PATHS.adminReviewById(id));
}
