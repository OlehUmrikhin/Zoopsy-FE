import { createFileRoute, Navigate } from '@tanstack/react-router';

function ModeratorIndex() {
  return <Navigate to="/moderator/complaints" />;
}

export const Route = createFileRoute('/moderator/')({
  component: ModeratorIndex,
});
