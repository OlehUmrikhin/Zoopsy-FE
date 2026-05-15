export function getAuthRedirectPath(role: unknown): '/admin' | '/home' | '/profile' | '/bookings' | '/role-selector' {
  if (role === 'admin') return '/admin'
  if (role === 'owner') return '/home'
  if (role === 'sitter') return '/profile'
  if (role) return '/bookings'
  return '/role-selector'
}
