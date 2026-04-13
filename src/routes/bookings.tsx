import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/bookings')({
  component: Bookings,
})

function Bookings() {
  return (
    <div className="p-2">
      <h3>Bookings</h3>
    </div>
  )
}
