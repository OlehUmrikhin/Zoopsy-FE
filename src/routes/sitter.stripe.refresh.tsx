import { createFileRoute } from '@tanstack/react-router';
import StripeRefreshPage from './sitter.stripe.refresh.page';

export const Route = createFileRoute('/sitter/stripe/refresh')({
  component: StripeRefreshPage,
});
