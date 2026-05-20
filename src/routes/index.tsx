import { createFileRoute, Navigate } from '@tanstack/react-router';
import { useUser } from '@clerk/react';
import { getAuthRedirectPath } from '../utils';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) return null;

  if (isSignedIn) {
    return <Navigate to={getAuthRedirectPath(user?.publicMetadata?.role)} />;
  }

  return <Navigate to="/sign" />;
}
