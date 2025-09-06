import { TransmissionType, Category } from '@prisma/client'

interface TransmissionBoxProps {
  title: string
  type: TransmissionType
  categories: Category[]
  date: Date
  summary?: string
}

const typeColors = {
  NEWS: 'text-[var(--accent-cyber)]',
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
    <div className="transmission-box p-6 cursor-pointer group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs tracking-widest opacity-50">TRANSMISSION</span>
          <span className={`text-xs font-bold ${typeColors[type]}`}>
            [{type}]
          </span>
        </div>
        <span className="text-xs opacity-50">
          {date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          }).toUpperCase()}
        </span>
      </div>
      
      <h3 className="text-lg font-bold mb-3 group-hover:text-[var(--accent-cyber)] transition-colors">
        {title}
      </h3>
      
      {summary && (
        <p className="text-sm opacity-70 mb-4 line-clamp-2">
          {summary}
        </p>
      )}
      
      <div className="flex flex-wrap gap-2 mt-4">
        {categories.map((category) => (
          <span 
            key={category}
            className={`text-xs px-2 py-1 rounded ${categoryColors[category]}`}
          >
            {category}
          </span>
        ))}
      </div>
      
      <div className="mt-4 flex items-center gap-2 text-[var(--accent-cyber)] opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-xs">ACCESS TRANSMISSION</span>
        <span className="text-lg">→</span>
      </div>
    </div>
  )
}