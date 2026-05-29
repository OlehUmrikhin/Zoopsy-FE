import { Spinner } from '@heroui/react';
import { useSitterById } from '@api/sitter/queries';
import { useReviewsBySitter } from '@api/review/queries';
import { BookSitterHeader } from './components/BookSitterHeader';
import { BookSitterAbout } from './components/BookSitterAbout';
import { BookSitterServices } from './components/BookSitterServices';
import { BookSitterBookingWidget } from './components/BookSitterBookingWidget';
import { BookSitterReviews } from './components/BookSitterReviews';

type Props = {
  userId: string;
};

export function BookSitterPage({ userId }: Props) {
  const { data: sitter, isLoading } = useSitterById(userId);
  const { data: reviews = [] } = useReviewsBySitter(sitter?.id);

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
          <BookSitterHeader
            userId={sitter.userId}
            fullName={sitter.fullName}
            city={sitter.city}
            rating={sitter.rating}
          />
          {sitter.description && <BookSitterAbout description={sitter.description} />}
          <BookSitterServices services={sitter.services} />
          <BookSitterReviews reviews={reviews} />
        </div>

        {/* Right column — Booking widget */}
        <BookSitterBookingWidget sitterId={sitter.userId} services={sitter.services} />
      </div>
    </div>
  );
}
