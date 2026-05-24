import { MdLocationOn, MdStar } from 'react-icons/md';
import { CITY_OPTIONS } from '@components/CitySelect';

function formatCity(city: string) {
  return (
    CITY_OPTIONS.find((o) => o.value === city)?.label ??
    city.charAt(0).toUpperCase() + city.slice(1)
  );
}

type Props = {
  userId: string;
  fullName: string;
  city: string;
  rating: number;
};

export function BookSitterHeader({ userId, fullName, city, rating }: Props) {
  return (
    <div className="bg-white rounded-2xl p-6 flex items-center gap-5">
      <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`}
          alt={fullName}
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <h1 className="font-plus-jakarta font-bold text-zoopsy-dark-gray text-2xl">{fullName}</h1>
        <div className="flex items-center gap-1 mt-1 text-zoopsy-gray font-inter text-sm">
          <MdLocationOn className="text-base flex-shrink-0" />
          <span>{formatCity(city)}</span>
        </div>
        {rating > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <MdStar className="text-yellow-400 text-base" />
            <span className="font-inter font-semibold text-zoopsy-dark-gray text-sm">
              {rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
