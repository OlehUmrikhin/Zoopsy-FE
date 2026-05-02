import { MdAccessTime, MdChat } from 'react-icons/md'

const SERVICE_DETAILS = [
  { label: 'Послуга:', value: 'Перетримка' },
  { label: 'Термін:', value: '15.03 - 20.03 (5 діб)' },
  { label: 'Ціна:', value: '2500 грн' },
  { label: 'Пет-сіттер:', value: 'Олена К.' },
]

export function OwnerCurrentBooking() {
  return (
    <div className="bg-white rounded-2xl p-5 text-left flex flex-col gap-4">
      <p className="text-[10px] uppercase tracking-widest text-zoopsy-gray font-inter font-semibold">
        Поточне бронювання
      </p>

      {/* Pet card */}
      <div className="bg-zoopsy-bg rounded-xl p-3 flex items-center gap-3">
        <div className="w-14 h-14 rounded-xl bg-zoopsy-mint flex-shrink-0 overflow-hidden">
          <img
            src="https://placedog.net/200/200"
            alt="Макс"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="font-plus-jakarta font-bold text-zoopsy-dark-gray text-base leading-tight">
            Макс
          </p>
          <p className="text-zoopsy-gray font-inter text-xs mt-0.5">12 КГ</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            <span className="text-green-600 font-inter text-[10px] font-semibold uppercase tracking-wide">
              Активне
            </span>
          </div>
        </div>
      </div>

      {/* Service details */}
      <div className="flex flex-col gap-2">
        {SERVICE_DETAILS.map(({ label, value }) => (
          <div key={label} className="flex justify-between items-center">
            <span className="text-zoopsy-gray font-inter text-sm">{label}</span>
            <span className="text-zoopsy-dark-gray font-inter text-sm font-medium">{value}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-zoopsy-light-gray/60">
        <div className="flex items-center gap-2 text-zoopsy-gray">
          <MdAccessTime className="text-base flex-shrink-0" />
          <span className="text-xs font-inter">Очікування фотозвіту від сіттера</span>
        </div>
        <button
          type="button"
          className="w-9 h-9 rounded-full bg-zoopsy-green-500 text-white flex items-center justify-center hover:bg-zoopsy-green-700 transition-colors"
        >
          <MdChat className="text-base" />
        </button>
      </div>
    </div>
  )
}
