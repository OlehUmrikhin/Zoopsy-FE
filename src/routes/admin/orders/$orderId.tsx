import { createFileRoute } from '@tanstack/react-router';
import { OrderDetails } from '../../../features/Admin/Orders';

export const Route = createFileRoute('/admin/orders/$orderId')({
  component: OrderRouteComponent,
});

function OrderRouteComponent() {
  const { orderId } = Route.useParams();
  
  return <OrderDetails orderId={orderId} />;
}
