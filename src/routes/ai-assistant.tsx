import { createFileRoute } from '@tanstack/react-router';
import { AiAssistantPage } from '../features/AiAssistant/AiAssistantPage';

export const Route = createFileRoute('/ai-assistant')({
  component: AiAssistantPage,
});
