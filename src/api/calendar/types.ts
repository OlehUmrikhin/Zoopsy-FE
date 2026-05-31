export type CalendarStatus = {
  connected: boolean;
};

export type CalendarConnectResponse = {
  url: string;
};

export type PetCareNote = {
  id: string;
  title: string;
  description: string | null;
  petId: string | null;
  petName: string | null;
  startDate: string;
  endDate: string;
  syncedToGoogle: boolean;
};

export type CreateNotePayload = {
  title: string;
  description?: string;
  petId?: string;
  startDate: string;
  endDate: string;
};

export type UpdateNotePayload = CreateNotePayload & { id: string };
