export type Review = {
  id: number;
  sitterProfileId: number;
  authorUserId: string;
  authorFullName: string | null;
  rating: number;
  comment: string;
  createdAt: string;
};

export type CreateReviewPayload = {
  sitterProfileId: number;
  rating: number;
  comment: string;
};

export type PatchReviewPayload = {
  rating?: number;
  comment?: string;
};
