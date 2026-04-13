import React from 'react';

export interface HeaderProps {
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ children }) => {
  return (
    <header className="w-full bg-zoopsy-bg">
      <nav className="mx-auto flex w-full items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <span className="cursor-pointer text-2xl font-bold leading-8 text-zoopsy-green-700 font-plus-jakarta tracking-[-0.6px]">
            Zoopsy
          </span>
        </div>
        <div className="flex items-center">
          {children}
        </div>
      </nav>
    </header>
  );
};

