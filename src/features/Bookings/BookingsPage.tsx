import { Navigate } from '@tanstack/react-router';
import { useUser } from '@clerk/react';

export function BookingsPage() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return <Navigate to="/sign" />;
  }

  const pendingRole = sessionStorage.getItem('roleJustSet');
  const role = (user?.publicMetadata?.role as string) || pendingRole;
  if (pendingRole) sessionStorage.removeItem('roleJustSet');
  if (!role) return <Navigate to="/role-selector" />;
  if (role === 'admin') return <Navigate to="/admin" />;

  return (
    <div className="p-2">
      <h3>Bookings</h3>
    </div>
  );
}
