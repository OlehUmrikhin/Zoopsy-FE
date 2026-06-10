export interface AdminReviewItem {
  id: number;
  sitterProfileId: number;
  authorUserId: string;
  authorFullName: string | null;
  sitterFullName: string | null;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AdminReviewsPaginatedResponse {
  items: AdminReviewItem[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
}

export interface AdminReviewsParams {
  page: number;
  limit: number;
  search?: string;
}

export interface AdminPatchReviewPayload {
  id: number;
  rating?: number;
  comment?: string;
}
