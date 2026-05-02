import { createFileRoute } from '@tanstack/react-router'
import { AdminLayout } from '../../features/Admin'

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
})
