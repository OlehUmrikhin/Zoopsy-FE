import { Spinner } from '@heroui/react';
import { useSitterById } from '@api/sitter/queries';
import { SitterInfoHeader } from './components/SitterInfoHeader';
import { SitterInfoAbout } from './components/SitterInfoAbout';
import { SitterInfoServices } from './components/SitterInfoServices';
import { SitterInfoBookingWidget } from './components/SitterInfoBookingWidget';
import { SitterInfoReviews } from './components/SitterInfoReviews';
import type { SitterReview } from './components/SitterInfoReviews';

type Props = {
  userId: string;
};

export function SitterInfoPage({ userId }: Props) {
  const { data: sitter, isLoading } = useSitterById(userId);

  // TODO: replace with real API data when reviews endpoint is available
  const reviews: SitterReview[] = [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zoopsy-mint flex items-center justify-center">
        <Spinner size="lg" color="success" />
      </div>
    );
  }

  if (!sitter) {
    return (
      <div className="min-h-screen bg-zoopsy-mint flex items-center justify-center">
        <p className="font-inter text-zoopsy-gray">Профіль не знайдено</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zoopsy-mint py-8 px-4">
      <div className="max-w-5xl mx-auto flex gap-8 items-start">
        {/* Left column */}
        <div className="flex-1 flex flex-col gap-6">
          <SitterInfoHeader
            userId={sitter.userId}
            fullName={sitter.fullName}
            city={sitter.city}
            rating={sitter.rating}
          />
          {sitter.description && <SitterInfoAbout description={sitter.description} />}
          <SitterInfoServices services={sitter.services} />
          <SitterInfoReviews reviews={reviews} />
        </div>

        {/* Right column — Booking widget */}
        <SitterInfoBookingWidget services={sitter.services} />
      </div>
    </div>
  );
}
