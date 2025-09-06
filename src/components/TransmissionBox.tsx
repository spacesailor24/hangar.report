'use client'

import { useState } from 'react'
import { TransmissionType, Category } from '@prisma/client'
import TransmissionModal from './TransmissionModal'

interface Transmission {
  id: string
  title: string
  content: string
  summary: string | null
  type: TransmissionType
  categories: Category[]
  sourceAuthor: string | null
  sourceUrl: string | null
  publishedAt: Date
}

interface TransmissionBoxProps {
  transmission: Transmission
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
  transmission
}: TransmissionBoxProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const handleClick = () => {
    setIsModalOpen(true)
  }
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
    <>
      <div className="transmission-box overflow-hidden cursor-pointer group" onClick={handleClick}>
      {/* Sci-fi geometric elements */}
      <div className="sci-fi-elements"></div>
      <div className="detail-lines"></div>
      <div className="circuit-pattern"></div>
      <div className="scan-line"></div>
      
      {/* File Header Bar */}
      <div className="bg-[rgba(255,255,255,0.05)] border-b border-[var(--transmission-border)] px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${typeColors[transmission.type].replace('text-', 'bg-')}`}></div>
            <span className={`text-xs font-bold ${typeColors[transmission.type]}`}>
              {transmission.type}
            </span>
            <span className="text-xs opacity-40">|</span>
            <span className="text-xs font-mono opacity-60">{generateFileId(transmission.title, transmission.publishedAt)}</span>
            <span className="text-xs opacity-40">|</span>
            <div className="flex gap-1">
              {transmission.categories.map((category) => (
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
            {transmission.sourceAuthor && (
              <>
                {transmission.sourceUrl ? (
                  <a 
                    href={transmission.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs opacity-60 hover:opacity-90 hover:text-[var(--accent-nasa)] transition-colors underline flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {transmission.sourceAuthor}
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15,3 21,3 21,9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                ) : (
                  <span className="text-xs opacity-60">{transmission.sourceAuthor}</span>
                )}
                <span className="text-xs opacity-40">|</span>
              </>
            )}
            <span className="text-xs opacity-60">{formatDate(transmission.publishedAt)}</span>
          </div>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 mr-4">
            <h3 className="text-base font-bold mb-2 group-hover:text-[var(--accent-nasa)] transition-colors">
              {transmission.title}
            </h3>
            {transmission.summary && (
              <p className="text-sm opacity-70 line-clamp-2 mb-3">
                {transmission.summary}
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

      {/* Modal */}
      {isModalOpen && (
        <TransmissionModal 
          transmission={transmission}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  )
}