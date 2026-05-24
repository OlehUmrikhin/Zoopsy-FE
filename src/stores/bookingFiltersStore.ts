import { create } from 'zustand';

type BookingFilters = {
  serviceType: number | undefined;
  startDate: string | undefined;
  endDate: string | undefined;
  petId: string | undefined;
};

type BookingFiltersStore = BookingFilters & {
  setFilters: (filters: BookingFilters) => void;
  clearFilters: () => void;
};

export const useBookingFiltersStore = create<BookingFiltersStore>((set) => ({
  serviceType: undefined,
  startDate: undefined,
  endDate: undefined,
  petId: undefined,
  setFilters: (filters) => set(filters),
  clearFilters: () =>
    set({ serviceType: undefined, startDate: undefined, endDate: undefined, petId: undefined }),
}));
