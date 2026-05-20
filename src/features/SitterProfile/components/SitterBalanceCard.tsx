import { Button } from '@heroui/react';

export function SitterBalanceCard() {
  return (
    <div className="bg-zoopsy-green-500 rounded-2xl p-5 text-left flex-1">
      <p className="text-white/60 font-inter text-[10px] uppercase tracking-widest mb-2">
        Поточний баланс
      </p>
      <div className="text-white font-plus-jakarta font-bold text-4xl mb-4 leading-none">
        2500 <span className="text-xl font-medium">грн</span>
      </div>
      <Button
        fullWidth
        className="bg-white/20 text-white font-inter font-medium rounded-xl hover:bg-white/30 h-10"
      >
        Вивести
      </Button>
    </div>
  );
}
