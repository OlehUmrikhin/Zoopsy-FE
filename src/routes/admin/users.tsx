import { createFileRoute } from '@tanstack/react-router';
import { UsersPage } from '../../features/Admin/Users';

export const Route = createFileRoute('/admin/users')({
  component: UsersPage,
});
