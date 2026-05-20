import { useQuery } from '@tanstack/react-query';
import { fetchAdminDashboardStats } from './fetchers';

export const adminDashboardQueryKeys = {
  dashboard: () => ['admin', 'dashboard'] as const,
};

export function useAdminDashboardStats() {
  return useQuery({
    queryKey: adminDashboardQueryKeys.dashboard(),
    queryFn: fetchAdminDashboardStats,
  });
}
