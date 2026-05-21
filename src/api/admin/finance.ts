import { axiosInstance } from '../../lib/axios';

export interface Metric {
  id: string;
  title: string;
  value: number;
  badge: string | null;
  badgeType: 'success' | 'warning' | 'neutral' | null;
  iconName: string;
}

export interface ChartData {
  label: string;
  value: number;
}

export interface TransactionUser {
  name: string;
  avatarUrl: string | null;
  initials: string;
}

export interface Transaction {
  id: string;
  type: string;
  user: TransactionUser;
  amount: number;
  status: 'success' | 'pending' | 'error';
  date: string;
}

export interface TransactionResponse {
  data: Transaction[];
  totalCount: number;
}

export interface Commission {
  rate: number;
}

export const financeApi = {
  getMetrics: () => axiosInstance.get<Metric[]>('/api/admin/finance/metrics').then(res => res.data),
  getChart: () => axiosInstance.get<ChartData[]>('/api/admin/finance/chart').then(res => res.data),
  getTransactions: (page = 1, limit = 10) => 
    axiosInstance.get<TransactionResponse>(`/api/admin/finance/transactions?page=${page}&limit=${limit}`).then(res => res.data),
  getCommission: () => axiosInstance.get<Commission>('/api/admin/finance/commission').then(res => res.data),
  updateCommission: (rate: number) => 
    axiosInstance.put<Commission>('/api/admin/finance/commission', { rate }).then(res => res.data),
};