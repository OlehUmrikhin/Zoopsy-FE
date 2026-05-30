export function getAuthRedirectPath(
  role: unknown,
): '/admin' | '/moderator' | '/home' | '/profile' | '/bookings' | '/role-selector' {
  if (role === 'admin') return '/admin';
  if (role === 'moderator') return '/moderator';
  if (role === 'owner') return '/home';
  if (role === 'sitter') return '/profile';
  if (role) return '/bookings';
  return '/role-selector';
}
