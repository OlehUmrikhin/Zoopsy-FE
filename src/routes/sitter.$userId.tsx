import { createFileRoute } from '@tanstack/react-router';
import { BookSitterPage } from '../features/BookSitter';

export const Route = createFileRoute('/sitter/$userId')({
  component: function SitterInfoRoute() {
    const { userId } = Route.useParams();
    return <BookSitterPage userId={userId} />;
  },
});
