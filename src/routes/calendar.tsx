import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/calendar')({
  component: function CalendarPage() {
    return (
      <div className="p-8 text-center text-zoopsy-dark-gray">Календар догляду (в розробці)</div>
    );
  },
});
