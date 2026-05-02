export const USER_PATHS = {
  me: '/api/users/me',
  meRole: '/api/users/me/role',
  meOwnerProfile: '/api/users/me/owner-profile',
  mePet: (id: string) => `/api/users/me/pets/${id}`,
} as const;