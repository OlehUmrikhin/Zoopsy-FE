import { format, parseISO } from 'date-fns';

export const formatCurrency = (value: number | undefined | null): string => {
  if (value == null) return '—';
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatDate = (isoString: string | undefined): string => {
  if (!isoString) return '—';
  return format(parseISO(isoString), 'dd.MM.yyyy HH:mm');
};