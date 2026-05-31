import { createFileRoute } from '@tanstack/react-router';
import { CalendarPage } from '../features/Calendar';

export const Route = createFileRoute('/calendar')({
  component: CalendarPage,
});
