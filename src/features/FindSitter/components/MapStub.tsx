import { MdMyLocation } from 'react-icons/md'

export function MapStub() {
  return (
    <div className="relative w-full h-full min-h-[500px] bg-zoopsy-mint rounded-2xl overflow-hidden flex items-center justify-center">
      {/* Grid lines to simulate map tiles */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(#2C694E 1px, transparent 1px), linear-gradient(90deg, #2C694E 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* Curved "roads" */}
      <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,200 Q200,150 400,220 T800,180" stroke="#2C694E" strokeWidth="8" fill="none" />
        <path d="M0,350 Q150,300 300,370 T600,340 T900,360" stroke="#2C694E" strokeWidth="5" fill="none" />
        <path d="M200,0 Q220,200 180,400 T210,600" stroke="#2C694E" strokeWidth="6" fill="none" />
        <path d="M500,0 Q480,150 520,350 T490,600" stroke="#2C694E" strokeWidth="4" fill="none" />
      </svg>

      {/* Center pin */}
      <div className="relative flex flex-col items-center gap-2 z-10">
        <div className="w-14 h-14 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-lg">
          <MdMyLocation className="text-zoopsy-green-900 text-3xl" />
        </div>
        <span className="font-inter text-sm font-semibold text-zoopsy-green-900 bg-white/80 backdrop-blur px-3 py-1 rounded-full shadow">
          Карта незабаром
        </span>
      </div>
    </div>
  )
}
