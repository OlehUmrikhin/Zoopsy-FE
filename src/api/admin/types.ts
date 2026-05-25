export type AdminDashboardTrendPoint = {
  day: string;
  value: number;
};

export type AdminDashboardStats = {
  totalUsers: number;
  monthlyRevenue: number;
  activeServices: number;
  openComplaints: number;
  newTransactions: number;
  activeSitterShare: number;
  userGrowth: AdminDashboardTrendPoint[];
};

export type OrderStatus = 'ACTIVE' | 'COMPLETED' | 'DISPUTED' | 'CANCELLED';

export interface UserSnippet {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface AdminOrder {
  id: string;
  displayId: string;
  serviceName: string;
  serviceDetails: string;
  serviceIconType: 'WALK' | 'BOARDING' | 'SITTING' | 'TRAINING';
  client: UserSnippet;
  sitter: UserSnippet;
  dateStr: string;
  timeStr: string;
  amount: number;
  status: OrderStatus;
}

export interface AdminOrdersPaginatedResponse {
  items: AdminOrder[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
}

export interface AdminOrdersParams {
  page: number;
  limit: number;
  status: string;
  search: string;
}
