import { createFileRoute } from '@tanstack/react-router';
import { TopSittersPage } from '../features/TopPage/TopSittersPage';

export const Route = createFileRoute('/top')({
  component: TopSittersPage,
});
