import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useUser } from '@clerk/react'

export const Route = createFileRoute('/bookings')({
  component: BookingsPage,
})

function BookingsPage() {
  const { isLoaded, isSignedIn } = useUser()

  if (!isLoaded) return null

  if (!isSignedIn) {
    return <Navigate to="/sign" />
  }

  return (
    <div className="p-2">
      <h3>Bookings</h3>
    </div>
  )
}
