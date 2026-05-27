export interface UserReview {
  id: string;
  contentType: 'review';
  reviewText: string;
  rating: number;
  author: {
    id: string;
    name: string;
    avatarUrl: string | null;
    role: 'owner' | 'sitter';
  };
  targetUser: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export interface UserPhoto {
  id: string;
  contentType: 'photo';
  photoUrl: string;
  description?: string;
  author: {
    id: string;
    name: string;
    avatarUrl: string | null;
    role: 'owner' | 'sitter';
  };
  createdAt: string;
}

export interface ProfileTest {
  id: string;
  contentType: 'profile_test';
  testName: string;
  testUrl: string;
  score: number;
  maxScore: number;
  status: 'passed' | 'failed' | 'pending';
  author: {
    id: string;
    name: string;
    avatarUrl: string | null;
    role: 'owner' | 'sitter';
  };
  createdAt: string;
}

export type ContentItem = UserReview | UserPhoto | ProfileTest;

export interface ContentModerationParams {
  page: number;
  limit: number;
  contentType?: 'review' | 'photo' | 'profile_test' | 'all';
  status?: 'pending' | 'approved' | 'rejected' | 'all';
  search?: string;
}

export interface ContentModerationPaginatedResponse {
  items: Array<ContentItem & { id: string; moderationStatus: 'pending' | 'approved' | 'rejected'; moderationNotes?: string }>;
  totalItems: number;
  currentPage: number;
  totalPages: number;
}

export interface ApproveContentPayload {
  contentId: string;
  notes?: string;
}

export interface RejectContentPayload {
  contentId: string;
  reason: string;
}
