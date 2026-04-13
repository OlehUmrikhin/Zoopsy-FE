import { createFileRoute, Navigate } from '@tanstack/react-router'
import { SignIn, useUser } from '@clerk/react'

export const Route = createFileRoute('/sign')({
  component: Sign,
})

function Sign() {
  const { isLoaded, isSignedIn, user } = useUser()

  if (!isLoaded) return null

  if (isSignedIn) {
    if (user?.unsafeMetadata?.role) {
      return <Navigate to="/bookings" />
    }
    return <Navigate to="/role-selector" />
  }

  return (
    <div className="flex justify-center p-4">
      <SignIn routing="path" path="/sign" fallbackRedirectUrl="/" signUpFallbackRedirectUrl="/" />
    </div>
  )
}
