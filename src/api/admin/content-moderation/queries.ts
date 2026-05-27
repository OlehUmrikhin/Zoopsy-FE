import { useQuery, keepPreviousData, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchContentForModeration, approveContent, rejectContent } from './fetchers';
import type { ContentModerationParams } from './types';

export const contentModerationQueryKeys = {
  all: () => ['admin', 'content-moderation'] as const,
  list: (params: ContentModerationParams) => ['admin', 'content-moderation', params] as const,
};

export function useContentModeration(params: ContentModerationParams) {
  return useQuery({
    queryKey: contentModerationQueryKeys.list(params),
    queryFn: () => fetchContentForModeration(params),
    placeholderData: keepPreviousData,
  });
}

export function useApproveContentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentModerationQueryKeys.all() });
    },
  });
}

export function useRejectContentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rejectContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentModerationQueryKeys.all() });
    },
  });
}
