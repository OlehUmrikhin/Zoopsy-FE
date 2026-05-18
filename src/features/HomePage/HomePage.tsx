import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import { useOwnerProfile } from '@api'
import { RangeCalendar, Calendar } from '@heroui/react'
import { today, getLocalTimeZone } from '@internationalized/date'
import type { CalendarDate } from '@internationalized/date'
import { format } from 'date-fns'
import { uk } from 'date-fns/locale'
import cn from 'classnames'
import { MdSearch, MdKeyboardArrowDown, MdCalendarToday } from 'react-icons/md'

const SERVICE_TYPES = [
  { value: 0, label: 'Перетримка' },
  { value: 1, label: 'Прогулянка' },
  { value: 2, label: 'Грумерство' },
  { value: 3, label: 'Ветеринарство' },
]

const CITY_OPTIONS = [
  { value: 'kyiv', label: 'Київ' },
  { value: 'lviv', label: 'Львів' },
  { value: 'kharkiv', label: 'Харків' },
  { value: 'odesa', label: 'Одеса' },
  { value: 'dnipro', label: 'Дніпро' },
]

type DateRange = { start: CalendarDate; end: CalendarDate }

function calendarDateToJsDate(cd: CalendarDate): Date {
  return new Date(cd.year, cd.month - 1, cd.day)
}

function formatDateRange(range: DateRange | null, singleDay = false): string {
  if (!range) return singleDay ? 'Виберіть дату' : 'Виберіть дати'
  const start = format(calendarDateToJsDate(range.start), 'd MMM', { locale: uk })
  if (singleDay) return start
  const end = format(calendarDateToJsDate(range.end), 'd MMM', { locale: uk })
  return `${start} – ${end}`
}

export function HomePage() {
  const navigate = useNavigate()
  const { data: ownerProfile, isLoading: isProfileLoading } = useOwnerProfile()

  const [selectedService, setSelectedService] = useState<number | null>(null)
  const [selectedPetId, setSelectedPetId] = useState<string>('')
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [dateRange, setDateRange] = useState<DateRange | null>(null)
  const [startTime, setStartTime] = useState<string>('')
  const [endTime, setEndTime] = useState<string>('')
  const [showDatePicker, setShowDatePicker] = useState(false)

  const datePickerRef = useRef<HTMLDivElement>(null)
  const dateTriggerRef = useRef<HTMLButtonElement>(null)

  const isBoarding = selectedService === 0

  const pets = ownerProfile?.pets ?? []
  const hasPets = pets.length > 0
  const selectedPet = pets.find((p) => p.id === selectedPetId)

  const canSearch =
    selectedService !== null &&
    selectedPetId !== '' &&
    selectedCity !== '' &&
    dateRange !== null &&
    startTime !== '' &&
    endTime !== ''

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(e.target as Node) &&
        dateTriggerRef.current &&
        !dateTriggerRef.current.contains(e.target as Node)
      ) {
        setShowDatePicker(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function handleSearch() {
    if (!canSearch) return
    const isDog = selectedPet?.species === 0
    const weight = selectedPet?.weight
    const dogWeightCategory = isDog && weight != null
      ? weight < 10 ? 0 : weight <= 25 ? 1 : 2
      : undefined
    navigate({
      to: '/find-sitter',
      search: {
        city: selectedCity,
        serviceType: selectedService!,
        petSpecies: selectedPet?.species,
        dogWeightCategory,
      },
    })
  }

  const dateLabel = dateRange
    ? `${formatDateRange(dateRange, !isBoarding)}${startTime && endTime ? `  ${startTime}–${endTime}` : ''}`
    : selectedService === null
      ? 'Оберіть послугу'
      : isBoarding ? 'Виберіть дати' : 'Виберіть дату'

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
            Преміальні послуги з догляду за домашніми тваринами та вигулу, адаптовані до унікальної
            особистості вашого улюбленця та вашого спокою.
          </p>
        </div>

        {/* Service tabs */}
        <div className="flex gap-2 flex-wrap justify-center">
          {SERVICE_TYPES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => {
                const next = selectedService === s.value ? null : s.value
                if (next !== selectedService) setDateRange(null)
                setSelectedService(next)
              }}
              className={cn(
                'px-5 py-2.5 rounded-full font-inter font-semibold text-sm transition-all duration-150',
                selectedService === s.value
                  ? 'bg-zoopsy-green-900 text-white shadow-lg'
                  : 'bg-white/90 text-zoopsy-dark-gray hover:bg-white shadow-sm',
              )}
            >
              {s.label}
            </button>
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
                    {(!isProfileLoading && !hasPets) ? (
                      <Link
                        to="/profile"
                        className="font-inter text-sm text-zoopsy-green-900 font-semibold hover:underline block text-left"
                      >
                        Додайте тварину у профілі
                      </Link>
                    ) : (
                      <>
                        <select
                          value={selectedPetId}
                          onChange={(e) => setSelectedPetId(e.target.value)}
                          className={cn(
                            'w-full bg-transparent font-inter text-sm outline-none appearance-none pr-5 cursor-pointer text-left',
                            selectedPetId === '' ? 'text-zoopsy-gray' : 'text-zoopsy-dark-gray'
                          )}
                        >
                          <option value="" disabled hidden>Оберіть тварину</option>
                          {pets.map((pet) => (
                            <option key={pet.id} value={pet.id}>
                              {pet.name}
                            </option>
                          ))}
                        </select>
                        <MdKeyboardArrowDown className="absolute right-0 top-1/2 -translate-y-1/2 text-zoopsy-gray pointer-events-none" />
                      </>
                    )}
                  </div>
            </div>

            {/* City field */}
            <div className="flex-1 px-5 py-3.5 min-w-0">
              <p className="text-[10px] uppercase tracking-widest font-inter font-semibold text-zoopsy-gray mb-1.5 text-left">
                Локація
              </p>
              <div className="relative">
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className={cn(
                      'w-full bg-transparent font-inter text-sm outline-none appearance-none pr-5 cursor-pointer',
                      selectedCity === '' ? 'text-zoopsy-gray' : 'text-zoopsy-dark-gray'
                    )}
                  >
                    <option value="" disabled hidden>Введіть місто</option>
                  {CITY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <MdKeyboardArrowDown className="absolute right-0 top-1/2 -translate-y-1/2 text-zoopsy-gray pointer-events-none" />
              </div>
            </div>

            {/* Date field */}
            <div className="flex-1 px-5 py-3.5 relative min-w-0">
              <p className="text-[10px] uppercase tracking-widest font-inter font-semibold text-zoopsy-gray mb-1.5 text-left">
                Дата
              </p>
              <button
                ref={dateTriggerRef}
                type="button"
                onClick={() => selectedService !== null && setShowDatePicker((v) => !v)}
                disabled={selectedService === null}
                className={cn(
                  'flex items-center gap-1.5 w-full text-left',
                  selectedService === null && 'cursor-not-allowed opacity-50',
                )}
              >
                <span
                  className={cn(
                    'font-inter text-sm flex-1',
                    dateRange ? 'text-zoopsy-dark-gray' : 'text-zoopsy-gray',
                  )}
                >
                  {dateLabel}
                </span>
                <MdCalendarToday className="text-zoopsy-gray text-sm flex-shrink-0" />
              </button>

              {/* Date picker popover */}
              {showDatePicker && (
                <div
                  ref={datePickerRef}
                  className="absolute top-full mt-2 right-0 bg-white rounded-2xl shadow-2xl border border-zoopsy-light-gray/30 p-4 z-50 w-[336px]"
                >
                  {/* Time range inputs */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-inter text-sm text-zoopsy-gray whitespace-nowrap">від</span>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="flex-1 border border-zoopsy-light-gray/60 rounded-lg px-2.5 py-1.5 font-inter text-sm text-zoopsy-dark-gray outline-none focus:border-zoopsy-green-500 transition-colors"
                    />
                    <span className="font-inter text-sm text-zoopsy-gray whitespace-nowrap">до</span>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="flex-1 border border-zoopsy-light-gray/60 rounded-lg px-2.5 py-1.5 font-inter text-sm text-zoopsy-dark-gray outline-none focus:border-zoopsy-green-500 transition-colors"
                    />
                    <span className="font-inter text-xs text-zoopsy-gray whitespace-nowrap">(ГОД)</span>
                  </div>

                  {/* Range calendar (Перетримка) or single-day Calendar */}
                  <div className="flex justify-center">
                    {isBoarding ? (
                      <RangeCalendar
                        aria-label="Trip dates"
                        value={dateRange}
                        onChange={(range) => {
                          if (range) {
                            setDateRange({
                              start: range.start as CalendarDate,
                              end: range.end as CalendarDate,
                            })
                          }
                        }}
                        minValue={today(getLocalTimeZone())}
                      >
                        <RangeCalendar.Header>
                          <RangeCalendar.Heading />
                          <RangeCalendar.NavButton slot="previous" />
                          <RangeCalendar.NavButton slot="next" />
                        </RangeCalendar.Header>
                        <RangeCalendar.Grid>
                          <RangeCalendar.GridHeader>
                            {(day) => <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>}
                          </RangeCalendar.GridHeader>
                          <RangeCalendar.GridBody>
                            {(date) => <RangeCalendar.Cell date={date} />}
                          </RangeCalendar.GridBody>
                        </RangeCalendar.Grid>
                      </RangeCalendar>
                    ) : (
                      <Calendar
                        aria-label="Service date"
                        value={dateRange?.start ?? null}
                        onChange={(date) => {
                          if (date) {
                            const cd = date as CalendarDate
                            setDateRange({ start: cd, end: cd })
                          }
                        }}
                        minValue={today(getLocalTimeZone())}
                      >
                        <Calendar.Header>
                          <Calendar.Heading />
                          <Calendar.NavButton slot="previous" />
                          <Calendar.NavButton slot="next" />
                        </Calendar.Header>
                        <Calendar.Grid>
                          <Calendar.GridHeader>
                            {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                          </Calendar.GridHeader>
                          <Calendar.GridBody>
                            {(date) => <Calendar.Cell date={date} />}
                          </Calendar.GridBody>
                        </Calendar.Grid>
                      </Calendar>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Search button */}
            <div className="p-2 flex items-center flex-shrink-0">
              <button
                type="button"
                onClick={handleSearch}
                disabled={!canSearch}
                className={cn(
                  'flex items-center gap-2 px-6 py-3 rounded-xl font-inter font-semibold text-sm transition-all duration-150',
                  canSearch
                    ? 'bg-zoopsy-green-900 text-white hover:bg-zoopsy-green-700 shadow-md cursor-pointer'
                    : 'bg-zoopsy-light-gray/40 text-zoopsy-gray cursor-not-allowed',
                )}
              >
                <MdSearch className="text-lg" />
                Пошук
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* Mint section – gives the date-picker popover room so the page never grows */}
    <div className="w-full bg-[#DCFFDE]" style={{ minHeight: '380px' }} />
    </div>
  )
}
