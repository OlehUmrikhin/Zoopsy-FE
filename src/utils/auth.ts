export function getAuthRedirectPath(role: unknown): '/admin' | '/profile' | '/bookings' | '/role-selector' {
  if (role === 'admin') return '/admin'
  if (role === 'owner' || role === 'sitter') return '/profile'
  if (role) return '/bookings'
  return '/role-selector'
}
