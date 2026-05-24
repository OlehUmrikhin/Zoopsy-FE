import { Navigate } from '@tanstack/react-router';
import { useUser } from '@clerk/react';
import { SitterBookingsView } from './components/SitterBookingsView';
import { OwnerBookingsView } from './components/OwnerBookingsView';

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
    <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-6">
      <h1 className="font-plus-jakarta font-bold text-2xl text-zoopsy-dark-gray">Мої бронювання</h1>
      {role === 'sitter' && <SitterBookingsView />}
      {role === 'owner' && <OwnerBookingsView />}
    </div>
  );
}
