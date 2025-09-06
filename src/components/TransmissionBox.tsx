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

const categoryColors = {
  SHIPS: 'bg-blue-500/20 text-blue-400',
  WEAPONS: 'bg-red-500/20 text-red-400',
  GEAR: 'bg-gray-500/20 text-gray-400',
  MEDICAL: 'bg-green-500/20 text-green-400',
  GAMEPLAY: 'bg-purple-500/20 text-purple-400',
  ECONOMY: 'bg-yellow-500/20 text-yellow-400',
  LOCATIONS: 'bg-cyan-500/20 text-cyan-400',
  LORE: 'bg-indigo-500/20 text-indigo-400',
  MOB: 'bg-pink-500/20 text-pink-400',
  OTHER: 'bg-gray-500/20 text-gray-400',
}

export default function TransmissionBox({ 
  title, 
  type, 
  categories, 
  date,
  summary 
}: TransmissionBoxProps) {
  return (
    <div className="transmission-box p-4 cursor-pointer group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs tracking-widest opacity-50">TX</span>
          <span className={`text-xs font-bold ${typeColors[type]}`}>
            [{type}]
          </span>
          <div className="flex gap-1">
            {categories.slice(0, 2).map((category) => (
              <span 
                key={category}
                className={`text-xs px-1.5 py-0.5 rounded ${categoryColors[category]}`}
              >
                {category}
              </span>
            ))}
            {categories.length > 2 && (
              <span className="text-xs opacity-50">+{categories.length - 2}</span>
            )}
          </div>
        </div>
        <span className="text-xs opacity-50">
          {date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          }).toUpperCase()}
        </span>
      </div>
      
      <div className="flex items-start justify-between">
        <div className="flex-1 mr-4">
          <h3 className="text-base font-bold mb-1 group-hover:text-[var(--accent-nasa)] transition-colors">
            {title}
          </h3>
          {summary && (
            <p className="text-sm opacity-70 line-clamp-1">
              {summary}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-1 text-[var(--accent-nasa)] opacity-0 group-hover:opacity-100 transition-opacity text-xs shrink-0">
          <span>ACCESS</span>
          <span>→</span>
        </div>
      </div>
    </div>
  )
}