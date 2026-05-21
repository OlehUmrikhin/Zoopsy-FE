import React from 'react';
import { MdAccountBalanceWallet, MdReceipt, MdTrendingUp, MdTimeline } from 'react-icons/md';
import classNames from 'classnames';
import type { Metric } from '@api/admin/finance';
import { formatCurrency } from './utils';

interface Props {
  metric?: Metric;
  isLoading?: boolean;
}

const IconMap: Record<string, React.ElementType> = {
  wallet: MdAccountBalanceWallet,
  receipt: MdReceipt,
  trending: MdTrendingUp,
  activity: MdTimeline,
};

export const MetricCard: React.FC<Props> = ({ metric, isLoading }) => {
  if (isLoading || !metric) {
    return (
      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 h-[140px] flex flex-col justify-between animate-pulse">
        <div className="flex justify-between items-center">
          <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
          <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
        </div>
        <div className="space-y-2">
          <div className="w-24 h-4 bg-gray-200 rounded-full"></div>
          <div className="w-32 h-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );
  }

  const Icon = IconMap[metric.iconName] || MdTimeline;
  const isCurrency = metric.id?.includes('revenue') || metric.id?.includes('amount');

  return (
    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex flex-col justify-between h-[140px] transition-transform hover:-translate-y-1">
      <div className="flex justify-between items-start">
        <div className="w-12 h-12 rounded-2xl bg-zoopsy-mint text-zoopsy-green-700 flex items-center justify-center text-2xl">
          <Icon />
        </div>
        {metric.badge && (
          <span className={classNames('px-3 py-1 text-xs font-semibold rounded-full font-inter', {
            'bg-green-100 text-green-700': metric.badgeType === 'success',
            'bg-yellow-100 text-yellow-700': metric.badgeType === 'warning',
            'bg-gray-100 text-gray-600': metric.badgeType === 'neutral' || !metric.badgeType,
          })}>
            {metric.badge}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-zoopsy-gray mb-1 font-inter uppercase tracking-wider text-[10px]">{metric.title}</p>
        <h3 className="text-2xl font-black text-zoopsy-dark-gray font-plus-jakarta">{isCurrency ? formatCurrency(metric.value) : metric.value.toLocaleString('uk-UA')}</h3>
      </div>
    </div>
  );
};