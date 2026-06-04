import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/react';
import {
  Modal,
  ModalBackdrop,
  ModalContainer,
  ModalDialog,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';

export function MicroserviceStatsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { getToken, userId } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      fetchStats();
    }
  }, [isOpen, userId]);

  async function fetchStats() {
    try {
      // 1. Загальна статистика
      const globalRes = await fetch(
        `${import.meta.env.VITE_PHP_ZOOPSY_URL}/stats?page=/home&period=7d`,
        {
          credentials: 'include',
        },
      );
      if (globalRes.ok) {
        setStats(await globalRes.json());
      }

      // 2. Статистика конкретного користувача
      if (userId) {
        const userRes = await fetch(
          `${import.meta.env.VITE_PHP_ZOOPSY_URL}/stats?page=/home&period=7d&userId=${userId}`,
          { credentials: 'include' },
        );
        if (userRes.ok) {
          setUserStats(await userRes.json());
        }
      }
    } catch (err) {
      console.error('Visit/Stats error:', err);
    }
  }

  const handleActionClick = async () => {
    try {
      const token = await getToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      await fetch(`${import.meta.env.VITE_PHP_ZOOPSY_URL}/log`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          userId: userId || 'anonymous',
          event: 'log-button-click',
          meta: { section: 'header', page: '/home' },
        }),
        credentials: 'include',
      });
      alert('Дію успішно залоговано в мікросервіс!');
      fetchStats();
    } catch (err) {
      alert('Помилка логування: ' + String(err));
    }
  };

  return (
    <>
      <Button
        onPress={() => setIsOpen(true)}
        variant="ghost"
        className="text-sm font-inter font-medium text-zoopsy-dark-gray hover:text-zoopsy-dark-gray hover:bg-transparent active:bg-transparent active:transform-none active:scale-100 focus:outline-none focus:ring-0"
      >
        Статистика (Мікросервіс)
      </Button>
      <Modal isOpen={isOpen} onOpenChange={(open) => !open && setIsOpen(false)}>
        <ModalBackdrop>
          <ModalContainer size="md">
            <ModalDialog>
              <ModalHeader className="flex flex-col gap-1 text-zoopsy-green-900 font-plus-jakarta mt-2">
                Статистика мікросервісу
              </ModalHeader>
              <ModalBody className="py-4">
                {stats ? (
                  <div className="flex gap-4 mb-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Всі відвідування
                      </span>
                      <span className="text-2xl font-black text-zoopsy-green-800">
                        {stats.total || 0}
                      </span>
                    </div>
                    <div className="flex flex-col border-l border-gray-300 pl-4">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Сесії
                      </span>
                      <span className="text-2xl font-black text-zoopsy-green-800">
                        {stats.total_hosts || 0}
                      </span>
                    </div>
                    {userStats && (
                      <div className="flex flex-col border-l border-zoopsy-green-300 pl-4">
                        <span className="text-xs font-bold text-zoopsy-green-700 uppercase tracking-wider mb-1">
                          Мої візити
                        </span>
                        <span className="text-2xl font-black text-zoopsy-green-800">
                          {userStats.total || 0}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-500 italic animate-pulse py-4">
                    Завантаження статистики...
                  </div>
                )}

                <div className="bg-zoopsy-green-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-600 mb-3">Натисніть кнопку для збереження логу</p>
                  <Button
                    onPress={handleActionClick}
                    className="bg-zoopsy-green-700 text-white shadow w-full font-semibold"
                  >
                    Записати подію у лог
                  </Button>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="outline" onPress={() => setIsOpen(false)}>
                  Закрити
                </Button>
              </ModalFooter>
            </ModalDialog>
          </ModalContainer>
        </ModalBackdrop>
      </Modal>
    </>
  );
}
