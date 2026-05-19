import type { ReactNode } from 'react';
import { Select, Label, ListBox, ListBoxItem, type SelectProps } from '@heroui/react';
import cn from 'classnames';

export { ListBoxItem as ZoopsySelectItem };

type ZoopsySelectProps<T extends object> = {
  label?: string;
  placeholder?: string;
  wrapperClassName?: string;
  children: ReactNode;
} & Omit<SelectProps<T>, 'variant' | 'children'>;

export function ZoopsySelect<T extends object>({
  label,
  wrapperClassName,
  children,
  ...props
}: ZoopsySelectProps<T>) {
  return (
    <div className={cn('flex flex-col gap-1', wrapperClassName)}>
      {label && (
        <span className="text-[10px] uppercase tracking-widest font-inter font-semibold text-zoopsy-gray">
          {label}
        </span>
      )}
      <Select placeholder="Виберіть елемент" {...props}>
        {/* hidden label for a11y — visible label is the span above */}
        <Label className="sr-only">{label}</Label>
        <Select.Trigger
          className={cn(
            'bg-zoopsy-mint rounded-xl h-12 px-3 w-full',
            'flex items-center justify-between gap-2',
            'text-zoopsy-dark-gray font-inter text-sm outline-none',
            'data-[hovered]:bg-zoopsy-mint/80 data-[pressed]:bg-zoopsy-mint/80',
          )}
        >
          <Select.Value className="text-left flex-1" />
          <Select.Indicator className="text-zoopsy-gray w-4 h-4 flex-shrink-0" />
        </Select.Trigger>
        <Select.Popover className="bg-white rounded-xl shadow-lg border border-zoopsy-light-gray/40 p-1 min-w-[var(--trigger-width)]">
          <ListBox className="outline-none">{children}</ListBox>
        </Select.Popover>
      </Select>
    </div>
  );
}
