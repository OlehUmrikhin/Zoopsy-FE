import { Button } from '@heroui/react'

export function OwnerBalanceCard() {
  return (
    <div className="bg-zoopsy-green-500 rounded-2xl p-6 text-left">
      <p className="text-white/60 font-inter text-[10px] uppercase tracking-widest mb-3">
        Поточний баланс
      </p>
      <div className="text-white font-plus-jakarta font-bold text-5xl mb-6 leading-none">
        2500 <span className="text-2xl font-medium">грн</span>
      </div>
      <Button
        fullWidth
        className="bg-white/20 text-white font-inter font-medium rounded-xl hover:bg-white/30 h-11"
      >
        Поповнити баланс
      </Button>
    </div>
  )
}
