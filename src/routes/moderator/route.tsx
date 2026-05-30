import { createFileRoute } from '@tanstack/react-router';
import { ModeratorLayout } from '../../features/Admin';

export const Route = createFileRoute('/moderator')({
  component: ModeratorLayout,
});
