import React from 'react';
import { Link } from '@tanstack/react-router';

export interface HeaderProps {
  children?: React.ReactNode;
  logoHref?: string;
}

export const Header: React.FC<HeaderProps> = ({ children, logoHref }) => {
  return (
    <header className="w-full bg-zoopsy-bg" style={{ height: 'var(--site-header-height)' }}>
      <nav className="mx-auto flex w-full items-center justify-between px-6 h-full">
        <div className="flex items-center h-full">
          {logoHref ? (
            <Link
              to={logoHref as never}
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
        <div className="flex items-center h-full">
          {children}
        </div>
      </nav>
    </header>
  );
};

