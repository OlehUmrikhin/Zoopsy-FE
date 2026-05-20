import { Select, ListBox } from '@heroui/react';

export const CITY_OPTIONS = [
  { value: 'kyiv', label: 'Київ' },
  { value: 'lviv', label: 'Львів' },
  { value: 'kharkiv', label: 'Харків' },
  { value: 'odesa', label: 'Одеса' },
  { value: 'dnipro', label: 'Дніпро' },
];

export interface CitySelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  triggerClassName?: string;
}

export function CitySelect({ value, onChange, className, triggerClassName }: CitySelectProps) {
  return (
    <div className={className}>
      <Select
        aria-label="Оберіть місто"
        placeholder="Оберіть місто"
        value={value}
        onChange={(val) => onChange(val as string)}
      >
        <Select.Trigger className={triggerClassName}>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {CITY_OPTIONS.map((opt) => (
              <ListBox.Item key={opt.value} id={opt.value} textValue={opt.label}>
                {opt.label}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
    </div>
  );
}
