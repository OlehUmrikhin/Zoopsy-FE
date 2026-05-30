import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { financeApi } from '@api/admin/finance';
import { MetricCard } from './MetricCard';
import { FinanceChart, CommissionWidget } from './FinanceWidgets';
import { TransactionTable } from './TransactionTable';

export const FinancePage: React.FC = () => {
  const queryClient = useQueryClient();

  // Дані завантажуються за допомогою react-query
  const { data: metrics, isLoading: isMetricsLoading } = useQuery({
    queryKey: ['adminFinanceMetrics'],
    queryFn: financeApi.getMetrics,
  });

  const { data: chartData, isLoading: isChartLoading } = useQuery({
    queryKey: ['adminFinanceChart'],
    queryFn: financeApi.getChart,
  });

  const { data: commissionData, isLoading: isCommissionLoading } = useQuery({
    queryKey: ['adminFinanceCommission'],
    queryFn: financeApi.getCommission,
  });

  const { data: transactionsData, isLoading: isTransactionsLoading } = useQuery({
    queryKey: ['adminFinanceTransactions', 1],
    queryFn: () => financeApi.getTransactions(1, 10),
  });

  const updateCommission = useMutation({
    mutationFn: financeApi.updateCommission,
    onSuccess: (newData) => {
      queryClient.setQueryData(['adminFinanceCommission'], newData);
      toast.success('Комісію успішно оновлено!');
    },
    onError: () => {
      toast.error('Помилка при оновленні комісії');
    },
  });

  return (
    <div className="font-sans text-zoopsy-dark-gray max-w-[1600px] mx-auto">
      <div className="mb-8 mt-2">
        <h2 className="text-3xl font-bold text-gray-900 font-plus-jakarta tracking-tight">
          Фінанси
        </h2>
        <p className="mt-1 text-zoopsy-gray font-inter">
          Огляд фінансових показників та транзакцій платформи
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isMetricsLoading || !metrics
          ? Array.from({ length: 4 }).map((_, i) => <MetricCard key={i} isLoading={true} />)
          : metrics.map((metric) => <MetricCard key={metric.id} metric={metric} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <FinanceChart data={chartData} isLoading={isChartLoading} />
        </div>
        <div className="lg:col-span-1">
          <CommissionWidget
            rate={commissionData?.rate}
            isLoading={isCommissionLoading}
            isUpdating={updateCommission.isPending}
            onUpdate={(val: number) => updateCommission.mutate(val)}
          />
        </div>
      </div>

      <TransactionTable
        transactions={transactionsData?.data}
        totalCount={transactionsData?.totalCount}
        isLoading={isTransactionsLoading}
      />
    </div>
  );
};
