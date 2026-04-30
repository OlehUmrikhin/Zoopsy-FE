import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
})

function AdminDashboard() {
  return (
    <div>
      <div className="text-[30px] font-bold text-zoopsy-dark-gray font-plus-jakarta mb-1 text-left">
        Панель управління
      </div>
      <p className="text-base text-zoopsy-gray font-inter mb-8 text-left">
        Огляд ключових показників вашого сервісу за останній місяць.
      </p>
      {/* Dashboard content goes here */}
    </div>
  )
}
