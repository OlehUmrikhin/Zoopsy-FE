import { useUser } from '@clerk/react'
import { OwnerProfilePage } from '../OwnerProfile'
import { SitterProfilePage } from '../SitterProfile'

export function ProfilePage() {
  const { user } = useUser()
  const role = user?.publicMetadata?.role

  if (role === 'owner') return <OwnerProfilePage />
  if (role === 'sitter') return <SitterProfilePage />
}
