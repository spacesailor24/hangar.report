'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import TransmissionBox from '@/components/TransmissionBox'
import { TransmissionType, Category } from '@prisma/client'

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

interface Transmission {
  id: string
  title: string
  content: string
  summary: string | null
  type: TransmissionType
  categories: Category[]
  sourceAuthor: string | null
  sourceUrl: string | null
  publishedAt: string
}

async function fetchTransmissions(year?: number, month?: number, day?: number): Promise<Transmission[]> {
  try {
    const params = new URLSearchParams()
    if (year) params.append('year', year.toString())
    if (month !== undefined) params.append('month', month.toString())
    if (day !== undefined) params.append('day', day.toString())

    const response = await fetch(`/api/transmissions?${params.toString()}`)
    if (!response.ok) throw new Error('Failed to fetch')
    
    const data = await response.json()
    return data.transmissions || []
  } catch (error) {
    console.error('Error fetching transmissions:', error)
    return []
  }
}

export default function TimelinePage() {
  const [selectedYear] = useState(2025)
  const [selectedMonth, setSelectedMonth] = useState(0)
  const [transmissions, setTransmissions] = useState<Transmission[]>([])
  const [allTransmissions, setAllTransmissions] = useState<Transmission[]>([])
  const [loading, setLoading] = useState(true)
  const [currentViewDate, setCurrentViewDate] = useState<number | null>(null)
  const [currentViewMonth, setCurrentViewMonth] = useState<number>(0)
  const timelineRef = useRef<HTMLDivElement>(null)
  const dayRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})
  const monthRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})
  const currentViewDateRef = useRef<number | null>(null)

  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate()

  useEffect(() => {
    async function loadAllTransmissions() {
      setLoading(true)
      const data = await fetchTransmissions(selectedYear)
      setAllTransmissions(data)
      setLoading(false)
    }
    
    loadAllTransmissions()
  }, [selectedYear])

  useEffect(() => {
    const monthTransmissions = allTransmissions.filter(transmission => {
      const date = new Date(transmission.publishedAt)
      return date.getMonth() === selectedMonth && 
             date.getFullYear() === selectedYear
    })
    setTransmissions(monthTransmissions)
  }, [allTransmissions, selectedMonth, selectedYear])

  // Sync the ref with the state
  useEffect(() => {
    currentViewDateRef.current = currentViewDate
  }, [currentViewDate])

  const groupedByDay = transmissions.reduce((groups, transmission) => {
    const day = new Date(transmission.publishedAt).getDate()
    if (!groups[day]) groups[day] = []
    groups[day].push(transmission)
    return groups
  }, {} as Record<number, Transmission[]>)

  const availableDays = new Set(Object.keys(groupedByDay).map(Number))
  
  // Get available months from all transmissions
  const availableMonths = new Set(
    allTransmissions.map(transmission => new Date(transmission.publishedAt).getMonth())
  )

  // Handle scroll to detect current visible date
  const handleScroll = useCallback(() => {
    // Use window scroll since the page itself is scrolling, not a container
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const windowHeight = window.innerHeight
    const stickyHeaderHeight = 200 // Account for sticky navigation
    const viewportTop = scrollTop + stickyHeaderHeight

    let targetDay = null
    let closestToTop = null
    let closestTopDistance = Infinity

    // First, find the element closest to the top of the viewport
    Object.keys(dayRefs.current).forEach(dayStr => {
      const day = parseInt(dayStr)
      const dayElement = dayRefs.current[day]
      if (dayElement) {
        const rect = dayElement.getBoundingClientRect()
        const elementTop = scrollTop + rect.top
        const elementBottom = scrollTop + rect.bottom
        
        // Check if element is visible in the viewport
        if (elementBottom > viewportTop && elementTop < scrollTop + windowHeight) {
          // Distance from element top to viewport top (after sticky header)
          const distanceFromTop = Math.abs(elementTop - viewportTop)
          
          if (distanceFromTop < closestTopDistance) {
            closestTopDistance = distanceFromTop
            closestToTop = day
          }
        }
      }
    })

    // Check if we're near the bottom of the page
    const documentHeight = document.documentElement.scrollHeight
    const isNearBottom = scrollTop + windowHeight >= documentHeight - 50

    if (isNearBottom) {
      // When near bottom, find the bottommost visible element (smallest day number since sorted desc)
      let bottomMostDay = null
      let bottomMostPosition = -1
      
      Object.keys(dayRefs.current).forEach(dayStr => {
        const day = parseInt(dayStr)
        const dayElement = dayRefs.current[day]
        if (dayElement) {
          const rect = dayElement.getBoundingClientRect()
          const elementBottom = scrollTop + rect.bottom
          
          // Check if element is visible
          if (rect.top < windowHeight && rect.bottom > stickyHeaderHeight) {
            // Find the element that's furthest down the page (highest bottom position)
            if (elementBottom > bottomMostPosition) {
              bottomMostPosition = elementBottom
              bottomMostDay = day
            }
          }
        }
      })
      targetDay = bottomMostDay
      console.log('Near bottom - targeting day:', bottomMostDay)
    } else {
      targetDay = closestToTop
    }

    if (targetDay !== null && targetDay !== currentViewDateRef.current) {
      console.log('Updating current view date from', currentViewDateRef.current, 'to:', targetDay, isNearBottom ? '(near bottom)' : '(closest to top)')
      currentViewDateRef.current = targetDay
      setCurrentViewDate(targetDay)
    }
  }, [])

  useEffect(() => {
    // Listen to window scroll instead of container scroll
    window.addEventListener('scroll', handleScroll, { passive: true })
    // Initial scroll detection
    setTimeout(handleScroll, 100)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Trigger scroll detection when transmissions load
  useEffect(() => {
    if (transmissions.length > 0) {
      setTimeout(handleScroll, 200)
    }
  }, [transmissions, handleScroll])

  const scrollToDay = (day: number) => {
    const dayElement = dayRefs.current[day]
    if (dayElement && timelineRef.current) {
      dayElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }
  }

  const scrollToMonth = (month: number) => {
    if (month !== selectedMonth) {
      setSelectedMonth(month)
      // Wait for the month to update and then scroll to the first day
      setTimeout(() => {
        if (timelineRef.current) {
          timelineRef.current.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
        }
      }, 100)
    }
  }

  const getTransmissionTypeColor = (type: TransmissionType) => {
    switch (type) {
      case TransmissionType.NEWS:
        return 'bg-[var(--accent-nasa)]'
      case TransmissionType.LEAK:
        return 'bg-[var(--accent-warning)]'
      case TransmissionType.OFFICIAL:
        return 'bg-blue-400'
      case TransmissionType.RUMOR:
        return 'bg-purple-400'
      default:
        return 'bg-[var(--accent-nasa)]'
    }
  }

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-10 bg-[rgba(0,0,0,0.9)] backdrop-blur-sm border-b border-[var(--transmission-border)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between px-4 py-2 text-xs">
            <span className="text-[var(--accent-nasa)]">YEAR: {selectedYear}</span>
            <span className="text-[var(--accent-nasa)]">CHRONOLOGICAL FEED</span>
          </div>
          
          <div className="overflow-x-auto">
            <div className="flex border-t border-[var(--transmission-border)]">
              {months.map((month, index) => {
                const hasTransmissions = availableMonths.has(index)
                const isSelected = selectedMonth === index
                
                return (
                  <button
                    key={month}
                    onClick={() => hasTransmissions ? scrollToMonth(index) : null}
                    disabled={!hasTransmissions}
                    className={`px-4 py-3 text-xs tracking-wider whitespace-nowrap transition-all ${
                      isSelected && hasTransmissions
                        ? 'text-[var(--accent-nasa)] border-b-2 border-[var(--accent-nasa)] bg-[rgba(255,85,0,0.1)]'
                        : hasTransmissions
                        ? 'text-[var(--foreground)] hover:text-[var(--accent-nasa)] hover:bg-[rgba(255,255,255,0.05)] cursor-pointer'
                        : 'text-gray-600 opacity-50 cursor-not-allowed'
                    } ${index === currentMonth ? 'font-bold' : ''}`}
                  >
                    {month.toUpperCase()}
                  </button>
                )
              })}
            </div>
          </div>
          
          <div className="overflow-x-auto border-t border-[var(--transmission-border)]">
            <div className="flex">
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                const hasTransmissions = availableDays.has(day)
                const isCurrentView = currentViewDate === day
                
                return (
                  <button
                    key={day}
                    onClick={() => hasTransmissions ? scrollToDay(day) : null}
                    disabled={!hasTransmissions}
                    className={`px-3 py-2 text-xs tracking-wider transition-all ${
                      isCurrentView && hasTransmissions
                        ? 'text-[var(--accent-nasa)] bg-[rgba(255,85,0,0.1)] border-b-2 border-[var(--accent-nasa)]'
                        : hasTransmissions
                        ? 'text-[var(--foreground)] hover:text-[var(--accent-nasa)] hover:bg-[rgba(255,255,255,0.05)] cursor-pointer'
                        : 'text-gray-600 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div ref={timelineRef} className="max-w-7xl mx-auto px-4 py-8">
        {Object.entries(groupedByDay)
          .sort(([a], [b]) => Number(b) - Number(a))
          .map(([day, transmissions]) => (
            <div 
              key={day} 
              className="mb-12"
              ref={el => dayRefs.current[parseInt(day)] = el}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="text-3xl font-bold text-[var(--accent-nasa)]">
                  {String(day).padStart(2, '0')}
                </div>
                <div className="flex-1 h-[1px] bg-[var(--transmission-border)]"></div>
                <div className="text-sm opacity-60">
                  {transmissions.length} TRANSMISSION{transmissions.length !== 1 ? 'S' : ''}
                </div>
              </div>
              
              <div className="space-y-4 pl-12">
                {transmissions.map(transmission => (
                  <div key={transmission.id} className="relative">
                    <div className={`absolute -left-12 top-6 w-4 h-4 rounded-full ${getTransmissionTypeColor(transmission.type)} animate-pulse`}></div>
                    <div className="absolute -left-[42px] top-10 bottom-0 w-[1px] bg-[var(--transmission-border)]"></div>
                    <TransmissionBox
                      transmission={{
                        ...transmission,
                        publishedAt: new Date(transmission.publishedAt)
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
          
        {loading && (
          <div className="text-center py-20">
            <p className="text-[var(--accent-nasa)] mb-2">SCANNING TRANSMISSION LOGS...</p>
            <p className="text-sm opacity-60">
              Accessing archived communications
            </p>
          </div>
        )}
        
        {!loading && transmissions.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[var(--accent-nasa)] mb-2">NO TRANSMISSIONS DETECTED</p>
            <p className="text-sm opacity-60">
              No communications recorded for this time period
            </p>
          </div>
        )}
      </div>
    </div>
  )
}