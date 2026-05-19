import { createFileRoute } from '@tanstack/react-router';
import { BookingsPage } from '../features/Bookings';

export const Route = createFileRoute('/bookings')({
  component: BookingsPage,
});
