import { createFileRoute } from '@tanstack/react-router';
import { LogsPage } from '../../features/Admin/Logs/LogsPage';

export const Route = createFileRoute('/admin/logs')({
  component: () => <LogsPage />,
});
