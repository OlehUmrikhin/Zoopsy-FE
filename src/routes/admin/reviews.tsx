import { createFileRoute } from '@tanstack/react-router';
import { AdminReviewsPage } from '../../features/Admin/Reviews/AdminReviewsPage';

export const Route = createFileRoute('/admin/reviews')({
  component: AdminReviewsPage,
});
