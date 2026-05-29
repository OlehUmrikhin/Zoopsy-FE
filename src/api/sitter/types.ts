export type WorkSchedule = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

export type SitterService = {
  serviceType: number;
  petSpecies: number;
  pricePerUnit: number;
};

export type SitterProfile = {
  id: number;
  userId: string;
  fullName: string;
  email: string;
  gender: string;
  city: string;
  address: string;
  phoneNumber: string;
  experienceYears: number;
  housingType: string;
  description: string;
  rating: number;
  workSchedules: WorkSchedule[];
  services: SitterService[];
  dogWeightPreferences: number[];
  latitude?: number;
  longitude?: number;
};

export type SitterSearchParams = {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  serviceType?: number;
  petSpecies?: number;
  housingType?: string[];
  minExperienceYears?: number;
  gender?: string[];
  dogWeightCategory?: number;
  minRating?: number;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
};

export type SitterSearchResult = Pick<
  SitterProfile,
  | 'userId'
  | 'fullName'
  | 'gender'
  | 'city'
  | 'experienceYears'
  | 'housingType'
  | 'description'
  | 'rating'
  | 'services'
  | 'dogWeightPreferences'
  | 'latitude'
  | 'longitude'
>;

export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};
