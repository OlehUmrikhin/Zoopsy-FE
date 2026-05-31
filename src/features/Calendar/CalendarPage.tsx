import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearch } from '@tanstack/react-router';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addMonths, subMonths } from 'date-fns';
import { uk } from 'date-fns/locale';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useMyNotes, useCreateNote, useUpdateNote, useDeleteNote } from '@api/calendar';
import type { PetCareNote } from '@api/calendar';
import { useCurrentUser } from '@api/user';
import { NoteModal } from './NoteModal';

const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales: { uk } });

const messages = {
  next: 'Вперед',
  previous: 'Назад',
  today: 'Сьогодні',
  month: 'Місяць',
  week: 'Тиждень',
  day: 'День',
  agenda: 'Список',
  date: 'Дата',
  time: 'Час',
  event: 'Подія',
  noEventsInRange: 'Немає нотаток в цьому діапазоні.',
};

type CalendarView = 'month' | 'week' | 'agenda';

type ModalState =
  | { type: 'create'; date: Date }
  | { type: 'edit'; note: PetCareNote };

type SearchParams = { connected?: string; error?: string };

function CustomToolbar({ date, view, onNavigate, onView }: {
  date: Date;
  view: CalendarView;
  onNavigate: (action: 'PREV' | 'NEXT' | 'TODAY') => void;
  onView: (view: CalendarView) => void;
}) {
  const label = format(date, 'LLLL yyyy', { locale: uk });
  const views: { key: CalendarView; label: string }[] = [
    { key: 'month', label: 'Місяць' },
    { key: 'week', label: 'Тиждень' },
    { key: 'agenda', label: 'Список' },
  ];

  return (
    <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onNavigate('PREV')}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-600"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => onNavigate('TODAY')}
          className="px-3 py-1.5 text-sm rounded-lg hover:bg-gray-100 transition text-gray-600 font-medium"
        >
          Сьогодні
        </button>
        <button
          onClick={() => onNavigate('NEXT')}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-600"
        >
          <ChevronRight size={18} />
        </button>
        <span className="text-base font-semibold text-zoopsy-dark-gray capitalize ml-1">{label}</span>
      </div>
      <div className="flex rounded-lg border border-gray-200 overflow-hidden">
        {views.map((v) => (
          <button
            key={v.key}
            onClick={() => onView(v.key)}
            className={`px-3 py-1.5 text-sm transition ${
              view === v.key
                ? 'bg-zoopsy-green text-white font-medium'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function CalendarPage() {
  const search = useSearch({ strict: false }) as SearchParams;
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<ModalState | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<CalendarView>('month');

  const { data: notes = [], isLoading: notesLoading } = useMyNotes();
  const { data: currentUser } = useCurrentUser();
  const pets = currentUser?.pets ?? [];

  const { mutate: createNote, isPending: isCreating } = useCreateNote();
  const { mutate: updateNote, isPending: isUpdating } = useUpdateNote();
  const { mutate: deleteNote, isPending: isDeleting } = useDeleteNote();

  useEffect(() => {
    if (search.connected === 'true') {
      toast.success('Google Calendar успішно підключено!');
      queryClient.invalidateQueries({ queryKey: ['calendar', 'status'] });
    }
    if (search.error) {
      toast.error('Не вдалося підключити Google Calendar. Спробуйте ще раз.');
    }
  }, [search.connected, search.error, queryClient]);

  function handleSelectSlot({ start }: { start: Date }) {
    setModal({ type: 'create', date: start });
  }

  function handleSelectEvent(event: { resource: PetCareNote }) {
    setModal({ type: 'edit', note: event.resource });
  }

  function handleSave(data: { title: string; description: string; petId: string; startDate: string; endDate: string }) {
    const payload = {
      title: data.title,
      description: data.description || undefined,
      petId: data.petId || undefined,
      startDate: data.startDate,
      endDate: data.endDate,
    };

    if (modal?.type === 'create') {
      createNote(payload, {
        onSuccess: () => { toast.success('Нотатку додано!'); setModal(null); },
        onError: () => toast.error('Не вдалося додати нотатку.'),
      });
    } else if (modal?.type === 'edit') {
      updateNote({ id: modal.note.id, ...payload }, {
        onSuccess: () => { toast.success('Нотатку оновлено!'); setModal(null); },
        onError: () => toast.error('Не вдалося оновити нотатку.'),
      });
    }
  }

  function handleDelete() {
    if (modal?.type !== 'edit') return;
    deleteNote(modal.note.id, {
      onSuccess: () => { toast.success('Нотатку видалено.'); setModal(null); },
      onError: () => toast.error('Не вдалося видалити нотатку.'),
    });
  }

  const handleNavigate = useCallback((action: 'PREV' | 'NEXT' | 'TODAY') => {
    if (action === 'PREV') setCurrentDate((d) => subMonths(d, 1));
    else if (action === 'NEXT') setCurrentDate((d) => addMonths(d, 1));
    else setCurrentDate(new Date());
  }, []);

  const calendarComponents = useMemo(() => ({
    toolbar: (props: { date: Date }) => (
      <CustomToolbar
        date={props.date}
        view={currentView}
        onNavigate={handleNavigate}
        onView={setCurrentView}
      />
    ),
  }), [currentView, handleNavigate]);

  const events = notes.map((note) => ({
    id: note.id,
    title: note.petName ? `${note.title} (${note.petName})` : note.title,
    start: new Date(note.startDate + 'T00:00:00'),
    end: new Date(note.endDate + 'T00:00:00'),
    allDay: true,
    resource: note,
  }));

  const eventPropGetter = () => ({
    style: {
      backgroundColor: '#10b981',
      borderRadius: '6px',
      border: 'none',
      color: '#fff',
      fontSize: '12px',
      padding: '2px 6px',
    },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-plus-jakarta font-bold text-2xl text-zoopsy-dark-gray">
          Календар догляду
        </h1>
        <p className="text-sm text-gray-400">Натисніть на день, щоб додати нотатку</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5" style={{ height: 620 }}>
        {notesLoading ? (
          <div className="h-full flex items-center justify-center text-gray-400">Завантаження...</div>
        ) : (
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            culture="uk"
            messages={messages}
            eventPropGetter={eventPropGetter}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            date={currentDate}
            view={currentView}
            onNavigate={(date) => setCurrentDate(date)}
            onView={(view) => setCurrentView(view as CalendarView)}
            components={calendarComponents}
            style={{ height: '100%' }}
          />
        )}
      </div>

      {modal && (
        <NoteModal
          initialDate={modal.type === 'create' ? modal.date : undefined}
          note={modal.type === 'edit' ? modal.note : undefined}
          pets={pets}
          onClose={() => setModal(null)}
          onSave={handleSave}
          onDelete={modal.type === 'edit' ? handleDelete : undefined}
          isSaving={isCreating || isUpdating}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
