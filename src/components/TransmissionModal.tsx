'use client'

import { useEffect, useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { TransmissionType, Category } from '@prisma/client'

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

interface TransmissionModalProps {
  transmission: Transmission
  onClose: () => void
  initialRect?: DOMRect
}

export default function TransmissionModal({ transmission, onClose, initialRect }: TransmissionModalProps) {
  const [isAnimating, setIsAnimating] = useState(true)
  const [scrollPercentage, setScrollPercentage] = useState(0)
  const [isScrollable, setIsScrollable] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [showFlash, setShowFlash] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const typeColors = {
    OFFICIAL: 'text-orange-500',
    NEWS: 'text-blue-400',
    LEAK: 'text-red-400',
    RUMOR: 'text-yellow-500',
    ANALYSIS: 'text-purple-400',
  }

  const categoryColors = {
    SHIPS: 'bg-blue-900/20 text-blue-300 border-blue-500/30',
    GAMEPLAY: 'bg-green-900/20 text-green-300 border-green-500/30',
    LOCATIONS: 'bg-purple-900/20 text-purple-300 border-purple-500/30',
    ECONOMY: 'bg-yellow-900/20 text-yellow-300 border-yellow-500/30',
    GEAR: 'bg-orange-900/20 text-orange-300 border-orange-500/30',
    MEDICAL: 'bg-red-900/20 text-red-300 border-red-500/30',
    WEAPONS: 'bg-gray-900/20 text-gray-300 border-gray-500/30',
    MOB: 'bg-pink-900/20 text-pink-300 border-pink-500/30',
  }

  const generateFileId = (title: string, date: Date) => {
    const shortTitle = title.replace(/\s+/g, '').slice(0, 8).toUpperCase()
    const timestamp = date.toISOString().slice(2, 10).replace(/-/g, '')
    return `TX-${shortTitle.slice(0, 3)}-${date.getDate().toString().padStart(2, '0')}-${date.getFullYear().toString().slice(-2)}`
  }

  useEffect(() => {
    // Disable body scrolling when modal is open
    document.body.style.overflow = 'hidden'
    
    // Start animation
    setTimeout(() => setIsAnimating(false), 50)

    // Check if content is scrollable after render
    setTimeout(() => {
      if (scrollContainerRef.current) {
        const { scrollHeight, clientHeight } = scrollContainerRef.current
        setIsScrollable(scrollHeight > clientHeight)
      }
    }, 100)

    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = 'unset'
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    const scrollTop = target.scrollTop
    const scrollHeight = target.scrollHeight
    const clientHeight = target.clientHeight
    
    const percentage = scrollTop / (scrollHeight - clientHeight)
    const clampedPercentage = isNaN(percentage) ? 0 : Math.min(percentage, 1)
    setScrollPercentage(clampedPercentage)
    setIsScrollable(scrollHeight > clientHeight)
    
    // Check if we've reached 100% and trigger flash animation
    if (clampedPercentage >= 0.99 && !isComplete) {
      setIsComplete(true)
      setShowFlash(true)
      
      // Flash animation sequence
      setTimeout(() => setShowFlash(false), 150)
      setTimeout(() => setShowFlash(true), 300)
      setTimeout(() => setShowFlash(false), 450)
    } else if (clampedPercentage < 0.99 && isComplete) {
      setIsComplete(false)
      setShowFlash(false)
    }
  }

  const handleClose = () => {
    setIsAnimating(true)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  return (
    <div 
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        isAnimating ? 'bg-black/0' : 'bg-black/80'
      }`}
      onClick={handleClose}
    >
      {/* Backdrop blur */}
      <div className={`absolute inset-0 backdrop-blur-sm transition-opacity duration-300 ${
        isAnimating ? 'opacity-0' : 'opacity-100'
      }`} />
      
      {/* Modal content */}
      <div 
        className={`relative w-full h-full flex items-center justify-center p-4 transition-all duration-500 ease-out ${
          isAnimating 
            ? 'scale-95 opacity-0 translate-y-4' 
            : 'scale-100 opacity-100 translate-y-0'
        }`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded transition-all duration-200 flex items-center gap-2 text-red-400 hover:text-red-300 font-mono text-sm backdrop-blur-sm"
          aria-label="Close transmission"
        >
          <span>TERMINATE</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="m15 9-6 6"/>
            <path d="m9 9 6 6"/>
          </svg>
        </button>


        {/* Content container */}
        <div 
          className="w-full max-w-5xl max-h-[90vh] bg-black border border-[var(--transmission-border)] shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Progress Tracker */}
          {isScrollable && (
            <div className="border-b border-[var(--transmission-border)] px-6 py-3 bg-black/50 backdrop-blur-sm min-h-[56px]">
              <div className="flex items-center justify-between gap-4 font-mono text-sm h-8">
                <span className={`transition-colors duration-300 ${
                  isComplete ? 'text-green-400' : 'text-[var(--accent-nasa)]'
                }`}>
                  {isComplete ? 'TRANSMISSION REVIEWED: COMPLETE' : `TRANSMISSION REVIEWED: ${Math.round(scrollPercentage * 100)}%`}
                </span>
                
                {isComplete ? (
                  <div className={`w-8 h-8 rounded-full border-2 border-green-400 flex items-center justify-center transition-all duration-300 ${
                    showFlash ? 'bg-green-400 shadow-lg shadow-green-400/50 scale-110' : 'bg-green-400/20'
                  }`}>
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="3"
                      className={`transition-colors duration-300 ${
                        showFlash ? 'text-black' : 'text-green-400'
                      }`}
                    >
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                  </div>
                ) : (
                  <div className="flex-1 max-w-xs h-2 bg-white/20 rounded overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[var(--accent-nasa)] to-orange-600 transition-all duration-300"
                      style={{ width: `${scrollPercentage * 100}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Scrollable content */}
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto text-white relative" 
            onScroll={handleScroll}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,135,0,0.03)_0%,transparent_70%)] pointer-events-none" />
            
            <div className="relative z-10 px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className={`text-xs px-3 py-1.5 rounded-sm font-bold border ${typeColors[transmission.type]} bg-black/50 border-current/20`}>
                  {transmission.type}
                </span>
                <span className="text-xs font-mono opacity-40">|</span>
                <span className="text-xs font-mono opacity-60">
                  {generateFileId(transmission.title, transmission.publishedAt)}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold mb-4 font-mono tracking-wider">
                {transmission.title}
              </h1>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {transmission.categories.map((category) => (
                  <span
                    key={category}
                    className={`text-xs px-2 py-1 rounded border font-mono ${categoryColors[category] || 'bg-gray-900/20 text-gray-300 border-gray-500/30'}`}
                  >
                    {category}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center gap-4 text-sm opacity-60">
                <span>{transmission.sourceAuthor || 'Unknown'}</span>
                <span>•</span>
                <span>{transmission.publishedAt.toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-invert prose-orange max-w-none">
              <div className="transmission-content">
                <ReactMarkdown>{transmission.content}</ReactMarkdown>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}