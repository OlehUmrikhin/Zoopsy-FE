export interface CreateComplaintPayload {
  bookingId: string;
  title: string;
  description: string;
}

export interface CreateComplaintResponse {
  id: string;
}
