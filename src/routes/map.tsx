import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/map')({
  component: function MapPage() {
    return <div className="p-8 text-center text-zoopsy-dark-gray">Найближчі сервіси/Мапа (в розробці)</div>
  },
})