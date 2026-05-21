import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MdEdit, MdCheck, MdPercent } from 'react-icons/md';
import type { ChartData } from '@api/admin/finance';
import { formatCurrency } from './utils';

// 1. Графік Доходів
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-xl shadow-md border border-gray-100">
        <p className="font-bold text-zoopsy-dark-gray font-plus-jakarta">{formatCurrency(payload[0].value)}</p>
        <p className="text-xs text-zoopsy-gray font-inter">Дохід</p>
      </div>
    );
  }
  return null;
};

export const FinanceChart: React.FC<{ data?: ChartData[]; isLoading?: boolean }> = ({ data, isLoading }) => {
  if (isLoading || !data) {
    return <div className="bg-white rounded-[24px] p-6 h-[350px] shadow-sm animate-pulse border border-gray-100"></div>;
  }

  const maxValue = data.length > 0 ? Math.max(...data.map((d) => d.value)) : 0;

  return (
    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 h-[350px] flex flex-col">
      <h3 className="text-lg font-bold font-plus-jakarta text-zoopsy-dark-gray mb-6">Дохід за 6 місяців</h3>
      <div className="flex-1 w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis 
              dataKey="label" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }} 
              dy={10} 
            />
            <Tooltip cursor={{ fill: '#F3F4F6', radius: 6 }} content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[6, 6, 6, 6]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.value === maxValue ? '#10b981' : '#a7f3d0'} // emerald-500 : emerald-200
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// 2. Віджет управління комісією
interface CommissionProps {
  rate?: number;
  isLoading?: boolean;
  onUpdate: (val: number) => void;
  isUpdating?: boolean;
}

export const CommissionWidget: React.FC<CommissionProps> = ({ rate, isLoading, onUpdate, isUpdating }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    if (rate !== undefined) setEditValue(rate.toString());
  }, [rate]);

  const handleSave = () => {
    const num = parseFloat(editValue);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      onUpdate(num);
      setIsEditing(false);
    }
  };

  if (isLoading) {
    return <div className="bg-white rounded-[24px] p-6 h-[350px] shadow-sm animate-pulse border border-gray-100"></div>;
  }

  return (
    <div className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-100 h-[350px] flex flex-col items-center justify-center text-center relative overflow-hidden">
      <div className="w-16 h-16 bg-zoopsy-mint text-zoopsy-green-700 rounded-full flex items-center justify-center text-2xl mb-6">
        <MdPercent />
      </div>
      
      <h3 className="text-lg font-bold font-plus-jakarta text-zoopsy-dark-gray mb-2">Комісія платформи</h3>
      <p className="text-sm text-zoopsy-gray font-inter mb-6">Відсоток, який утримується з кожної транзакції.</p>

      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="w-24 text-center text-2xl font-bold border-b-2 border-zoopsy-green-500 focus:outline-none pb-1 text-zoopsy-dark-gray"
            autoFocus
          />
          <button onClick={handleSave} disabled={isUpdating} className="ml-2 w-10 h-10 bg-zoopsy-green-500 text-white rounded-xl flex items-center justify-center hover:bg-zoopsy-green-700 transition-colors">
            <MdCheck />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3 group">
          <span className="text-5xl font-extrabold text-zoopsy-green-700 font-plus-jakarta tracking-tighter">{rate ?? '—'}<span className="text-3xl text-zoopsy-green-500 ml-1">%</span></span>
          <button onClick={() => setIsEditing(true)} className="opacity-0 group-hover:opacity-100 w-10 h-10 bg-zoopsy-bg text-zoopsy-gray rounded-xl flex items-center justify-center hover:text-zoopsy-green-700 transition-all">
            <MdEdit />
          </button>
        </div>
      )}
    </div>
  );
};