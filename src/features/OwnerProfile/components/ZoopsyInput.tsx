import { forwardRef, type ReactNode } from 'react';
import { Input, type InputProps } from '@heroui/react';
import cn from 'classnames';

type ZoopsyInputProps = {
  label?: string;
  endContent?: ReactNode;
  wrapperClassName?: string;
} & Omit<InputProps, 'variant' | 'className'>;

export const ZoopsyInput = forwardRef<HTMLInputElement, ZoopsyInputProps>(
  ({ label, endContent, wrapperClassName, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className={cn('flex flex-col gap-1', wrapperClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-[10px] uppercase tracking-widest font-inter font-semibold text-zoopsy-gray"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <Input
            ref={ref}
            id={inputId}
            className={cn(
              'bg-zoopsy-mint rounded-xl h-12 px-3',
              'text-zoopsy-dark-gray font-inter text-sm w-full outline-none',
              'hover:bg-zoopsy-mint focus:bg-zoopsy-mint',
              endContent != null ? 'pr-10' : undefined,
            )}
            {...props}
          />
          {endContent && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {endContent}
            </div>
          )}
        </div>
      </div>
    );
  },
);

ZoopsyInput.displayName = 'ZoopsyInput';
