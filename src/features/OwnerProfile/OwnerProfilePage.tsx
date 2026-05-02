import { OwnerBalanceCard } from './components/OwnerBalanceCard'
import { OwnerCurrentBooking } from './components/OwnerCurrentBooking'
import { OwnerProfileForm } from './components/OwnerProfileForm'

export function OwnerProfilePage() {
  return (
    <div className="min-h-screen bg-zoopsy-mint px-8 pb-8">
      <div className="mb-8 text-left">
        <h1 className="text-8 font-bold text-zoopsy-dark-gray font-plus-jakarta leading-tight mb-1 mt-0!">
          Кабінет власника
        </h1>
        <p className="text-zoopsy-gray font-inter text-sm">
          Керуйте своїм профілем та домашніми улюбленцями в одному місці
        </p>
      </div>

      <div className="flex gap-6 items-start">
        {/* Left column */}
        <div className="w-[360px] flex-shrink-0 flex flex-col gap-5">
          <OwnerBalanceCard />
          <OwnerCurrentBooking />
        </div>

        {/* Right column */}
        <div className="flex-1">
          <OwnerProfileForm />
        </div>
      </div>
    </div>
  )
}
