export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: 'owner' | 'sitter' | 'moderator' | 'admin';
  status: 'active' | 'inactive' | 'blocked' | 'pending';
  rating: number;
  totalBookings: number;
  lastActivityAt: string;
  createdAt: string;
  phoneNumber?: string;
  city?: string;
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
  name?: string;
  email?: string;
  role?: 'owner' | 'sitter' | 'moderator' | 'admin';
  status?: 'active' | 'inactive' | 'blocked' | 'pending';
}
