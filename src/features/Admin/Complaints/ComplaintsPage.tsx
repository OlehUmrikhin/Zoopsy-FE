import { useEffect, useState } from 'react';
import { Search, Image as ImageIcon, Clock } from 'lucide-react';
import { useAdminComplaints } from '../../../api/admin';
import type { AdminComplaint } from '../../../api/admin/types';

const ParticipantCard = ({ user }: { user: AdminComplaint['owner'] }) => (
  <div className="flex-1 bg-white rounded-3xl p-5 flex items-start gap-4 shadow-sm border border-gray-50">
    <img src={user?.avatarUrl ?? ''} alt={user?.name} className="w-14 h-14 rounded-full object-cover shrink-0" />
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0">
          <h3 className="font-bold text-gray-900 truncate">{user?.name || 'Невідомо'}</h3>
          <span className="inline-block mt-0.5 text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">ID: {user?.id}</span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 shrink-0">
          {user?.role?.toLowerCase() === 'owner' ? 'Власник' : 'Сіттер'}
        </span>
      </div>
      <p className="text-xs text-gray-600 mt-2 line-clamp-2">{user?.description}</p>
      <div className="flex gap-2 mt-3">
        <button className="flex-1 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 transition-colors">
          Редагувати профіль
        </button>
        <button className="flex-1 py-1.5 bg-rose-50 hover:bg-rose-100 rounded-lg text-xs font-medium text-rose-700 transition-colors">
          Заблокувати
        </button>
      </div>
    </div>
  </div>
);

export function ComplaintsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading, isError } = useAdminComplaints({
    page: 1,
    limit: 100,
    status: 'all',
    search: searchQuery.trim(),
  });

  const complaints: AdminComplaint[] = data?.items ?? [];
  const newCount = complaints.filter((complaint) => complaint.status?.toLowerCase() === 'active').length;
  const selected = complaints.find((complaint) => complaint.id === selectedId) ?? complaints[0] ?? null;

  useEffect(() => {
    if (!selectedId && complaints.length > 0) {
      setSelectedId(complaints[0].id);
    }
    if (selectedId && complaints.length > 0 && !complaints.some((complaint) => complaint.id === selectedId)) {
      setSelectedId(complaints[0].id);
    }
  }, [complaints, selectedId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-140px)] text-gray-600">
        Завантаження скарг...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-140px)] text-rose-600">
        Помилка при завантаженні скарг. Спробуйте перезавантажити сторінку.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">Управління скаргами</h1>
        <div className="relative w-80">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Пошук квитків модерації..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white rounded-full border border-gray-100 shadow-sm focus:outline-none focus:border-zoopsy-green-500 focus:ring-1 focus:ring-zoopsy-green-500 text-sm" 
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-6 flex-1 min-h-0">
        
        {/* LEFT COLUMN */}
        <div className="w-[340px] flex flex-col bg-white rounded-3xl p-5 shadow-sm min-h-0 shrink-0 border border-gray-50">
          <div className="flex justify-between items-center mb-4 shrink-0">
            <h2 className="font-bold text-gray-900">Активні скарги</h2>
            <span className="bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              {newCount} нові
            </span>
          </div>
          
          <div className="overflow-y-auto flex-1 pr-2 space-y-3 custom-scrollbar">
            {complaints.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">Жодних скарг ще не знайдено</div>
            ) : (
              complaints.map((complaint) => {
                const isActive = selected?.id === complaint.id;
                return (
                  <div 
                    key={complaint.id} 
                    onClick={() => setSelectedId(complaint.id)} 
                    className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                      isActive 
                        ? 'bg-zoopsy-mint border-zoopsy-green-200 shadow-sm' 
                        : 'bg-gray-50 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between text-[11px] text-gray-500 mb-1.5 font-medium">
                      <span className={isActive ? 'text-zoopsy-green-800' : ''}>Квиток #{complaint.ticketId}</span>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{complaint.createdAt}</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-sm text-gray-900 leading-tight">{complaint.title}</h3>
                    <p className={`text-xs mt-1.5 line-clamp-2 ${isActive ? 'text-gray-700' : 'text-gray-500'}`}>
                      {complaint.shortDesc}
                    </p>
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200/60">
                      <img src={complaint.owner?.avatarUrl ?? ''} alt={complaint.owner?.name} className="w-5 h-5 rounded-full" />
                      <span className="text-[11px] font-medium text-gray-600 truncate">{complaint.owner?.name || 'Невідомо'}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex-1 flex flex-col gap-5 min-h-0 min-w-0">
          {selected ? (
            <>
              <div className="flex gap-5 shrink-0">
                <ParticipantCard user={selected.owner} />
                <ParticipantCard user={selected.sitter} />
              </div>

              <div className="flex gap-5 flex-1 min-h-0">
                <div className="w-1/2 flex flex-col bg-white rounded-3xl p-5 shadow-sm min-h-0 border border-gray-50">
                  <h3 className="text-[10px] font-bold text-gray-400 mb-4 tracking-widest uppercase shrink-0">
                    Історія чату
                  </h3>
                  <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar flex flex-col">
                    {selected.chatMessages?.map((msg) => {
                      const isOwner = msg.senderId === selected.owner?.id;
                      return (
                        <div key={msg.id} className={`flex flex-col ${isOwner ? 'items-start' : 'items-end'}`}>
                          <span className="text-[10px] text-gray-400 mb-1 ml-1 mr-1">{msg.senderName} • {msg.timestamp}</span>
                          <div className={`p-3 rounded-2xl max-w-[85%] text-sm ${
                            isOwner 
                              ? 'bg-gray-100 text-gray-800 rounded-tl-sm' 
                              : 'bg-zoopsy-mint text-zoopsy-green-900 rounded-tr-sm'
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="w-1/2 flex flex-col bg-white rounded-3xl p-5 shadow-sm min-h-0 border border-gray-50">
                  <h3 className="text-[10px] font-bold text-gray-400 mb-4 tracking-widest uppercase shrink-0">
                    GPS-метадані, фотозвіти та докази
                  </h3>
                  <div className="flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-1">
                    <div className="h-44 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100 shrink-0 relative group">
                      {selected.evidence?.photoUrl ? (
                        <img src={selected.evidence?.photoUrl} alt="Evidence" className="object-cover w-full h-full" />
                      ) : (
                        <div className="flex flex-col items-center text-gray-300">
                          <ImageIcon size={36} className="mb-2" strokeWidth={1.5} />
                          <span className="text-xs font-medium">Фото не додано</span>
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-gray-600 font-mono bg-gray-50 border border-gray-100 p-3 rounded-xl shrink-0">
                      GPS: LAT: {selected.evidence?.lat ?? 'N/A'}, LONG: {selected.evidence?.lng ?? 'N/A'}
                    </div>

                    <div className="flex gap-3 mt-auto shrink-0">
                      <div className="flex-1 bg-zoopsy-mint/50 p-4 rounded-2xl border border-zoopsy-green-100">
                        <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider font-bold">Відстань до об'єкта</div>
                        <div className={`text-lg font-black ${
                          selected.evidence?.distanceStatus?.toLowerCase() === 'violation' ? 'text-rose-600' : 'text-zoopsy-green-700'
                        }`}>
                          {selected.evidence?.distanceMeters ?? 0} м
                        </div>
                      </div>
                      <div className="flex-1 bg-zoopsy-mint/50 p-4 rounded-2xl border border-zoopsy-green-100">
                        <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-wider font-bold">Цілісність послуги</div>
                        <div className="text-sm font-bold text-gray-900 mt-1">
                          {selected.evidence?.integrityStatus ?? 'Невідомо'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 shrink-0">
                <button 
                  className="flex-1 py-3.5 bg-zoopsy-green-700 text-white rounded-2xl text-sm font-bold shadow-sm shadow-zoopsy-green-700/20 hover:bg-zoopsy-green-800 hover:-translate-y-0.5 transition-all active:translate-y-0"
                  onClick={() => console.log('Reply to ticket', selected.ticketId)}
                >
                  Відповісти на скаргу
                </button>
                <button 
                  className="flex-1 py-3.5 bg-rose-900 text-white rounded-2xl text-sm font-bold shadow-sm shadow-rose-900/20 hover:bg-rose-950 hover:-translate-y-0.5 transition-all active:translate-y-0"
                  onClick={() => console.log('Reject ticket', selected.ticketId)}
                >
                  Відхилити скаргу
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center min-h-[calc(100vh-180px)] bg-white rounded-3xl shadow-sm border border-gray-100 text-gray-500">
              Виберіть скаргу для перегляду
            </div>
          )}
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #e5e7eb;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}
