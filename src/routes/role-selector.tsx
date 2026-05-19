import { RoleSelector } from '../features/RoleSelector';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/role-selector')({
  component: RoleSelector,
});
