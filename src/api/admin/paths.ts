export const ADMIN_PATHS = {
  dashboard: '/api/admin/dashboard',
  orders: '/api/admin/orders',
  orderStatus: (id: string) => `/api/admin/orders/${id}/status`,
};
