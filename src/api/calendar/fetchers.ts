import { axiosInstance } from '../../lib/axios';
import { CALENDAR_PATHS } from './paths';
import type { CalendarStatus, CalendarConnectResponse, PetCareNote, CreateNotePayload, UpdateNotePayload } from './types';

export async function getCalendarStatus(): Promise<CalendarStatus> {
  const { data } = await axiosInstance.get<CalendarStatus>(CALENDAR_PATHS.status);
  return data;
}

export async function getCalendarConnectUrl(): Promise<string> {
  const { data } = await axiosInstance.get<CalendarConnectResponse>(CALENDAR_PATHS.connect);
  return data.url;
}

export async function disconnectCalendar(): Promise<void> {
  await axiosInstance.delete(CALENDAR_PATHS.disconnect);
}

export async function getMyNotes(): Promise<PetCareNote[]> {
  const { data } = await axiosInstance.get<PetCareNote[]>(CALENDAR_PATHS.notes);
  return data;
}

export async function createNote(payload: CreateNotePayload): Promise<PetCareNote> {
  const { data } = await axiosInstance.post<PetCareNote>(CALENDAR_PATHS.notes, payload);
  return data;
}

export async function updateNote({ id, ...payload }: UpdateNotePayload): Promise<PetCareNote> {
  const { data } = await axiosInstance.put<PetCareNote>(CALENDAR_PATHS.note(id), payload);
  return data;
}

export async function deleteNote(id: string): Promise<void> {
  await axiosInstance.delete(CALENDAR_PATHS.note(id));
}
