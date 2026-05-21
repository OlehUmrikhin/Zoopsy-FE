import { createFileRoute } from '@tanstack/react-router'
import { FinancePage } from '@api/admin/FinancePage'

export const Route = createFileRoute('/admin/finances')({
  component: RouteComponent,
})

function RouteComponent() {
  return <FinancePage />
}
