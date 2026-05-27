import { createFileRoute } from '@tanstack/react-router';
import { ComplaintsPage } from './features/Admin';

export const Route = createFileRoute('/admin/complaints')({
  component: ComplaintsPage,
});