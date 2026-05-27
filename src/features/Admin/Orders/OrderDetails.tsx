import React, { useState } from 'react';
import { MdPhone, MdLocationOn, MdStar, MdAccessTime, MdKeyboardArrowRight, MdInfoOutline } from 'react-icons/md';
import { toast } from 'react-toastify';
import { Link } from '@tanstack/react-router';
import { useAdminOrder, useUpdateAdminOrderStatusMutation, useRefundAdminOrderMutation } from '../../../api/admin';
import type { OrderStatus } from '../../../api/admin/types';

// --- Helper Components ---
const StatusBadge = ({ status }: { status: OrderStatus }) => {
  let badgeClasses = 'px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide ';
  let label = '';

  switch (status) {
    case 'COMPLETED':
      badgeClasses += 'bg-green-100 text-green-700';
      label = 'ВИКОНАНО';
      break;
    case 'DISPUTED':
      badgeClasses += 'bg-red-100 text-red-700';
      label = 'СПІР / ПОТРЕБУЄ УВАГИ';
      break;
    case 'ACTIVE':
      badgeClasses += 'bg-blue-100 text-blue-700';
      label = 'В ПРОЦЕСІ';
      break;
    case 'CANCELLED':
      badgeClasses += 'bg-gray-200 text-gray-700';
      label = 'СКАСОВАНО';
      break;
    default:
      badgeClasses += 'bg-gray-100 text-gray-600';
      label = status;
      break;
  }

  return <span className={badgeClasses}>{label}</span>;
};

// --- Main Component ---
interface OrderDetailsProps {
  orderId: string;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({ orderId }) => {
  const { data: order, isLoading, isError, error } = useAdminOrder(orderId);
  const updateStatusMutation = useUpdateAdminOrderStatusMutation();
  const refundMutation = useRefundAdminOrderMutation();

  const [refundType, setRefundType] = useState<'full' | 'partial'>('full');
  const [refundAmount, setRefundAmount] = useState<string>('');
  const [refundComment, setRefundComment] = useState<string>('');

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="p-6 max-w-7xl mx-auto text-center text-red-600">
        <h2 className="text-xl font-bold">Помилка завантаження замовлення</h2>
        <p>{error?.message || 'Замовлення не знайдено'}</p>
        <Link to="/admin/orders" className="text-teal-600 underline mt-4 inline-block">Повернутися до списку</Link>
      </div>
    );
  }

  const handleStatusChange = async (newStatus: OrderStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ id: order.id, status: newStatus });
      toast.success('Статус замовлення успішно оновлено');
    } catch (e) {
      toast.error('Помилка оновлення статусу');
    }
  };

  const handleRefundSubmit = async () => {
    if (refundType === 'partial' && (!refundAmount || isNaN(Number(refundAmount)) || Number(refundAmount) <= 0)) {
      toast.warning('Будь ласка, вкажіть коректну суму для часткового повернення');
      return;
    }
    
    if (!refundComment.trim()) {
      toast.warning('Будь ласка, вкажіть причину повернення у коментарі');
      return;
    }

    try {
      await refundMutation.mutateAsync({
        orderId: order.id,
        type: refundType,
        amount: refundType === 'full' ? undefined : Number(refundAmount),
        comment: refundComment
      });
      toast.success('Запит на повернення коштів успішно надіслано');
      // Reset form
      setRefundType('full');
      setRefundAmount('');
      setRefundComment('');
    } catch (e) {
      toast.error('Помилка під час відправки запиту на повернення');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Шапка контенту */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <Link to="/admin/orders" className="hover:text-teal-600 transition-colors">ЗАМОВЛЕННЯ</Link>
            <MdKeyboardArrowRight className="mx-1" />
            <span className="text-teal-600 font-medium">{order.displayId}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Замовлення #{order.displayId}</h1>
        </div>
        <div>
          <StatusBadge status={order.status} />
        </div>
      </div>

      {/* Основна сітка */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ЛІВА КОЛОНКА (Деталі та управління) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Блок учасників */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Картка Клієнта */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">Клієнт (Власник)</h3>
              <div className="flex items-center gap-4">
                {order.client.avatarUrl ? (
                   <img src={order.client.avatarUrl} alt={order.client.name} className="w-16 h-16 rounded-full object-cover shadow-sm" />
                ) : (
                   <div className="w-16 h-16 rounded-full bg-[#EAF3EF] text-[#2C694E] flex items-center justify-center text-xl font-bold shadow-sm">
                     {order.client.name.substring(0, 2).toUpperCase()}
                   </div>
                )}
                <div>
                  <div className="font-bold text-gray-900 text-lg">{order.client.name}</div>
                  <div className="flex items-center text-gray-600 text-sm mt-1">
                    <MdPhone className="text-teal-500 mr-1" />
                    {order.client.phone || 'Не вказано'}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm mt-1">
                    <MdLocationOn className="text-teal-500 mr-1" />
                    <span className="line-clamp-1">{order.client.address || 'Не вказано'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Картка Сіттера */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">Сіттер</h3>
              <div className="flex items-center gap-4">
                {order.sitter.avatarUrl ? (
                   <img src={order.sitter.avatarUrl} alt={order.sitter.name} className="w-16 h-16 rounded-full object-cover shadow-sm" />
                ) : (
                   <div className="w-16 h-16 rounded-full bg-[#EAF3EF] text-[#2C694E] flex items-center justify-center text-xl font-bold shadow-sm">
                     {order.sitter.name.substring(0, 2).toUpperCase()}
                   </div>
                )}
                <div>
                  <div className="font-bold text-gray-900 text-lg">{order.sitter.name}</div>
                  <div className="flex items-center text-gray-600 text-sm mt-1">
                    <MdStar className="text-yellow-400 mr-1 text-lg" />
                    <span className="font-medium text-gray-800 mr-1">{order.sitter.rating ?? 'N/A'}</span>
                    <span className="text-gray-500">({order.sitter.reviewsCount ?? 0} відгуків)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Картка послуги */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-4 mb-4">Деталі послуги</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <div>
                <div className="text-sm text-gray-500 mb-1">Послуга та тривалість</div>
                <div className="font-medium text-gray-900">{order.serviceDetails.name} • {order.serviceDetails.duration}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Вихованець</div>
                <div className="font-medium text-gray-900">{order.serviceDetails.petName} {order.serviceDetails.petBreed ? `(${order.serviceDetails.petBreed})` : ''}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Дата та час</div>
                <div className="font-medium text-gray-900">{order.serviceDetails.date}, {order.serviceDetails.time}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Загальна сума</div>
                <div className="text-3xl font-bold text-green-600 mt-1">
                  {order.serviceDetails.totalAmount.toLocaleString('uk-UA')} ₴
                </div>
              </div>
            </div>
          </div>

          {/* Блок "Керування замовленням" */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-4 mb-4">Керування замовленням</h3>
            
            <div className="space-y-6">
              {/* Вибір статусу */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Змінити статус</label>
                <select 
                  value={order.status}
                  onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                  disabled={updateStatusMutation.isPending}
                  className="w-full md:w-1/2 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-teal-500 focus:border-teal-500 block p-3 outline-none disabled:opacity-50"
                >
                  <option value="ACTIVE">В процесі (Активно)</option>
                  <option value="COMPLETED">Виконано</option>
                  <option value="DISPUTED">Спір / Потребує уваги</option>
                  <option value="CANCELLED">Скасовано</option>
                </select>
              </div>

              {/* Панель системи повернення */}
              <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                <h4 className="text-red-800 font-semibold mb-4 flex items-center gap-2">
                  <MdInfoOutline className="text-xl" />
                  Система повернення коштів
                </h4>
                
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="refundType" 
                        value="full"
                        checked={refundType === 'full'}
                        onChange={() => setRefundType('full')}
                        className="w-4 h-4 text-teal-600 bg-white border-gray-300 focus:ring-teal-500" 
                      />
                      <span className="text-gray-800">Повне повернення ({order.serviceDetails.totalAmount} ₴)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="refundType" 
                        value="partial"
                        checked={refundType === 'partial'}
                        onChange={() => setRefundType('partial')}
                        className="w-4 h-4 text-teal-600 bg-white border-gray-300 focus:ring-teal-500" 
                      />
                      <span className="text-gray-800">Часткове повернення</span>
                    </label>
                  </div>

                  {refundType === 'partial' && (
                    <div className="max-w-xs transition-all duration-300">
                      <label className="block text-sm text-gray-700 mb-1">Сума повернення (₴)</label>
                      <input 
                        type="number"
                        placeholder="Наприклад: 150"
                        value={refundAmount}
                        onChange={(e) => setRefundAmount(e.target.value)}
                        className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-teal-500 focus:border-teal-500 block p-3 outline-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Внутрішній коментар (причина)</label>
                    <textarea 
                      rows={3}
                      placeholder="Опишіть причину повернення коштів..."
                      value={refundComment}
                      onChange={(e) => setRefundComment(e.target.value)}
                      className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-teal-500 focus:border-teal-500 block p-3 outline-none resize-none"
                    />
                  </div>

                  <button 
                    onClick={handleRefundSubmit}
                    disabled={refundMutation.isPending}
                    className="mt-2 bg-red-700 hover:bg-red-800 text-white font-medium py-3 px-6 rounded-xl transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {refundMutation.isPending ? 'Обробка...' : 'Повернути кошти'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ПРАВА КОЛОНКА (Історія замовлення / Таймлайн) */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-full">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-4 mb-6 flex items-center gap-2">
              <MdAccessTime className="text-teal-600 text-xl" />
              Історія замовлення
            </h3>
            
            <div className="relative border-l-2 border-gray-200 ml-3 space-y-8 pb-4">
              {order.timeline && order.timeline.length > 0 ? (
                order.timeline.map((item) => (
                  <div key={item.id} className="relative pl-6">
                    {/* Індикатор */}
                    <span className={`absolute -left-[9px] top-1 flex h-4 w-4 rounded-full ring-4 ring-white ${item.isLatest ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    
                    <div className="flex flex-col">
                      <h4 className={`text-base font-semibold ${item.isLatest ? 'text-gray-900' : 'text-gray-600'}`}>
                        {item.title}
                      </h4>
                      <span className="text-sm text-gray-500 mt-0.5">{item.date}</span>
                      
                      {item.comment && (
                        <div className="mt-3 p-3 bg-yellow-50 text-yellow-800 text-sm rounded-xl border border-yellow-100 leading-relaxed break-words">
                          {item.comment}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 italic">Історія відсутня</div>
              )}
            </div>

            {order.timeline && order.timeline.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button className="w-full py-2 text-teal-600 font-medium hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-colors text-sm">
                  Дивитися всю історію
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};