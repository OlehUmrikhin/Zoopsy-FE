import { axiosInstance } from '../../lib/axios';
import type { CreateComplaintPayload, CreateComplaintResponse } from './types';

export async function createComplaint(
  payload: CreateComplaintPayload,
): Promise<CreateComplaintResponse> {
  const { data } = await axiosInstance.post<CreateComplaintResponse>('/api/complaints', payload);
  return data;
}
