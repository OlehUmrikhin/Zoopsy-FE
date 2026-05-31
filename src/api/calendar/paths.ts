export const CALENDAR_PATHS = {
  status: '/api/calendar/status',
  connect: '/api/calendar/connect',
  disconnect: '/api/calendar/disconnect',
  notes: '/api/pet-care-notes',
  note: (id: string) => `/api/pet-care-notes/${id}`,
} as const;
