import { createFileRoute } from '@tanstack/react-router';
import { useClerk } from '@clerk/react';

export const Route = createFileRoute('/blocked')({
  component: BlockedPage,
});

function BlockedPage() {
  const { signOut } = useClerk();

  return (
    <div className="min-h-screen bg-zoopsy-mint flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold font-plus-jakarta text-gray-900 mb-3">
          Акаунт заблоковано
        </h1>
        <p className="text-gray-500 font-inter text-sm mb-8">
          Ваш акаунт заблоковано адміністратором платформи Zoopsy.
          Якщо ви вважаєте це помилкою — зверніться до служби підтримки.
        </p>

        <a
          href="mailto:zoopsy.contact@gmail.com"
          className="block w-full py-3 bg-zoopsy-green-700 hover:bg-zoopsy-green-800 text-white rounded-xl font-semibold font-inter text-sm transition-colors mb-3"
        >
          Написати до підтримки
        </a>

        <button
          onClick={() => signOut({ redirectUrl: '/sign' })}
          className="block w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold font-inter text-sm transition-colors"
        >
          Вийти з акаунту
        </button>
      </div>
    </div>
  );
}
