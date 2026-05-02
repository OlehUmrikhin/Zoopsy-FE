import { createFileRoute } from '@tanstack/react-router'
import { SignInPage } from '../features/SignIn'

export const Route = createFileRoute('/sign')({
  component: SignInPage,
})
