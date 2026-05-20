export const SITTER_PATHS = {
  me: '/api/sitter-profile/me',
  list: '/api/sitter-profile/list',
  byId: (userId: string) => `/api/sitter-profile/${userId}`,
} as const;
