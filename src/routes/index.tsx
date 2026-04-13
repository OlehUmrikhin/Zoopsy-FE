import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useUser } from '@clerk/react'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const { isLoaded, isSignedIn } = useUser()

  if (!isLoaded) return null

  if (isSignedIn) {
    return <Navigate to="/bookings" />
  }

  return <Navigate to="/sign" />
}
