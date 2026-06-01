import { createFileRoute } from '@tanstack/react-router';
import { BookSitterPage } from '../features/BookSitter';

export const Route = createFileRoute('/sitter/$userId')({
  validateSearch: (search: Record<string, unknown>) => ({
    info: search.info === true || search.info === 'true',
  }),
  component: function SitterInfoRoute() {
    const { userId } = Route.useParams();
    const { info } = Route.useSearch();
    return <BookSitterPage userId={userId} showWidget={!info} />;
  },
});
