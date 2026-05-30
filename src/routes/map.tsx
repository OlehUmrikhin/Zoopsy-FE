import { createFileRoute } from '@tanstack/react-router';
import { NearbyServicesPage } from '../features/MapPage/NearbyServicesPage';

export const Route = createFileRoute('/map')({
  component: NearbyServicesPage,
});
