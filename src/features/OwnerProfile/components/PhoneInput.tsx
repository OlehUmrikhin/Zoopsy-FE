import type { ChangeEvent } from 'react';
import { Select, Label, ListBox, ListBoxItem } from '@heroui/react';
import cn from 'classnames';

const COUNTRY_CODES = [
  { code: '+380', flag: '🇺🇦', label: '🇺🇦 +380' },
  //   { code: '+1',   flag: '🇺🇸', label: '🇺🇸 +1'   },
  //   { code: '+44',  flag: '🇬🇧', label: '🇬🇧 +44'  },
  //   { code: '+49',  flag: '🇩🇪', label: '🇩🇪 +49'  },
  //   { code: '+48',  flag: '🇵🇱', label: '🇵🇱 +48'  },
];

/** Splits a full phone value like "+38097123456" into { code: "+380", number: "97123456" } */
function splitPhone(value: string) {
  const match = COUNTRY_CODES.find(({ code }) => value.startsWith(code));
  if (match) return { code: match.code, number: value.slice(match.code.length) };
  return { code: '+380', number: value.replace(/^\+?\d{1,4}/, '') };
}

type PhoneInputProps = {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
};

export function PhoneInput({ value = '', onChange, onBlur, name }: PhoneInputProps) {
  const { code, number } = splitPhone(value);

  const handleCodeChange = (key: string | number | null) => {
    onChange?.(`${key ?? '+380'}${number}`);
  };

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 9);
    onChange?.(`${code}${digits}`);
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-widest font-inter font-semibold text-zoopsy-gray">
        Телефон
      </span>
      <div className="flex gap-2">
        {/* Country code select */}
        <Select
          selectedKey={code}
          onSelectionChange={handleCodeChange}
          className="w-[108px] flex-shrink-0"
        >
          <Label className="sr-only">Код країни</Label>
          <Select.Trigger
            className={cn(
              'bg-zoopsy-mint rounded-xl h-12 px-3 w-full',
              'flex items-center justify-between gap-1',
              'text-zoopsy-dark-gray font-inter text-sm outline-none',
              'data-[hovered]:bg-zoopsy-mint/80 data-[pressed]:bg-zoopsy-mint/80',
            )}
          >
            <Select.Value className="text-left flex-1" />
            <Select.Indicator className="text-zoopsy-gray w-4 h-4 flex-shrink-0" />
          </Select.Trigger>
          <Select.Popover className="bg-white rounded-xl shadow-lg border border-zoopsy-light-gray/40 p-1 min-w-[140px]">
            <ListBox className="outline-none">
              {COUNTRY_CODES.map(({ code: c, label }) => (
                <ListBoxItem
                  key={c}
                  id={c}
                  className={cn(
                    'px-3 py-2 rounded-lg font-inter text-sm text-zoopsy-dark-gray',
                    'cursor-pointer outline-none',
                    'data-[hovered]:bg-zoopsy-mint data-[focused]:bg-zoopsy-mint',
                  )}
                >
                  {label}
                </ListBoxItem>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>

        {/* Number input */}
        <input
          name={name}
          value={number}
          onChange={handleNumberChange}
          onBlur={onBlur}
          inputMode="numeric"
          maxLength={9}
          placeholder="123456789"
          className={cn(
            'flex-1 bg-zoopsy-mint rounded-xl h-12 px-3',
            'text-zoopsy-dark-gray font-inter text-sm outline-none',
            'placeholder:text-zoopsy-gray/50',
          )}
        />
      </div>
    </div>
  );
}
