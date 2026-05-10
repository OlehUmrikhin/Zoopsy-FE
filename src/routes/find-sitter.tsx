import { createFileRoute } from '@tanstack/react-router'
import { FindSitterPage } from '../features/FindSitter'

export const Route = createFileRoute('/find-sitter')({
  component: FindSitterPage,
})
