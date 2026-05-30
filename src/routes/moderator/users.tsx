import { createFileRoute } from '@tanstack/react-router';
import { UsersPage } from '../../features/Admin/Users';

function ModeratorUsersPage() {
  return <UsersPage restrictedRoles={['moderator', 'admin']} />;
}

export const Route = createFileRoute('/moderator/users')({
  component: ModeratorUsersPage,
});
