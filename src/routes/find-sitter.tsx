import { createFileRoute } from '@tanstack/react-router';
import { FindSitterPage } from '../features/FindSitter';

export const Route = createFileRoute('/find-sitter')({
  validateSearch: (search: Record<string, unknown>) => ({
    city: typeof search.city === 'string' ? search.city : undefined,
    serviceType: search.serviceType !== undefined ? Number(search.serviceType) : undefined,
    petId: typeof search.petId === 'string' ? search.petId : undefined,
    startDate: typeof search.startDate === 'string' ? search.startDate : undefined,
    endDate: typeof search.endDate === 'string' ? search.endDate : undefined,
    petSpecies: search.petSpecies !== undefined ? Number(search.petSpecies) : undefined,
    dogWeightCategory:
      search.dogWeightCategory !== undefined ? Number(search.dogWeightCategory) : undefined,
  }),
  component: function FindSitterRoute() {
    const {
      city,
      serviceType,
      petId,
      startDate,
      endDate,
      petSpecies,
      dogWeightCategory,
    } = Route.useSearch();
    return (
      <FindSitterPage
        initialParams={{
          city,
          serviceType,
          startDate,
          endDate,
          petSpecies,
          dogWeightCategory,
        }}
        initialPetId={petId}
      />
    );
  },
});
