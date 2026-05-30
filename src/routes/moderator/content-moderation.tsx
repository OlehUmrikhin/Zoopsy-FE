import { createFileRoute } from '@tanstack/react-router';
import { ContentModerationPage } from '../../features/Admin/ContentModeration';

export const Route = createFileRoute('/moderator/content-moderation')({
  component: ContentModerationPage,
});
