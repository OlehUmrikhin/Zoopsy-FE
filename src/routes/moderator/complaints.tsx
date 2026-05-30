import { createFileRoute } from '@tanstack/react-router';
import { ComplaintsPage } from '../../features/Admin';

function ModeratorComplaintsPage() {
  return <ComplaintsPage usersPath="/moderator/users" />;
}

export const Route = createFileRoute('/moderator/complaints')({
  component: ModeratorComplaintsPage,
});
