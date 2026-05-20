import { useEffect, useMemo, useRef, useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { debounce } from 'lodash-es';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
// Must be defined outside component to keep stable reference and avoid repeated reloads
const LIBRARIES: 'places'[] = ['places'];
const DEBOUNCE_MS = 1000;

// Maps Google's locality name (lowercase) to the app's city key
const CITY_MAP: Record<string, string> = {
  kyiv: 'kyiv',
  київ: 'kyiv',
  lviv: 'lviv',
  львів: 'lviv',
  kharkiv: 'kharkiv',
  харків: 'kharkiv',
  odessa: 'odesa',
  odesa: 'odesa',
  одеса: 'odesa',
  dnipro: 'dnipro',
  дніпро: 'dnipro',
  dnipropetrovsk: 'dnipro',
};

function extractCityKey(place: google.maps.places.PlaceResult): string | null {
  for (const component of place.address_components ?? []) {
    if (component.types.includes('locality')) {
      return CITY_MAP[component.long_name.toLowerCase()] ?? null;
    }
  }
  return null;
}

type Props = {
  value: string;
  onChange: (value: string) => void;
  onCoordinatesChange: (lat: number, lng: number) => void;
  onCityChange?: (cityKey: string) => void;
};

export function AddressAutocomplete({ value, onChange, onCoordinatesChange, onCityChange }: Props) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: API_KEY,
    libraries: LIBRARIES,
  });

  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [open, setOpen] = useState(false);
  const [cityError, setCityError] = useState(false);

  // Session token groups autocomplete requests + one getDetails into a single billing session
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  // PlacesService requires a DOM node for attribution rendering (we hide it)
  const attributionRef = useRef<HTMLDivElement>(null);

  function getSessionToken() {
    if (!sessionTokenRef.current && isLoaded) {
      sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
    }
    return sessionTokenRef.current ?? undefined;
  }

  const fetchPredictions = useMemo(
    () =>
      debounce((input: string) => {
        if (!input || !isLoaded) return;
        const service = new google.maps.places.AutocompleteService();
        service.getPlacePredictions(
          {
            input,
            sessionToken: getSessionToken(),
            componentRestrictions: { country: 'ua' },
            types: ['address'],
          },
          (preds, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && preds) {
              setPredictions(preds);
              setOpen(true);
            } else {
              setPredictions([]);
            }
          },
        );
      }, DEBOUNCE_MS),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoaded],
  );

  useEffect(() => {
    return () => fetchPredictions.cancel();
  }, [fetchPredictions]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    onChange(val);
    setCityError(false);
    if (val.length > 2) {
      fetchPredictions(val);
    } else {
      fetchPredictions.cancel();
      setPredictions([]);
      setOpen(false);
    }
  }

  function handleSelect(prediction: google.maps.places.AutocompletePrediction) {
    setOpen(false);
    setPredictions([]);

    if (!attributionRef.current) return;
    const placesService = new google.maps.places.PlacesService(attributionRef.current);

    placesService.getDetails(
      {
        placeId: prediction.place_id,
        fields: ['formatted_address', 'geometry', 'address_components'],
        // Passing the same session token closes the billing session
        // (all preceding predictions + this getDetails = 1 session charge)
        sessionToken: sessionTokenRef.current ?? undefined,
      },
      (place, status) => {
        // Reset token — next autocomplete interaction starts a new session
        sessionTokenRef.current = null;

        if (status !== google.maps.places.PlacesServiceStatus.OK || !place) return;

        const cityKey = extractCityKey(place);
        if (!cityKey) {
          setCityError(true);
          onChange('');
          return;
        }

        setCityError(false);
        if (place.formatted_address) onChange(place.formatted_address);
        if (place.geometry?.location) {
          onCoordinatesChange(place.geometry.location.lat(), place.geometry.location.lng());
        }
        onCityChange?.(cityKey);
      },
    );
  }

  const inputClass =
    'bg-zoopsy-mint rounded-xl h-12 px-3 text-zoopsy-dark-gray font-inter text-sm w-full outline-none border-none focus:outline-none placeholder:text-zinc-400';

  return (
    <div className="flex flex-col gap-1 relative">
      <label className="text-[10px] uppercase tracking-widest font-inter font-semibold text-zoopsy-gray">
        АДРЕСА
      </label>

      {isLoaded ? (
        <>
          <input
            value={value}
            onChange={handleInputChange}
            onFocus={() => predictions.length > 0 && setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            placeholder="Введіть адресу"
            className={inputClass}
            autoComplete="off"
          />

          {open && predictions.length > 0 && (
            <ul className="absolute top-[4.5rem] left-0 right-0 z-50 bg-white border border-zoopsy-mint rounded-xl shadow-md overflow-hidden">
              {predictions.map((p) => (
                <li
                  key={p.place_id}
                  onMouseDown={() => handleSelect(p)}
                  className="px-4 py-3 text-sm font-inter text-zoopsy-dark-gray hover:bg-zoopsy-mint cursor-pointer"
                >
                  {p.description}
                </li>
              ))}
            </ul>
          )}

          {/* Hidden div required by PlacesService for attribution */}
          <div ref={attributionRef} className="hidden" />

          {cityError && (
            <p className="text-xs text-red-500 font-inter mt-0.5">
              Доступні міста: Київ, Львів, Харків, Одеса, Дніпро
            </p>
          )}
        </>
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Введіть адресу"
          className={inputClass}
          autoComplete="off"
        />
      )}
    </div>
  );
}
