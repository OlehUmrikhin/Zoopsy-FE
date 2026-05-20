export const USER_PATHS = {
  me: '/api/users/me',
  meRole: '/api/users/me/role',
  meOwnerProfile: '/api/profile/me',
  mePet: (id: string) => `/api/profile/me/pets/${id}`, // Оновлено URL для видалення тварини
} as const;
