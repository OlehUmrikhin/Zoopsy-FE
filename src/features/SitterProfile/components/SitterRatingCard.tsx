import { MdStar } from 'react-icons/md';
import { useSitterProfile } from '@api';

export function SitterRatingCard() {
  const { data: sitterProfile } = useSitterProfile();

  return (
    <div className="bg-white rounded-2xl p-5 text-left flex-1">
      <p className="text-zoopsy-gray font-inter text-[10px] uppercase tracking-widest mb-2">
        Ваш рейтинг
      </p>
      <div className="flex items-center gap-1 mb-1">
        <span className="text-zoopsy-dark-gray font-plus-jakarta font-bold text-4xl leading-none">
          {sitterProfile?.rating?.toFixed(1) ?? '—'}
        </span>
        <MdStar className="text-yellow-400 text-3xl" />
      </div>
      <p className="text-zoopsy-gray font-inter text-xs mt-2">На основі відгуків</p>
    </div>
  );
}
