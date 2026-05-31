import { useState } from 'react';
import { parseISO } from 'date-fns';
import type { PetCareNote } from '@api/calendar';
import type { Pet } from '@api/user';
import { DateRangePicker } from './DateRangePicker';

type SavePayload = {
  title: string;
  description: string;
  petId: string;
  startDate: string;
  endDate: string;
};

type Props = {
  initialDate?: Date;
  note?: PetCareNote;
  pets: Pet[];
  onClose: () => void;
  onSave: (data: SavePayload) => void;
  onDelete?: () => void;
  isSaving: boolean;
  isDeleting: boolean;
};

type Step = 'dates' | 'details';

export function NoteModal({ initialDate, note, pets, onClose, onSave, onDelete, isSaving, isDeleting }: Props) {
  const toDate = (s: string) => parseISO(s);

  const [step, setStep] = useState<Step>(note ? 'details' : 'dates');
  const [startDate, setStartDate] = useState<Date | null>(
    note ? toDate(note.startDate) : initialDate ?? null,
  );
  const [endDate, setEndDate] = useState<Date | null>(
    note ? toDate(note.endDate) : initialDate ?? null,
  );
  const [title, setTitle] = useState(note?.title ?? '');
  const [description, setDescription] = useState(note?.description ?? '');
  const [petId, setPetId] = useState(note?.petId ?? '');

  function handleDateConfirm() {
    if (startDate && endDate) setStep('details');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !startDate || !endDate) return;
    onSave({
      title: title.trim(),
      description: description.trim(),
      petId,
      startDate: startDate.toISOString().slice(0, 10),
      endDate: endDate.toISOString().slice(0, 10),
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-plus-jakarta font-bold text-lg text-zoopsy-dark-gray">
            {note ? 'Редагувати нотатку' : step === 'dates' ? 'Оберіть дати' : 'Деталі нотатки'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        {step === 'dates' ? (
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={(s, e) => { setStartDate(s); setEndDate(e); }}
            onConfirm={handleDateConfirm}
          />
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Selected range — click to go back */}
            {!note && (
              <button
                type="button"
                onClick={() => setStep('dates')}
                className="text-left text-xs text-zoopsy-green font-medium hover:underline"
              >
                ← Змінити дати
              </button>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">Заголовок *</label>
              <input
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-zoopsy-green transition"
                placeholder="Наприклад: Дати ліки Максу"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                autoFocus
              />
            </div>

            {pets.length > 0 && (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600">Тварина</label>
                <select
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-zoopsy-green transition bg-white"
                  value={petId}
                  onChange={(e) => setPetId(e.target.value)}
                >
                  <option value="">Без прив'язки</option>
                  {pets.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">Опис</label>
              <textarea
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-zoopsy-green transition resize-none"
                rows={3}
                placeholder="Додаткові деталі..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex gap-3 mt-1">
              {note && onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={isDeleting}
                  className="flex-1 py-2 rounded-xl border border-red-300 text-red-500 text-sm font-medium hover:bg-red-50 transition disabled:opacity-50"
                >
                  {isDeleting ? 'Видалення...' : 'Видалити'}
                </button>
              )}
              <button
                type="submit"
                disabled={isSaving || !title.trim()}
                className="flex-1 py-2 rounded-xl bg-zoopsy-green text-white text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                {isSaving ? 'Збереження...' : 'Зберегти'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
