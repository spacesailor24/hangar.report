import { TransmissionType, Category } from '@prisma/client'

interface TransmissionBoxProps {
  title: string
  type: TransmissionType
  categories: Category[]
  date: Date
  summary?: string
}

const typeColors = {
  NEWS: 'text-[var(--accent-nasa)]',
  LEAK: 'text-[var(--accent-warning)]',
  OFFICIAL: 'text-blue-400',
  RUMOR: 'text-purple-400',
}

const typeHeaderColors = {
  NEWS: 'bg-[var(--accent-nasa)] text-black',
  LEAK: 'bg-[var(--accent-warning)] text-black',
  OFFICIAL: 'bg-blue-400 text-white',
  RUMOR: 'bg-purple-400 text-white',
}

const typeDotColors = {
  NEWS: 'text-[var(--accent-nasa)]',
  LEAK: 'text-[var(--accent-warning)]',
  OFFICIAL: 'text-blue-400',
  RUMOR: 'text-purple-400',
}

const categoryColors = {
  SHIPS: 'text-blue-400',
  WEAPONS: 'text-red-400',
  GEAR: 'text-gray-400',
  MEDICAL: 'text-green-400',
  GAMEPLAY: 'text-purple-400',
  ECONOMY: 'text-yellow-400',
  LOCATIONS: 'text-cyan-400',
  LORE: 'text-indigo-400',
  MOB: 'text-pink-400',
  OTHER: 'text-gray-400',
}

export default function TransmissionBox({ 
  title, 
  type, 
  categories, 
  date,
  summary 
}: TransmissionBoxProps) {
  const formatDate = (date: Date) => {
    const month = date.toLocaleDateString('en-US', { month: 'long' })
    const day = date.getDate()
    const suffix = day === 1 || day === 21 || day === 31 ? 'st' :
                   day === 2 || day === 22 ? 'nd' :
                   day === 3 || day === 23 ? 'rd' : 'th'
    return `${month} ${day}${suffix}`
  }
  
  const generateFileId = (title: string, date: Date) => {
    const hash = title.slice(0, 3).toUpperCase() + date.getDate().toString().padStart(2, '0')
    return `TX-${hash}-${date.getFullYear().toString().slice(-2)}`
  }

  return (
    <div className="transmission-box overflow-hidden cursor-pointer group">
      {/* Sci-fi geometric elements */}
      <div className="sci-fi-elements"></div>
      <div className="detail-lines"></div>
      <div className="circuit-pattern"></div>
      <div className="scan-line"></div>
      
      {/* File Header Bar */}
      <div className="bg-[rgba(255,255,255,0.05)] border-b border-[var(--transmission-border)] px-3 py-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-sm font-bold ${typeHeaderColors[type]}`}>
              {type}
            </span>
            <span className="text-xs opacity-40">|</span>
            <span className="text-xs font-mono opacity-60">{generateFileId(title, date)}</span>
            <span className="text-xs opacity-40">|</span>
            <div className="flex gap-1">
              {categories.map((category) => (
                <span 
                  key={category}
                  className={`text-xs font-mono ${categoryColors[category]}`}
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs opacity-60">{formatDate(date)}</span>
          </div>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 mr-4">
            <h3 className="text-base font-bold mb-2 group-hover:text-[var(--accent-nasa)] transition-colors">
              {title}
            </h3>
            {summary && (
              <p className="text-sm opacity-70 line-clamp-2 mb-3">
                {summary}
              </p>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex justify-end">
          <div className="flex items-center gap-1 text-gray-500 group-hover:text-[var(--accent-nasa)] transition-colors text-xs shrink-0 font-mono">
            <span>OPEN_TRANSMISSION</span>
            <span>»</span>
          </div>
        </div>
      </div>
    </div>
  )
}