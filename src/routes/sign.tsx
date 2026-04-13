import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sign')({
  component: Sign,
})

function Sign() {
  return (
    <div className="p-2">
      <h3>Sign In / Up</h3>
    </div>
  )
}
