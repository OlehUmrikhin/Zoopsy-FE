import { SitterCurrentBooking } from './components/SitterCurrentBooking'
import { SitterBalanceCard } from './components/SitterBalanceCard'
import { SitterRatingCard } from './components/SitterRatingCard'
import { SitterProfileForm } from './components/SitterProfileForm'

export function SitterProfilePage() {
  return (
    <div className="min-h-screen bg-zoopsy-mint px-8 pb-8">
      <div className="mb-8 text-left">
        <h1 className="text-8 font-bold text-zoopsy-dark-gray font-plus-jakarta leading-tight mb-1 mt-0!">
          Професійний кабінет сіттера
        </h1>
        <p className="text-zoopsy-gray font-inter text-sm">
          Керуйте своїм профілем, графіком та послугами в одному місці
        </p>
      </div>

      <div className="flex gap-6 items-start">
        {/* Left column */}
        <div className="w-[360px] flex-shrink-0 flex flex-col gap-5">
          <SitterCurrentBooking />
          <div className="flex gap-4">
            <SitterBalanceCard />
            <SitterRatingCard />
          </div>
        </div>

        {/* Right column */}
        <div className="flex-1">
          <SitterProfileForm />
        </div>
      </div>
    </div>
  )
}
