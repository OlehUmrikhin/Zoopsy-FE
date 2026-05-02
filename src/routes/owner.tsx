import { createFileRoute } from '@tanstack/react-router'
import { OwnerProfilePage } from '../features/OwnerProfile'

export const Route = createFileRoute('/owner')({
  component: OwnerProfilePage,
})
