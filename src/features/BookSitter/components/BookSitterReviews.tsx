import { MdStar, MdStarOutline } from 'react-icons/md';
import { format, parseISO } from 'date-fns';
import { uk } from 'date-fns/locale';
import type { Review } from '@api/review';

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => i + 1).map((star) =>
        star <= rating ? (
          <MdStar key={star} className="text-yellow-400 text-base" />
        ) : (
          <MdStarOutline key={star} className="text-zoopsy-light-gray text-base" />
        ),
      )}
    </div>
  );
}

type Props = {
  reviews: Review[];
};

export function BookSitterReviews({ reviews }: Props) {
  if (reviews.length === 0) return null;

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-plus-jakarta font-bold text-zoopsy-dark-gray text-lg">Відгуки</h2>
        <div className="flex items-center gap-1.5">
          <MdStar className="text-yellow-400 text-lg" />
          <span className="font-plus-jakarta font-bold text-zoopsy-dark-gray text-sm">
            {averageRating.toFixed(1)}
          </span>
          <span className="font-inter text-zoopsy-gray text-sm">({reviews.length} відгуки)</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {reviews.map((review, idx) => (
          <div key={idx} className="rounded-xl border border-zoopsy-light-gray/40 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.authorUserId}`}
                  alt={review.authorFullName ?? review.authorUserId}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-inter font-semibold text-zoopsy-dark-gray text-sm">
                  {review.authorFullName ?? review.authorUserId}
                </p>
                <p className="font-inter text-xs text-zoopsy-gray">
                  {format(parseISO(review.createdAt), 'd MMMM, yyyy', { locale: uk })}
                </p>
              </div>
              <StarRating rating={review.rating} />
            </div>
            <p className="font-inter text-sm text-zoopsy-dark-gray leading-relaxed">
              &ldquo;{review.comment}&rdquo;
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
