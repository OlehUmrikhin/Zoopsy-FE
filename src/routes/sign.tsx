import { createFileRoute, Navigate } from '@tanstack/react-router'
import { SignIn, useUser } from '@clerk/react'

export const Route = createFileRoute('/sign')({
  component: Sign,
})

function Sign() {
  const { isLoaded, isSignedIn } = useUser()

  if (!isLoaded) return null

  if (isSignedIn) {
    return <Navigate to="/bookings" />
  }

  return (
    <div className="flex justify-center p-4">
      <SignIn routing="path" path="/sign" />
    </div>
  )
}
