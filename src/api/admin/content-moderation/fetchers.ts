import { axiosInstance } from '../../../lib/axios';
import { ADMIN_PATHS } from '../paths';
import type {
  ContentModerationPaginatedResponse,
  ContentModerationParams,
  ApproveContentPayload,
  RejectContentPayload,
} from './types';

export async function fetchContentForModeration(
  params: ContentModerationParams,
): Promise<ContentModerationPaginatedResponse> {
  const { data } = await axiosInstance.get<ContentModerationPaginatedResponse>(
    ADMIN_PATHS.contentModeration,
    { params },
  );
  return data;
}

export async function approveContent(payload: ApproveContentPayload): Promise<void> {
  await axiosInstance.post(ADMIN_PATHS.approveContent, payload);
}

export async function rejectContent(payload: RejectContentPayload): Promise<void> {
  await axiosInstance.post(ADMIN_PATHS.rejectContent, payload);
}
