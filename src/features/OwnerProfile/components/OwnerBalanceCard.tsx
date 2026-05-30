import { Button } from '@heroui/react';
import { useOwnerProfile } from '../../../api/owner';

export function OwnerBalanceCard() {
  const { data: profile, isLoading } = useOwnerProfile();

  const balance = profile?.balance ?? 0;

  return (
    <div className="bg-zoopsy-green-500 rounded-2xl p-6 text-left">
      <p className="text-white/60 font-inter text-[10px] uppercase tracking-widest mb-3">
        Поточний баланс
      </p>
      <div className="text-white font-plus-jakarta font-bold text-5xl mb-6 leading-none">
        {isLoading ? (
          <span className="opacity-50 text-3xl">...</span>
        ) : (
          <>
            {balance.toLocaleString('uk-UA')} <span className="text-2xl font-medium">грн</span>
          </>
        )}
      </div>
      <Button
        fullWidth
        className="bg-white/20 text-white font-inter font-medium rounded-xl hover:bg-white/30 h-11"
      >
        Поповнити баланс
      </Button>
    </div>
  );
}
