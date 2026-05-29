export const REVIEW_PATHS = {
  bySitter: (sitterProfileId: number) => `/api/Review/${sitterProfileId}`,
  myForSitter: (sitterProfileId: number) => `/api/Review/my/${sitterProfileId}`,
  byId: (id: number) => `/api/Review/${id}`,
  create: '/api/Review',
} as const;
