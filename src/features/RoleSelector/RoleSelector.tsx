import { useNavigate, Link } from '@tanstack/react-router';
import { useUser } from '@clerk/react';
import { toast } from 'react-toastify';
import { FaPaw } from 'react-icons/fa';
import { FaHouseMedical } from 'react-icons/fa6';
import { useSetUserRole } from '@api';

export const RoleSelector = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const setUserRole = useSetUserRole();

  const handleRoleSelection = async (role: 'owner' | 'sitter') => {
    if (!user) return;

    try {
      await setUserRole.mutateAsync(role);
      toast.success('Роль успішно встановлено!');
      // Зберігаємо роль як bridge поки Clerk propagate publicMetadata після reload
      sessionStorage.setItem('roleJustSet', role);
      window.location.href = '/profile';
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Не вдалося встановити роль');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 bg-zoopsy-mint py-8 px-4 text-zoopsy-dark-gray">
      <div className="max-w-[896px] w-full bg-white rounded-[32px] shadow-sm px-16 py-16 my-auto">
        <div className="text-center mb-12">
          <h2 className="text-[32px] font-bold mb-3 tracking-tight">Ласкаво просимо до Zoopsy</h2>
          <p className="text-zoopsy-gray text-lg">Оберіть вашу роль</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <button
            onClick={() => handleRoleSelection('owner')}
            className="flex flex-col items-center py-10 px-6 bg-zoopsy-bg rounded-[24px] transition-transform hover:-translate-y-1 active:scale-95 text-center group border border-transparent hover:border-zoopsy-green-500"
          >
            <div className="bg-zoopsy-mint p-4 rounded-full mb-6 text-zoopsy-green-900">
              <FaPaw className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Власник тварини</h3>
            <p className="text-zoopsy-muted text-[15px] max-w-[200px] leading-relaxed">
              Шукаю найкращий догляд для мого улюбленця
            </p>
          </button>

          <button
            onClick={() => handleRoleSelection('sitter')}
            className="flex flex-col items-center py-10 px-6 bg-zoopsy-bg rounded-[24px] transition-transform hover:-translate-y-1 active:scale-95 text-center group border border-transparent hover:border-zoopsy-green-500"
          >
            <div className="bg-zoopsy-mint p-4 rounded-full mb-6 text-zoopsy-green-900">
              <FaHouseMedical className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Пет-сіттер</h3>
            <p className="text-zoopsy-muted text-[15px] max-w-[200px] leading-relaxed">
              Хочу доглядати за домашніми тваринами
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
