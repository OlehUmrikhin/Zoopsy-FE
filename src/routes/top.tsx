import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/top')({
  component: function TopPage() {
    return <div className="p-8 text-center text-zoopsy-dark-gray">Топ найкращих (в розробці)</div>
  },
})