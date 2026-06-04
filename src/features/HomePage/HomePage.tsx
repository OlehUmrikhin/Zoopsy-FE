import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { useAuth } from '@clerk/react';
import { useOwnerProfile } from '@api';
import { Button, Select, ListBox } from '@heroui/react';
import cn from 'classnames';
import { MdSearch } from 'react-icons/md';
import { CitySelect } from '@components';
import { DateRangeFilter } from '@features/FindSitter/components/DateRangeFilter';

const SERVICE_TYPES = [
  { value: 0, label: 'Перетримка' },
  { value: 1, label: 'Прогулянка' },
  { value: 2, label: 'Грумерство' },
  { value: 3, label: 'Ветеринарство' },
];

export function HomePage() {
  const navigate = useNavigate();
  const { data: ownerProfile, isLoading: isProfileLoading } = useOwnerProfile();
  const { getToken, userId } = useAuth();

  const visitedRef = useRef(false);

  useEffect(() => {
    if (visitedRef.current) return;
    visitedRef.current = true;

    async function trackVisit() {
      try {
        const token = await getToken();
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        // Відстеження візиту
        await fetch(`${import.meta.env.VITE_PHP_ZOOPSY_URL}/visit`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            page: '/home',
            userId: userId || 'anonymous',
          }),
          credentials: 'include',
        });
      } catch (err) {
        console.error('Visit error:', err);
      }
    }
    trackVisit();
  }, [getToken, userId]);

  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const isBoarding = selectedService === 0;

  const pets = ownerProfile?.pets ?? [];
  const hasPets = pets.length > 0;

  const canSearch =
    selectedService !== null &&
    selectedPetId !== '' &&
    selectedCity !== '' &&
    startDate !== '' &&
    endDate !== '';

  function handleSearch() {
    if (!canSearch) return;

    const pet = pets.find((p) => p.id === selectedPetId);
    let dogWeightCategory;
    if (pet && pet.species === 0 && pet.weight != null) {
      dogWeightCategory = pet.weight < 10 ? 0 : pet.weight <= 25 ? 1 : 2;
    }

    navigate({
      to: '/find-sitter',
      search: {
        city: selectedCity,
        serviceType: selectedService!,
        petId: selectedPetId,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        petSpecies: pet?.species,
        dogWeightCategory,
      },
    });
  }

  return (
    <div className="flex flex-col w-full">
      <div
        className="relative flex flex-col items-center justify-center"
        style={{
          minHeight: 'calc(100vh - var(--site-header-height) - var(--site-footer-height))',
          backgroundImage: "url('/dog_zoopsy_svg.svg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#eaf8ee',
        }}
      >
        {/* Lighter gradient overlay for a brighter look */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(150deg, rgba(255,255,255,0.18) 0%, rgba(240,255,240,0.14) 40%, rgba(220,255,220,0.10) 70%, rgba(255,255,255,0.04) 100%)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-8 px-4 py-16 w-full max-w-4xl mx-auto text-center">
          {/* Headline */}
          <div className="flex flex-col items-center">
            <h1 className="font-plus-jakarta font-black text-white/95 text-4xl md:text-5xl leading-tight drop-shadow m-0">
              Знайдіть Найкращий догляд для свого
            </h1>
            <p className="font-plus-jakarta font-black italic text-zoopsy-green-900 text-4xl md:text-5xl m-0 drop-shadow">
              Пухнастого друга.
            </p>
            <p className="font-inter text-black/95 mt-8 drop-shadow">
              Преміальні послуги з догляду за домашніми тваринами та вигулу, адаптовані до
              унікальної особистості вашого улюбленця та вашого спокою.
            </p>
          </div>

          {/* Service tabs */}
          <div className="flex gap-2 flex-wrap justify-center">
            {SERVICE_TYPES.map((s) => (
              <Button
                key={s.value}
                onPress={() => {
                  const next = selectedService === s.value ? null : s.value;
                  if (next !== selectedService) {
                    setStartDate('');
                    setEndDate('');
                  }
                  setSelectedService(next);
                }}
                className={cn(
                  'px-5 py-2.5 font-inter font-semibold text-sm transition-all duration-150',
                  selectedService === s.value
                    ? 'bg-zoopsy-green-900 text-white shadow-lg'
                    : 'bg-white/90 text-zoopsy-dark-gray hover:bg-white shadow-sm',
                )}
              >
                {s.label}
              </Button>
            ))}
          </div>

          {/* Search card */}
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-visible">
            <div className="flex items-stretch divide-x divide-zoopsy-light-gray/40">
              {/* Pet field */}
              <div className="flex-1 px-5 py-3.5 min-w-0">
                <p className="text-[10px] uppercase tracking-widest font-inter font-semibold text-zoopsy-gray mb-1.5 text-left">
                  Тварина
                </p>
                <div className="relative">
                  {!isProfileLoading && !hasPets ? (
                    <Link
                      to="/profile"
                      className="font-inter text-sm text-zoopsy-green-900 font-semibold hover:underline block text-left"
                    >
                      Додайте тварину у профілі
                    </Link>
                  ) : (
                    <Select
                      aria-label="Оберіть тварину"
                      placeholder="Оберіть тварину"
                      value={selectedPetId}
                      onChange={(key) => setSelectedPetId(key as string)}
                    >
                      <Select.Trigger>
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          {pets.map((pet) => (
                            <ListBox.Item key={pet.id} id={pet.id} textValue={pet.name}>
                              {pet.name}
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                          ))}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  )}
                </div>
              </div>

              {/* City field */}
              <div className="flex-1 px-5 py-3.5 min-w-0">
                <p className="text-[10px] uppercase tracking-widest font-inter font-semibold text-zoopsy-gray mb-1.5 text-left">
                  Локація
                </p>
                <div className="relative">
                  <CitySelect value={selectedCity} onChange={setSelectedCity} />
                </div>
              </div>

              {/* Date field */}
              <div className="flex-1 px-5 py-3.5 relative min-w-0">
                <p className="text-[10px] uppercase tracking-widest font-inter font-semibold text-zoopsy-gray mb-1.5 text-left">
                  Дата
                </p>
                <DateRangeFilter
                  key={String(selectedService)}
                  isBoarding={isBoarding}
                  isDisabled={selectedService === null}
                  triggerClassName={cn(
                    'bg-transparent p-0 min-w-0 min-h-0 h-auto flex items-center justify-between w-full text-left data-[hover=true]:bg-transparent font-inter text-sm',
                    selectedService === null && 'cursor-not-allowed opacity-50',
                  )}
                  onChange={(s, e) => {
                    setStartDate(s ?? '');
                    setEndDate(e ?? '');
                  }}
                />
              </div>

              {/* Search button */}
              <div className="p-2 flex items-center flex-shrink-0">
                <Button
                  onPress={handleSearch}
                  isDisabled={!canSearch}
                  className={cn(
                    'flex items-center gap-2 px-6 py-3 h-auto rounded-xl font-inter font-semibold text-sm transition-all duration-150',
                    canSearch
                      ? 'bg-zoopsy-green-900 text-white hover:bg-zoopsy-green-700 shadow-md cursor-pointer'
                      : 'bg-zoopsy-light-gray/40 text-zoopsy-gray cursor-not-allowed',
                  )}
                >
                  <MdSearch className="text-lg" />
                  Пошук
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
