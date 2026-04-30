import { createFileRoute, Navigate, Outlet, useRouterState } from '@tanstack/react-router'
import { useUser, UserButton } from '@clerk/react'
import React from 'react'
import {
  MdDashboard,
  MdAttachMoney,
  MdAssignment,
  MdReport,
  MdPeople,
  MdArticle,
  MdNotifications,
} from 'react-icons/md'

export const Route = createFileRoute('/admin')({

  component: AdminLayout,
})

type NavItem = {
  to: string
  label: string
  icon: React.ElementType
  exact?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { to: '/admin', label: 'Головна', icon: MdDashboard, exact: true },
  { to: '/admin/finances', label: 'Фінанси', icon: MdAttachMoney },
  { to: '/admin/orders', label: 'Замовлення', icon: MdAssignment },
  { to: '/admin/complaints', label: 'Скарги', icon: MdReport },
  { to: '/admin/users', label: 'Користувачі', icon: MdPeople },
  { to: '/admin/content', label: 'Контент', icon: MdArticle },
]

function AdminLayout() {
  const { isLoaded, isSignedIn, user } = useUser()
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  if (!isLoaded) return null

  if (!isSignedIn) return <Navigate to="/sign" />

  const role = user?.publicMetadata?.role
  if (role !== 'admin') return <Navigate to="/bookings" />

  return (
    <div className="flex min-h-screen bg-zoopsy-bg">
      {/* Sidebar */}
      <aside className="w-[256px] flex-shrink-0 flex flex-col bg-zoopsy-bg py-6">
        <div className="px-5 mb-8">
          <span className="text-xl font-bold text-zoopsy-green-700 font-plus-jakarta leading-tight block">
            Zoopsy
          </span>
          <span className="text-xs text-zoopsy-gray font-inter uppercase tracking-widest">
            ADMIN
          </span>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => {
            const isActive = exact ? pathname === to : pathname.startsWith(to + '/') || pathname === to
            return (
              <a
                key={to}
                href={to}
                className={[
                  'flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colors rounded-l-full ml-3',
                  isActive
                    ? 'text-zoopsy-green-700 bg-zoopsy-mint font-semibold'
                    : 'text-zoopsy-gray hover:text-zoopsy-green-700 hover:bg-zoopsy-light-gray',
                ].join(' ')}
              >
                <span className="flex items-center justify-center w-5 h-5 flex-shrink-0">
                  <Icon size={20} />
                </span>
                {label}
              </a>
            )
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-end gap-3 px-8 py-4 bg-zoopsy-bg border-b border-gray-100">
          <button className="text-zoopsy-gray hover:text-zoopsy-green-700 transition-colors">
            <MdNotifications size={22} />
          </button>
          <UserButton />
        </header>

        {/* Page content */}
        <main className="flex-1 p-8 bg-zoopsy-mint">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
