import { queryOptions, useQuery } from '@tanstack/react-query';
import { getCalendarStatus, getMyNotes } from './fetchers';

export const calendarStatusQuery = queryOptions({
  queryKey: ['calendar', 'status'],
  queryFn: getCalendarStatus,
});

export const notesQueryKey = ['calendar', 'notes'] as const;

export function useMyNotes() {
  return useQuery({
    queryKey: notesQueryKey,
    queryFn: getMyNotes,
  });
}
