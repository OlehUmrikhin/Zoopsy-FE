import { createRootRoute, Outlet, Link } from '@tanstack/react-router'
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'

export const Route = createRootRoute({
  component: () => (
    <>
      <header className="p-4 flex gap-4 items-center">
        <nav className="flex gap-4 flex-1">
          <Link to="/" className="[&.active]:font-bold">
            Home
          </Link>{' '}
          <Link to="/bookings" className="[&.active]:font-bold">
            Bookings
          </Link>
          <Link to="/sign" className="[&.active]:font-bold">
            Sign In / Up
          </Link>
        </nav>
        <div className="flex gap-4">
          <Show when="signed-out">
            <SignInButton />
            <SignUpButton />
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </header>
      <hr />
      <div className="p-4">
        <Outlet />
      </div>
    </>
  ),
})
