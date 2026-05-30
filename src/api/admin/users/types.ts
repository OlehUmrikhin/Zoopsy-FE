export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: 'owner' | 'sitter' | 'moderator' | 'admin';
  status: 'active' | 'inactive' | 'blocked' | 'pending';
  createdAt: string;
  totalBookings: number;
  reviewsCount: number;
  reportsCount: number;
  isOwnerBlocked?: boolean | null;
  blockedAt?: string | null;
}

export interface AdminUsersParams {
  page: number;
  limit: number;
  role?: 'owner' | 'sitter' | 'moderator' | 'admin' | 'all';
  status?: 'active' | 'inactive' | 'blocked' | 'pending' | 'all';
  search?: string;
}

export interface AdminUsersPaginatedResponse {
  items: AdminUser[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
}

export interface UpdateUserStatusPayload {
  status: 'active' | 'inactive' | 'blocked';
  reason?: string;
}

export interface UpdateAdminUserPayload {
  fullName?: string;
  email?: string;
  role?: 'owner' | 'sitter' | 'moderator' | 'admin';
  status?: 'active' | 'inactive' | 'blocked' | 'pending';
}
