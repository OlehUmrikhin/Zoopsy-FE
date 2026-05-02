export function getAuthRedirectPath(role: unknown): '/admin' | '/owner' | '/bookings' | '/role-selector' {
  if (role === 'admin') return '/admin'
  if (role === 'owner') return '/owner'
  if (role) return '/bookings'
  return '/role-selector'
}
