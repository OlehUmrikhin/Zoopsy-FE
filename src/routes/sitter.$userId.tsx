import { createFileRoute } from '@tanstack/react-router';
import { SitterInfoPage } from '../features/SitterInfo';

export const Route = createFileRoute('/sitter/$userId')({
  component: function SitterInfoRoute() {
    const { userId } = Route.useParams();
    return <SitterInfoPage userId={userId} />;
  },
});
