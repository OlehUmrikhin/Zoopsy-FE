import { useMutation, useQueryClient } from '@tanstack/react-query';
import { disconnectCalendar, createNote, updateNote, deleteNote } from './fetchers';
import { notesQueryKey } from './queries';

export function useDisconnectCalendar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: disconnectCalendar,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['calendar', 'status'] }),
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notesQueryKey }),
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notesQueryKey }),
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notesQueryKey }),
  });
}
