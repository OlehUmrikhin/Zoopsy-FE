import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-zoopsy-bg" style={{ height: 'var(--site-footer-height)' }}>
      <div className="mx-auto flex w-full h-full items-center justify-between gap-6 px-6 sm:flex-row sm:items-center sm:gap-0">
        <div className="flex flex-col gap-1 text-center sm:text-left">
          <span className="font-plus-jakarta text-lg font-bold text-zoopsy-dark-gray">Zoopsy</span>
          <span className="font-inter text-sm font-medium text-zoopsy-dark-gray">
            &copy; 2026 Zoopsy. Сервіс для догляду за домашніми тваринами.
          </span>
        </div>
        <div className="flex flex-col items-center sm:items-end">
          <a
            href="mailto:zoopsy.contact@gmail.com"
            className="font-manrope text-sm text-zoopsy-muted transition-colors hover:text-zoopsy-green-700"
          >
            E-mail: zoopsy.contact@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
};
