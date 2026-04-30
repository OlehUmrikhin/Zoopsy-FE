import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useUser } from '@clerk/react'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const { isLoaded, isSignedIn, user } = useUser()

  if (!isLoaded) return null

  if (isSignedIn) {
    const role = user?.publicMetadata?.role
    if (role === 'admin') return <Navigate to="/admin" />
    if (role) return <Navigate to="/bookings" />
    return <Navigate to="/role-selector" />
  }

  return <Navigate to="/sign" />
}
