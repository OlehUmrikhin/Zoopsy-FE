import { axiosInstance } from '../../lib/axios';
import { REVIEW_PATHS } from './paths';
import type { Review } from './types';

export async function fetchReviewsBySitter(sitterProfileId: number): Promise<Review[]> {
  const { data } = await axiosInstance.get<Review[]>(REVIEW_PATHS.bySitter(sitterProfileId));
  return data;
}

export async function fetchMyReviewForSitter(sitterProfileId: number): Promise<Review | null> {
  const { data } = await axiosInstance.get<Review>(REVIEW_PATHS.myForSitter(sitterProfileId));
  return data;
}
