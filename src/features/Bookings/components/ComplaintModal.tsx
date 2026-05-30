import { useState } from 'react';
import { toast } from 'react-toastify';
import { useCreateComplaintMutation } from '../../../api/complaints';

interface Props {
  bookingId: string;
  sitterName: string;
  onClose: () => void;
}

export function ComplaintModal({ bookingId, sitterName, onClose }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const mutation = useCreateComplaintMutation();

  const handleSubmit = () => {
    if (!title.trim()) { toast.warning('Вкажіть тему скарги'); return; }
    if (description.trim().length < 10) { toast.warning('Опис має бути не менше 10 символів'); return; }

    mutation.mutate(
      { bookingId, title: title.trim(), description: description.trim() },
      {
        onSuccess: () => {
          toast.success('Скаргу подано. Модератор розгляне її найближчим часом.');
          onClose();
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.error ?? 'Не вдалось подати скаргу');
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-xl font-semibold font-plus-jakarta text-gray-900">Подати скаргу</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              На сіттера: <span className="font-medium text-gray-700">{sitterName}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none">×</button>
        </div>

        <div className="flex flex-col gap-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Тема скарги</span>
            <input
              type="text"
              placeholder="Наприклад: Сіттер не з'явився"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:border-zoopsy-green-500"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Опис ситуації</span>
            <textarea
              placeholder="Опишіть детально що сталось..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              maxLength={1000}
              className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:border-zoopsy-green-500 resize-none"
            />
            <span className="text-xs text-gray-400 mt-0.5 block text-right">{description.length}/1000</span>
          </label>

          <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 text-xs text-amber-800">
            Скарга буде розглянута модератором Zoopsy. Надайте якомога більше деталей для швидкого вирішення.
          </div>
        </div>

        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Скасувати
          </button>
          <button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="rounded-xl bg-rose-700 hover:bg-rose-800 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {mutation.isPending ? 'Надсилання...' : 'Подати скаргу'}
          </button>
        </div>
      </div>
    </div>
  );
}
