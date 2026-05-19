import React from 'react';
import { Link } from '@tanstack/react-router';
import { Show } from '@clerk/react';

export interface HeaderProps {
  children?: React.ReactNode;
  logoHref?: string;
  hideNav?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ children, logoHref, hideNav }) => {
  return (
    <header className="w-full bg-zoopsy-bg" style={{ height: 'var(--site-header-height)' }}>
      <nav className="mx-auto flex w-full items-center justify-between px-6 h-full">
        {/* Ліва частина: Логотип + Навігація */}
        <div className="flex items-center h-full gap-8">
          <div className="flex items-center h-full">
            {logoHref ? (
              <Link
                to={logoHref as string}
                className="text-2xl font-bold leading-8 text-zoopsy-green-700 font-plus-jakarta tracking-[-0.6px] hover:opacity-80 transition-opacity"
              >
                Zoopsy
              </Link>
            ) : (
              <span className="text-2xl font-bold leading-8 text-zoopsy-green-700 font-plus-jakarta tracking-[-0.6px]">
                Zoopsy
              </span>
            )}
          </div>
          {!hideNav && (
            <Show when="signed-in">
              <div className="hidden lg:flex items-center gap-5">
                <Link
                  to="/download-apk"
                  className="text-sm font-inter font-medium text-zoopsy-dark-gray hover:text-zoopsy-green-700 transition-colors"
                >
                  Завантаження APK
                </Link>
                <Link
                  to="/map"
                  className="text-sm font-inter font-medium text-zoopsy-dark-gray hover:text-zoopsy-green-700 transition-colors"
                >
                  Найближчі сервіси/Мапа
                </Link>
                <Link
                  to="/ai-assistant"
                  className="text-sm font-inter font-medium text-zoopsy-dark-gray hover:text-zoopsy-green-700 transition-colors"
                >
                  AI-ассистент
                </Link>
                <Link
                  to="/top"
                  className="text-sm font-inter font-medium text-zoopsy-dark-gray hover:text-zoopsy-green-700 transition-colors"
                >
                  Топ найкращих
                </Link>
                <Link
                  to="/calendar"
                  className="text-sm font-inter font-medium text-zoopsy-dark-gray hover:text-zoopsy-green-700 transition-colors"
                >
                  Календар догляду
                </Link>
              </div>
            </Show>
          )}
        </div>

        {/* Права частина: Кнопки, профіль (передаються через children) */}
        <div className="flex items-center h-full gap-6">{children}</div>
      </nav>
    </header>
  );
};
