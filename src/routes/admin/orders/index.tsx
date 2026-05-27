import { createFileRoute } from '@tanstack/react-router';
import { OrdersPage } from '../../../features/Admin/Orders';

export const Route = createFileRoute('/admin/orders/')({
  component: OrdersPage,
});
