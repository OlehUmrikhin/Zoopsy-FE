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
